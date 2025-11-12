import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get current user by ID
 */
export const getUserDetails = query({
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