import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { query, mutation } from "./_generated/server";

// Helper to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Helper to get message limit based on plan
function getMessageLimit(plan?: string): number {
  if (plan === "pro") return Infinity;
  if (plan === "basic") return 50;
  return 5; // free plan
}

// ============ QUERIES ============

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("chats")
      .withIndex("byUserIdAndUpdatedAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Chat not found");
    if (chat.userId !== user._id) throw new Error("Unauthorized");

    return chat;
  },
});

export const getMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Chat not found");
    if (chat.userId !== user._id) throw new Error("Unauthorized");

    return await ctx.db
      .query("messages")
      .withIndex("byChatIdAndCreatedAt", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const getDailyUsage = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const today = getTodayDate();

    const usage = await ctx.db
      .query("dailyUsage")
      .withIndex("byUserIdAndDate", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .unique();

    const limit = getMessageLimit(user.plan);
    const used = usage?.messageCount ?? 0;

    return {
      used,
      limit,
      remaining: limit === Infinity ? Infinity : Math.max(0, limit - used),
    };
  },
});

// ============ MUTATIONS ============

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const chatId = await ctx.db.insert("chats", {
      userId: user._id,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });

    return chatId;
  },
});

export const updateTitle = mutation({
  args: {
    chatId: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Chat not found");
    if (chat.userId !== user._id) throw new Error("Unauthorized");

    await ctx.db.patch(args.chatId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Chat not found");
    if (chat.userId !== user._id) throw new Error("Unauthorized");

    // Delete all messages in the chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the chat
    await ctx.db.delete(args.chatId);
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Chat not found");
    if (chat.userId !== user._id) throw new Error("Unauthorized");

    // Check daily limit
    const today = getTodayDate();
    const limit = getMessageLimit(user.plan);

    const usage = await ctx.db
      .query("dailyUsage")
      .withIndex("byUserIdAndDate", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .unique();

    const currentUsage = usage?.messageCount ?? 0;

    if (currentUsage >= limit) {
      throw new Error("DAILY_LIMIT_REACHED");
    }

    // Create user message
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: "user",
      content: args.content,
      createdAt: Date.now(),
    });

    // Increment daily usage
    if (usage) {
      await ctx.db.patch(usage._id, {
        messageCount: usage.messageCount + 1,
      });
    } else {
      await ctx.db.insert("dailyUsage", {
        userId: user._id,
        date: today,
        messageCount: 1,
      });
    }

    // Update chat's updatedAt timestamp
    await ctx.db.patch(args.chatId, {
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const answerQuestion = mutation({
  args: {
    messageId: v.id("messages"),
    questionId: v.string(),
    answer: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D"),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const message = await ctx.db.get(args.messageId);

    if (!message) throw new Error("Message not found");
    if (!message.quiz) throw new Error("Message does not contain a quiz");

    // Verify ownership via chat
    const chat = await ctx.db.get(message.chatId);
    if (!chat || chat.userId !== user._id) throw new Error("Unauthorized");

    // Update the specific question's userAnswer
    const updatedQuiz = {
      ...message.quiz,
      questions: message.quiz.questions.map((q) =>
        q.id === args.questionId ? { ...q, userAnswer: args.answer } : q,
      ),
    };

    await ctx.db.patch(args.messageId, { quiz: updatedQuiz });
  },
});
