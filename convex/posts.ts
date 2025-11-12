import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { PostSchema } from "./schema";
import { api } from "./_generated/api";
import { ExpressionOrValue } from "convex/server";

/**
 * Create a new post
 */
export const createPost = mutation({
  args: {
    ...PostSchema,
    likes: v.optional(v.array(v.id("users"))),
    reposts: v.optional(v.array(v.id("users"))),
    timestamp: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    if (args.content.length > 500) {
      throw new Error("Post content cannot exceed 500 characters");
    }

    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create post
    const postId = await ctx.db.insert("posts", {
      userId: args.userId,
      userName: args.userName,
      userAvatar: user.avatar,
      content: args.content.trim(),
      imageUrl: args.imageUrl,
      timestamp: Date.now(),
      likes: args.likes || [],
      reposts: args.reposts || [],
      originalID: args.originalID,
      isRepost: args.isRepost || false,
    });

    return postId;
  },
});

/**
 * Get all posts (with pagination support)
 * 
 * This query is designed to be extensible for cursor-based pagination.
 * Current implementation: Returns most recent posts up to limit
 * Future: Can add cursor parameter for infinite scroll
 */
export const getAllPosts = query({
  args: {
    limit: v.optional(v.number()),
    // Future: Add cursor for pagination
    // cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    // Get posts sorted by timestamp (most recent first)
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);

    return posts;
  },
});

/**
 * Get posts by a specific user
 */
export const getUserPosts = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return posts;
  },
});

/**
 * Get a single post by ID
 */
export const getPost = query({
  args: {
    postId: v.optional(v.id("posts"))
  },
  handler: async (ctx, args) => {
    if (!args.postId) {
      return
    }

    const post = await ctx.db.get(args.postId);
    return post;
  },
});

/**
 * Toggle like on a post
 * If user has liked, remove like. If not liked, add like.
 */
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const likes = post.likes || [];
    const hasLiked = likes.includes(args.userId);

    // Toggle like
    const newLikes = hasLiked
      ? likes.filter((id) => id !== args.userId)
      : [...likes, args.userId];

    await ctx.db.patch(args.postId, {
      likes: newLikes,
    });

    return {
      liked: !hasLiked,
      totalLikes: newLikes.length,
    };
  },
});


/**
 * Delete a post (only by the post owner)
 */
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Verify user owns the post
    if (post.userId !== args.userId) {
      throw new Error("You can only delete your own posts");
    }

    await ctx.db.delete(args.postId);

    return {
      success: true,
      message: "Post deleted successfully",
    };
  },
});

/**
 * Get posts count for a user
 */
export const getUserPostsCount = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return posts.length;
  },
});

/**
 * Get total likes received by a user across all their posts
 */
export const getUserTotalLikes = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

    return totalLikes;
  },
});


export const getUserRepost = mutation({
  args: { originalId: v.id("posts"), userId: v.id("users") },
  handler: async (ctx, { originalId, userId }) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_originalID", (q) => q.eq("originalID", originalId))
      .collect();

    // filter by userId
    return posts.find(post => post.userId === userId) || null;
  },
});


/**
 * Toggle like on a post
 * If user has liked, remove like. If not liked, add like.
 */
export const toggleRepost = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const reposts = post.reposts || [];
    const hasReposted = reposts.includes(args.userId);
    let newReposts;

    if (hasReposted) {
      const existingRepost = await ctx.runMutation(api.posts.getUserRepost, { originalId: args.postId, userId: args.userId });
      if (existingRepost) {
        await ctx.db.delete(existingRepost._id);
      }
      newReposts = reposts.filter((id) => id !== args.userId);

    } else {
      const newRepostId = await ctx.runMutation(api.posts.createPost, {
        userId: args.userId,
        userName: args.userName,
        content: post.content,
        imageUrl: post.imageUrl,
        timestamp: Date.now(),
        likes: [],
        reposts: [],
        isRepost: true,
        originalID: args.postId,
      });

      newReposts = [...reposts, args.userId];
    }

    await ctx.db.patch(args.postId, {
      reposts: newReposts,
    });

    return {
      reposted: !hasReposted,
      totalReposts: newReposts.length,
    };
  },
});


/**
 * Get posts with pagination support
 */
export const getPostsPaginated = query({
  args: {
    limit: v.optional(v.number()),   // how many to fetch
    before: v.optional(v.number()),  // timestamp before which to fetch (older)
    after: v.optional(v.number()),   // timestamp after which to fetch (newer)
  },
  handler: async (ctx, { limit = 50, before, after }) => {
    let postsQuery = ctx.db.query('posts').withIndex('by_timestamp');
    
    // convrt both to unknown types
    const beforeTime = before as unknown
    const afterTime = after as unknown

    // Apply filters if provided
    if (before !== undefined) {
      postsQuery = postsQuery.filter(q => q.lt('timestamp', beforeTime as ExpressionOrValue<"timestamp">));
    }
    if (after !== undefined) {
      postsQuery = postsQuery.filter(q => q.gt('timestamp', afterTime as ExpressionOrValue<"timestamp">));
    }

    // Apply ordering and limit
    const orderedQuery = postsQuery.order("desc");
    if (limit !== undefined) {
      return await orderedQuery.take(limit);
    }

    return await orderedQuery.collect();
  },
});




export const hasNewPostsSince = query({
  args: {
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.timestamp) {
      return 0;
    }

    const newPosts = await ctx.db
      .query("posts")
      .withIndex("by_timestamp", (q) => q.gt("timestamp", args.timestamp!))
      .collect();

    return newPosts.length;
  },
});