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
When users ask for quizzes (keywords: quiz, test, MCQ, questions, practice, "Give me X questions"):
1. Generate the requested number of multiple-choice questions (default to 5 if not specified). **If the user specifies a number (e.g., "10 MCQ questions"), you MUST generate exactly that number.**
2. Make questions progressively challenging.
3. Ensure all options are plausible to make it a good learning experience.
4. **CRITICAL: Vary the correct answer keys (A, B, C, D) across all questions. Avoid making the same key (e.g., "A") the correct answer for multiple consecutive questions or for all questions in the quiz.**
5. **INTENT RECOGNITION**: Treat phrases like "Give me 10 MCQ questions" as a direct request for a quiz.
6. Format your response ONLY as this exact JSON structure (no extra text):
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
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API Error:", errorText);
      throw new Error("Failed to generate AI response");
    }

    const data = (await response.json()) as PerplexityResponse;
    const content = data.choices[0].message.content;

    // Helper to repair truncated JSON
    const repairJson = (text: string) => {
      const repaired = text.trim();
      if (!repaired.startsWith("{")) return null;

      const stack: ("{" | "[")[] = [];
      let inString = false;
      let escape = false;
      let lastQuestionEnd = -1;

      for (let i = 0; i < repaired.length; i++) {
        const char = repaired[i];

        if (char === '"' && !escape) {
          inString = !inString;
        } else if (!inString) {
          if (char === "{") {
            stack.push("{");
          } else if (char === "}") {
            stack.pop();
            // If we just popped a question object (stack: {quiz, topic, questions, [)
            if (stack.length === 3 && stack[2] === "[") {
              lastQuestionEnd = i;
            }
          } else if (char === "[") {
            stack.push("[");
          } else if (char === "]") {
            stack.pop();
          }
        }
        escape = char === "\\" && !escape;
      }

      // If already balanced, return
      if (stack.length === 0 && !inString) return repaired;

      // REPAIR STRATEGY: Try to cut back to the last fully completed question
      if (lastQuestionEnd !== -1) {
        let result = repaired.substring(0, lastQuestionEnd + 1);
        result += "]}"; // Close questions array and quiz/outer objects
        return result;
      }

      // Fallback: Simple bracket closing
      let result = repaired;
      if (inString) result += '"';
      while (stack.length > 0) {
        const type = stack.pop();
        result += type === "{" ? "}" : "]";
      }
      return result;
    };

    // Helper to extract and parse JSON from content
    const extractAndParseJson = (
      content: string,
      type: "quiz" | "flashcards" | "trueFalseQuiz",
    ) => {
      console.log(`[AI] Attempting to extract ${type} from content...`);
      try {
        // 1. Try to find JSON in markdown code blocks (standard)
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          const jsonText = codeBlockMatch[1];
          try {
            const parsed = JSON.parse(jsonText);
            if (parsed[type]) return parsed[type];
          } catch (e) {
            const repaired = repairJson(jsonText);
            if (repaired) {
              try {
                const parsed = JSON.parse(repaired);
                if (parsed[type]) {
                  console.log(
                    `[AI] Successfully extracted ${type} via repair.`,
                  );
                  return parsed[type];
                }
              } catch (e2) {
                console.error("[AI] Failed to parse repaired code block JSON");
              }
            }
          }
        }

        // 2. Direct extraction from content with repair logic
        const firstBrace = content.indexOf("{");
        if (firstBrace !== -1) {
          const jsonCandidate = content.substring(firstBrace);
          try {
            const parsed = JSON.parse(jsonCandidate);
            if (parsed[type]) return parsed[type];
          } catch (e) {
            const repaired = repairJson(jsonCandidate);
            if (repaired) {
              try {
                const parsed = JSON.parse(repaired);
                if (parsed[type]) {
                  console.log(
                    `[AI] Successfully extracted ${type} via repair.`,
                  );
                  return parsed[type];
                }
              } catch (e3) {
                console.error("[AI] Failed to parse repaired raw JSON");
              }
            }
          }
        }
      } catch (e) {
        console.error(`[AI] Error during ${type} extraction:`, e);
      }
      return undefined;
    };

    // Try to parse quiz if requested
    let quiz: Quiz | undefined = undefined;
    let flashcards: FlashcardBlock | undefined = undefined;
    let trueFalseQuiz: TrueFalseQuiz | undefined = undefined;

    // Detect if content contains JSON-like structures
    const hasQuiz = content.includes('"quiz"');
    const hasFlashcards = content.includes('"flashcards"');
    const hasTrueFalse = content.includes('"trueFalseQuiz"');

    if (hasQuiz) quiz = extractAndParseJson(content, "quiz");
    if (hasFlashcards) flashcards = extractAndParseJson(content, "flashcards");
    if (hasTrueFalse)
      trueFalseQuiz = extractAndParseJson(content, "trueFalseQuiz");

    // Clean up content: remove citations and the raw JSON block
    let cleanedContent = content.replace(/\[\d+\]/g, "");

    // If we extracted data, aggressively remove any trace of JSON from the displayed text
    if (quiz || flashcards || trueFalseQuiz) {
      cleanedContent = cleanedContent
        // Remove code blocks
        .replace(/```(?:json)?\s*[\s\S]*?```/g, "")
        // Remove any bracketed block that looks like it contains the data we just parsed
        .replace(/\{[\s\S]*?"(quiz|flashcards|trueFalseQuiz)"[\s\S]*?\}/g, "")
        // Remove trailing commas and dots that sometimes get left behind
        .replace(/^[,\.\s]+|[,\.\s]+$/g, "")
        // Also remove any trailing partial JSON if it exists
        .replace(/\{[\s\S]*$/g, "")
        .trim();

      // Create a nice looking intro message based on what was generated
      const introParts: string[] = [];
      if (quiz)
        introParts.push(`a **multiple-choice quiz** on **${quiz.topic}**`);
      if (flashcards)
        introParts.push(`**flash cards** for **${flashcards.topic}**`);
      if (trueFalseQuiz)
        introParts.push(`a **True/False quiz** on **${trueFalseQuiz.topic}**`);

      const mainIntro = `I've prepared ${introParts.join(" and ")} for you! 🚀`;

      // Combine AI's natural text (if any remains) with our forced intro
      if (cleanedContent && cleanedContent.length > 10) {
        cleanedContent = `${cleanedContent}\n\n${mainIntro}`;
      } else {
        cleanedContent = mainIntro;
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
