import {
  query,
  mutation,
  QueryCtx,
  internalMutation,
} from "./_generated/server";
import { v, Validator } from "convex/values";
import { UserJSON } from "@clerk/nextjs/server";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getRecentUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").take(5);
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    if (user.avatarStorageId) {
      const url = await ctx.storage.getUrl(user.avatarStorageId);
      if (url) {
        return { ...user, imageUrl: url };
      }
    }

    return user;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateUser = mutation({
  args: {
    name: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const updates: Partial<{
      firstName: string;
      lastName: string;
      avatarStorageId: typeof args.avatarStorageId;
    }> = {};

    if (args.avatarStorageId !== undefined) {
      // If a new avatar is provided and an old one exists, delete the old one
      if (
        user.avatarStorageId &&
        user.avatarStorageId !== args.avatarStorageId
      ) {
        await ctx.storage.delete(user.avatarStorageId);
      }
      updates.avatarStorageId = args.avatarStorageId;
    }

    // Split name into first and last name
    const [firstName, ...lastNameParts] = args.name.split(" ");
    updates.firstName = firstName;
    updates.lastName =
      lastNameParts.length > 0 ? lastNameParts.join(" ") : undefined;

    await ctx.db.patch(user._id, updates);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      email: data.email_addresses[0]?.email_address,
      clerkUserId: data.id,
      imageUrl: data.image_url || "/placeholder.png",
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
    };

    const user = await userByClerkUserId(ctx, data.id);

    if (user === null) {
      await ctx.db.insert("users", { ...userAttributes, plan: "free" });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkUserId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`User with clerkUserId ${clerkUserId} not found`);
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);

  if (!userRecord) throw new Error("Can't get current user");

  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return null;

  return await userByClerkUserId(ctx, identity.subject);
}

async function userByClerkUserId(ctx: QueryCtx, clerkUserId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}
