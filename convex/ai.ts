import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

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
            content: `You are Vquiz, an AI quiz assistant.

When users ask for quizzes:
1. Generate the requested number of multiple-choice questions
2. Format your response as JSON:
{
  "quiz": {
    "topic": "Topic Name",
    "questionCount": 3,
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

When users ask regular questions:
1. Provide helpful, concise answers.
2. Use clear Markdown formatting with headings (##), bullet points, and paragraphs.
3. DO NOT include citation numbers like [1], [2], etc. in your response.
4. Ensure the output is clean and easy to read.`,
          },
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

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Try to parse quiz if requested
    let quiz = undefined;
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
