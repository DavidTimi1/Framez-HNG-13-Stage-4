import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ Create User Mutation
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const name = args.name.trim();

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) throw new Error("User already exists");

    // Insert new user
    const userId = await ctx.db.insert("users", {
      email,
      name,
      passwordHash: args.passwordHash,
      createdAt: Date.now(),
    });

    return { userId, name, email };
  },
});


// ✅ Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    return user;
  },
});

/**
 * Get current user by ID
 */
export const getCurrentUser = query({
  args: { 
    userId: v.id("users") 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      return null;
    }

    // Return user data without password
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    const updates: any = {};
    
    if (args.name !== undefined) {
      if (args.name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters");
      }
      updates.name = args.name.trim();
    }
    
    if (args.avatar !== undefined) {
      updates.avatar = args.avatar;
    }

    await ctx.db.patch(args.userId, updates);

    return {
      success: true,
      message: "Profile updated successfully",
    };
  },
});