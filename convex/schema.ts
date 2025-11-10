import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    passwordHash: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  posts: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    userAvatar: v.optional(v.string()),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    timestamp: v.number(),
    likes: v.array(v.id("users")),
  })
    .index("by_userId", ["userId"])
    .index("by_timestamp", ["timestamp"]),
});