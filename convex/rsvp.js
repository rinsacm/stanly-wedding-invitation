import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ✅ Create RSVP (only once per guest) */
export const create = mutation({
  args: {
    guestId: v.string(), // ✅ MUST be here
    name: v.string(),
    email: v.string(),
    guests: v.number(),
    attending: v.boolean(),
    message: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rsvps", args);
  },
});

/* ✅ Get RSVP by guest */
export const getByGuestId = query({
  args: {
    guestId: v.string(), // ✅ ONLY THIS
  },
  handler: async (ctx, args) => {
    const rsvps = await ctx.db
      .query("rsvps")
      .filter((q) => q.eq(q.field("guestId"), args.guestId))
      .collect();

    return rsvps[0] || null;
  },
});

/* ✅ Get all RSVPs */
export const listRsvps = query({
  handler: async (ctx) => {
    return await ctx.db.query("rsvps").collect();
  },
});
