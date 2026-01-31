import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

interface QuizOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctKey: "A" | "B" | "C" | "D";
  explanation: string;
}

interface Quiz {
  topic: string;
  questionCount: number;
  questions: QuizQuestion[];
}

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
      role: "user" | "assistant";
    };
  }[];
}

// Generate a response from Perplexity
export const generateResponse = action({
  args: {
    chatId: v.id("chats"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      throw new Error("Perplexity API key not configured");
    }

    // Fetch recent message history
    const history: Doc<"messages">[] = await ctx.runQuery(
      internal.chats.getRecentMessages,
      {
        chatId: args.chatId,
      },
    );

    // Format messages for Perplexity, omitting the current message if it's already in history
    const formattedHistory = history
      .filter((m) => m.content !== args.userMessage) // Simple deduplication
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Call Perplexity API
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are Vquiz, a friendly and helpful AI quiz and learning assistant.

## IDENTITY & PERSONALITY
- You are warm, encouraging, and supportive.
- You have a casual but professional tone.
- You celebrate user successes and provide encouragement.
- You are concise but thorough when explaining concepts.

## HANDLING CONVERSATION
When users send casual messages like greetings or expressions of gratitude:
- **Greetings** (hi, hello, hey): Respond warmly. Example: "Hey there! 👋 Ready to learn something new or take a quiz? Let me know what you'd like to explore!"
- **Thanks/Gratitude** (thank you, thanks, appreciate it): Acknowledge genuinely. Example: "You're welcome! 😊 I'm happy to help. Let me know if there's anything else you'd like to learn or quiz yourself on!"
- **Farewells** (bye, goodbye, see you): Respond kindly. Example: "See you later! 👋 Good luck with your learning, and come back anytime you want to practice!"
- **Small talk**: Engage briefly but gently steer back to learning. Example: "I appreciate the chat! 😄 If you ever want to test your knowledge on a topic, just ask me for a quiz."
- **Praise/Compliments**: Be humble and appreciative. Example: "Thanks so much! That means a lot. 🙏 I'm here whenever you need help learning or practicing."
- **Confusion or unclear messages**: Ask for clarification politely. Example: "Hmm, I'm not quite sure what you mean. Could you rephrase that? I'd love to help!"

## QUIZ GENERATION
When users ask for quizzes (keywords: quiz, test, MCQ, questions, practice):
1. Generate the requested number of multiple-choice questions (default to 5 if not specified).
2. Make questions progressively challenging.
3. Ensure all options are plausible to make it a good learning experience.
4. **CRITICAL: Vary the correct answer keys (A, B, C, D) across all questions. Avoid making the same key (e.g., "A") the correct answer for multiple consecutive questions or for all questions in the quiz.**
5. Format your response ONLY as this exact JSON structure (no extra text):
{
  "quiz": {
    "topic": "Topic Name",
    "questionCount": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Question text?",
        "options": [
          {"key": "A", "text": "Option A"},
          {"key": "B", "text": "Option B"},
          {"key": "C", "text": "Option C"},
          {"key": "D", "text": "Option D"}
        ],
        "correctKey": "B",
        "explanation": "Explanation why B is correct"
      }
    ]
  }
}

## ANSWERING QUESTIONS
When users ask educational or factual questions:
1. Provide helpful, accurate, and concise answers.
2. Use clear Markdown formatting:
   - Use **headings** (##) to organize sections.
   - Use **bullet points** for lists.
   - Use **bold** for key terms.
   - Use **code blocks** for code examples.
3. Break complex topics into digestible chunks.
4. Provide examples when helpful.
5. DO NOT include citation numbers like [1], [2], etc.
6. End with a helpful follow-up, like offering a quiz or asking if they need more detail.

## RULES
- Always be helpful and on-topic.
- Never be rude, dismissive, or unhelpful.
- If you don't know something, admit it honestly.
- Keep responses focused and avoid unnecessary filler.
- Match the user's energy (casual vs. formal).`,
          },
          ...formattedHistory,
          {
            role: "user",
            content: args.userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API Error:", errorText);
      throw new Error("Failed to generate AI response");
    }

    const data = (await response.json()) as PerplexityResponse;
    const content = data.choices[0].message.content;

    // Try to parse quiz if requested
    let quiz: Quiz | undefined = undefined;
    // Simple heuristic to check if it might be a quiz response
    if (content.includes('"quiz"')) {
      try {
        // Attempt to extract JSON from the response if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```\n([\s\S]*?)\n```/) || [null, content];

        const jsonString = jsonMatch[1] || content;

        const parsed = JSON.parse(jsonString);
        if (parsed.quiz) {
          quiz = parsed.quiz;
        }
      } catch (e) {
        console.error("Failed to parse quiz JSON", e);
        // Not a quiz or malformed JSON, just regular response
      }
    }

    // Clean up content: remove citations like [1], [2]
    const cleanedContent = content.replace(/\[\d+\]/g, "");

    // Create assistant message in database
    await ctx.runMutation(internal.chats.createAssistantMessage, {
      chatId: args.chatId,
      content: quiz ? `Here's your quiz on ${quiz.topic}:` : cleanedContent,
      quiz,
    });

    return { content: cleanedContent, quiz };
  },
});

// Generate a concise title for a chat based on the first user message
export const generateChatTitle = action({
  args: {
    chatId: v.id("chats"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      throw new Error("Perplexity API key not configured");
    }

    try {
      // Call Perplexity API with specialized title generation prompt
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content: `You are a chat title generator. Given a user's message, create a short, descriptive title (3-5 words maximum) that captures the main topic or question. 

Rules:
- Return ONLY the title text, nothing else
- **NO markdown formatting (no **, no __, no #, etc.)**
- No quotes, no punctuation at the end
- Be concise and clear
- Capture the essence of what the user is asking about
- Use title case (capitalize main words)

Examples:
User: "Generate 5 MCQs about JavaScript" → "JavaScript Multiple Choice Quiz"
User: "What is the capital of France?" → "France Capital Question"
User: "Explain quantum computing to a 10-year-old" → "Quantum Computing Simplified"
User: "How do I learn React?" → "Learning React Guide"`,
              },
              {
                role: "user",
                content: args.userMessage,
              },
            ],
            temperature: 0.5,
            max_tokens: 20,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Perplexity API Error (Title Generation):", errorText);
        throw new Error("Failed to generate chat title");
      }

      const data = await response.json();
      let title = data.choices[0].message.content.trim();

      // Clean up the title: remove quotes if present
      title = title.replace(/^["']|["']$/g, "");

      // Limit to 60 characters max
      if (title.length > 60) {
        title = title.substring(0, 57) + "...";
      }

      // Auto-update the chat title
      await ctx.runMutation(internal.chats.autoUpdateChatTitle, {
        chatId: args.chatId,
        title,
      });

      return { title };
    } catch (error) {
      console.error("Failed to generate chat title:", error);
      // Don't throw error - just return null and keep "New Chat" title
      return { title: null };
    }
  },
});
