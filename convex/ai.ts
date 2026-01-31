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

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardBlock {
  topic: string;
  count: number;
  cards: Flashcard[];
}

interface TrueFalseQuestion {
  id: string;
  question: string;
  correctAnswer: boolean;
  explanation: string;
}

interface TrueFalseQuiz {
  topic: string;
  questionCount: number;
  questions: TrueFalseQuestion[];
}

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
      role: "user" | "assistant";
    };
  }[];
}

// Generate a response from Perplexity (AI Action)
export const generateResponse = action({
  args: {
    chatId: v.id("chats"),
    userMessage: v.string(),
    messageId: v.optional(v.id("messages")),
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
    const rawHistory = history
      .filter((m) => m._id !== args.messageId) // Deduplicate current message by ID
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Sanitize history to ensure strict role alternation (required by Perplexity)
    const sanitizedHistory: { role: "user" | "assistant"; content: string }[] =
      [];
    let lastRole: "user" | "assistant" | null = null;

    for (const msg of rawHistory) {
      if (msg.role !== lastRole) {
        sanitizedHistory.push(msg);
        lastRole = msg.role;
      } else {
        // If roles are consecutive, replace the previous one with the newer one
        // to keep the most recent context
        sanitizedHistory[sanitizedHistory.length - 1] = msg;
      }
    }

    // Ensure the last role in history is NOT 'user' if we're about to append a 'user' message
    if (
      sanitizedHistory.length > 0 &&
      sanitizedHistory[sanitizedHistory.length - 1].role === "user"
    ) {
      sanitizedHistory.pop();
    }

    // CRITICAL: The first message after the system message MUST be a 'user' message
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== "user") {
      sanitizedHistory.shift();
    }

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
- **Greetings** (hi, hello, hey): Respond warmly. Example: "Hey there! 👋 Ready to learn something new, take a quiz, or practice with flashcards? Let me know what you'd like to explore!"
- **Thanks/Gratitude** (thank you, thanks, appreciate it): Acknowledge genuinely. Example: "You're welcome! 😊 I'm happy to help. Let me know if there's anything else you'd like to learn, quiz yourself on, or review with flashcards!"
- **Farewells** (bye, goodbye, see you): Respond kindly. Example: "See you later! 👋 Good luck with your learning, and come back anytime you want to practice!"
- **Small talk**: Engage briefly but gently steer back to learning. Example: "I appreciate the chat! 😄 If you ever want to test your knowledge or review terms, just ask me for a quiz or some flashcards."
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

## TRUE/FALSE QUIZ GENERATION
When users ask for True/False questions (keywords: true or false, true/false, T/F):
1. Generate the requested number of true/false questions (default to 5 if not specified).
2. Ensure a good mix of both True and False answers.
3. Format your response ONLY as this exact JSON structure (no extra text):
{
  "trueFalseQuiz": {
    "topic": "Topic Name",
    "questionCount": 5,
    "questions": [
      {
        "id": "tf1",
        "question": "Statement to evaluate.",
        "correctAnswer": true,
        "explanation": "Detailed explanation."
      }
    ]
  }
}

## FLASHCARD GENERATION
When users ask for flashcards (keywords: flashcards, cards, flip cards, practice cards):
1. Generate the requested number of flashcards (default to 5 if not specified).
2. Each flashcard should have a "front" (question, term, or concept) and a "back" (answer, definition, or explanation).
3. Keep the "front" and "back" concise but informative.
4. Format your response ONLY as this exact JSON structure (no extra text):
{
  "flashcards": {
    "topic": "Topic Name",
    "count": 5,
    "cards": [
      {
        "id": "f1",
        "front": "Term or Question",
        "back": "Definition or Answer"
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
6. End with a helpful follow-up, like offering a quiz, suggesting flashcards for review, or asking if they need more detail.

## RULES
- Always be helpful and on-topic.
- Never be rude, dismissive, or unhelpful.
- If you don't know something, admit it honestly.
- Keep responses focused and avoid unnecessary filler.
- Match the user's energy (casual vs. formal).
- **CRITICAL: Always use Markdown format for links: [Link Description](URL). Never provide URLs as plain text.** Result should be clickable and elegant.`,
          },
          ...sanitizedHistory,
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
    let flashcards: FlashcardBlock | undefined = undefined;
    let trueFalseQuiz: TrueFalseQuiz | undefined = undefined;

    // Improved heuristic: check for both "quiz" and "questions" to reduce false positives
    if (content.includes('"quiz"') && content.includes('"questions"')) {
      try {
        // Attempt to extract JSON from the response if it's wrapped in markdown code blocks
        const jsonMatch =
          content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```\n([\s\S]*?)\n```/);

        let jsonString = jsonMatch ? jsonMatch[1] : null;

        // Fallback: If no code block, check if the whole response looks like JSON
        if (!jsonString && content.trim().startsWith("{")) {
          jsonString = content.trim();
        }

        if (jsonString) {
          const parsed = JSON.parse(jsonString);
          if (parsed.quiz) {
            quiz = parsed.quiz;
          }
        }
      } catch (e) {
        console.error("Failed to parse quiz JSON", e);
      }
    }

    // Parse flashcards if present
    if (content.includes('"flashcards"') && content.includes('"cards"')) {
      try {
        const jsonMatch =
          content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```\n([\s\S]*?)\n```/);

        let jsonString = jsonMatch ? jsonMatch[1] : null;

        if (!jsonString && content.trim().startsWith("{")) {
          jsonString = content.trim();
        }

        if (jsonString) {
          const parsed = JSON.parse(jsonString);
          if (parsed.flashcards) {
            flashcards = parsed.flashcards;
          }
        }
      } catch (e) {
        console.error("Failed to parse flashcards JSON", e);
      }
    }

    // Parse True/False quiz if present
    if (
      content.includes('"trueFalseQuiz"') &&
      content.includes('"correctAnswer"')
    ) {
      try {
        const jsonMatch =
          content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```\n([\s\S]*?)\n```/);

        let jsonString = jsonMatch ? jsonMatch[1] : null;

        if (!jsonString && content.trim().startsWith("{")) {
          jsonString = content.trim();
        }

        if (jsonString) {
          const parsed = JSON.parse(jsonString);
          if (parsed.trueFalseQuiz) {
            trueFalseQuiz = parsed.trueFalseQuiz;
          }
        }
      } catch (e) {
        console.error("Failed to parse trueFalseQuiz JSON", e);
      }
    }

    // Clean up content: remove citations and the raw JSON block if quiz/flashcards/trueFalseQuiz were successfully parsed
    let cleanedContent = content.replace(/\[\d+\]/g, "");
    if (quiz || flashcards || trueFalseQuiz) {
      // Remove any content between the first { and the last } that looks like our data models
      // We use a more targeted replacement to avoid over-cleaning
      cleanedContent = cleanedContent
        .replace(/```json\n[\s\S]*?\n```/g, "")
        .replace(/```\n[\s\S]*?\n```/g, "")
        // Handle cases where the AI might have outputted the JSON without code blocks
        .replace(/\{[\s\S]*?"(quiz|flashcards|trueFalseQuiz)"[\s\S]*\}/g, "")
        .trim();

      // Force fixed prefixes for consistency
      if (quiz) {
        cleanedContent = `Here is your quiz on "${quiz.topic}":`;
      } else if (flashcards) {
        cleanedContent = `Here are your flash cards on "${flashcards.topic}":`;
      } else if (trueFalseQuiz) {
        cleanedContent = `Here are your True/False questions on "${trueFalseQuiz.topic}":`;
      }
    }

    // Create assistant message in database
    const messageId: string = await ctx.runMutation(
      internal.chats.createAssistantMessage,
      {
        chatId: args.chatId,
        content: cleanedContent,
        quiz,
        flashcards,
        trueFalseQuiz,
      },
    );

    return {
      messageId,
      content: cleanedContent,
      quiz,
      flashcards,
      trueFalseQuiz,
    };
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
