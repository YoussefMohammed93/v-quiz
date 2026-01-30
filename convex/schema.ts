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
});
