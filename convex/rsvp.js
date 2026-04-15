import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addRsvp = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    guests: v.number(),
    attending: v.boolean(),
    message: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    if (args.email) {
      const existing = await ctx.db
        .query("rsvps")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();

      if (existing) throw new Error("DUPLICATE");
    }

    return await ctx.db.insert("rsvps", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getRsvps = query({
  handler: async (ctx) => {
    return await ctx.db.query("rsvps").order("desc").collect();
  },
});
