import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";




export const PostSchema = {
  userId: v.id("users"),
  userName: v.string(),
  userAvatar: v.optional(v.string()),
  content: v.string(),
  imageUrl: v.optional(v.string()),
  timestamp: v.number(),
  likes: v.array(v.id("users")),
  reposts: v.optional(v.array(v.id("users"))),

  originalID: v.optional(v.id("posts")),
  isRepost: v.optional(v.boolean()),
};

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    passwordHash: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  posts: defineTable( PostSchema )
    .index("by_userId", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_originalID", ["originalID"]),
});
