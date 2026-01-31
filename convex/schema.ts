import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    email: v.optional(v.string()),
    clerkUserId: v.string(),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    plan: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  }).index("byClerkUserId", ["clerkUserId"]),

  chats: defineTable({
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserId", ["userId"])
    .index("byUserIdAndUpdatedAt", ["userId", "updatedAt"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
    // Quiz data (optional)
    quiz: v.optional(
      v.object({
        topic: v.string(),
        questionCount: v.number(),
        questions: v.array(
          v.object({
            id: v.string(),
            question: v.string(),
            options: v.array(
              v.object({
                key: v.union(
                  v.literal("A"),
                  v.literal("B"),
                  v.literal("C"),
                  v.literal("D"),
                ),
                text: v.string(),
              }),
            ),
            correctKey: v.union(
              v.literal("A"),
              v.literal("B"),
              v.literal("C"),
              v.literal("D"),
            ),
            explanation: v.string(),
            userAnswer: v.optional(
              v.union(
                v.literal("A"),
                v.literal("B"),
                v.literal("C"),
                v.literal("D"),
              ),
            ),
          }),
        ),
      }),
    ),
    // Flashcard data (optional)
    flashcards: v.optional(
      v.object({
        topic: v.string(),
        count: v.number(),
        cards: v.array(
          v.object({
            id: v.string(),
            front: v.string(),
            back: v.string(),
          }),
        ),
      }),
    ),
    // True/False Quiz data (optional)
    trueFalseQuiz: v.optional(
      v.object({
        topic: v.string(),
        questionCount: v.number(),
        questions: v.array(
          v.object({
            id: v.string(),
            question: v.string(),
            correctAnswer: v.boolean(),
            explanation: v.string(),
            userAnswer: v.optional(v.boolean()),
          }),
        ),
      }),
    ),
    // Quiz Summary (optional)
    isSummary: v.optional(v.boolean()),
    summaryData: v.optional(
      v.object({
        correct: v.number(),
        total: v.number(),
        score: v.number(),
        topic: v.string(),
      }),
    ),
    // Feedback (optional)
    feedback: v.optional(
      v.object({
        rating: v.union(v.literal("like"), v.literal("dislike")),
        comment: v.optional(v.string()),
      }),
    ),
  })
    .index("byChatId", ["chatId"])
    .index("byChatIdAndCreatedAt", ["chatId", "createdAt"]),

  dailyUsage: defineTable({
    userId: v.id("users"),
    date: v.string(), // Format: "YYYY-MM-DD"
    messageCount: v.number(),
  }).index("byUserIdAndDate", ["userId", "date"]),
});
