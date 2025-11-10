import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import bcrypt from 'bcryptjs';

export const register = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Validate name
    if (args.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    // Validate password
    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(args.password, 10);

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email.toLowerCase(),
      name: args.name.trim(),
      passwordHash,
      createdAt: Date.now(),
    });

    // Return user data (without password)
    return {
      userId,
      name: args.name.trim(),
      email: args.email.toLowerCase(),
    };
  },
});

/**
 * Login user
 * 
 * NOTE: In production, use proper password hashing verification
 * This is a demo implementation for development purposes only.
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(args.password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Return user data (without password)
    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
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