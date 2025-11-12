import { action } from "./_generated/server";
import { api } from "./_generated/api";
import bcrypt from "bcryptjs";
import { LoginArgs, LoginResult, RegisterArgs, RegisterResult } from "../src/types/app";
import { v } from "convex/values";



export const register = action({
    args: {
      email: v.string(),
      name: v.string(),
      password: v.string(),
    },
    handler: async (ctx, args: RegisterArgs): Promise<RegisterResult> => {
      const passwordHash = await bcrypt.hash(args.password, 10);
  
      const result = await ctx.runMutation(api.auth.createUser, {
        email: args.email,
        name: args.name,
        passwordHash,
      });
  
      return result;
    },
  });
  

  export const login = action({
    args: {
      email: v.string(),
      password: v.string(),
    },
    handler: async (ctx, args: LoginArgs): Promise<LoginResult> => {
      const user = await ctx.runQuery(api.auth.getUserByEmail, {
        email: args.email,
      });
  
      if (!user) throw new Error("Invalid email or password");
  
      const isValid = await bcrypt.compare(args.password, user.passwordHash);
      if (!isValid) throw new Error("Invalid email or password");
  
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };
    },
  });