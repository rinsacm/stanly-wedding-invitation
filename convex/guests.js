import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const link = `${baseUrl}/invite/${id}`;
/* CREATE GUEST */
export const addGuest = mutation({
  args: {
    name: v.string(),
    guestsAllowed: v.number(),
    inviteLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("guests", {
      name: args.name,
      guestsAllowed: args.guestsAllowed,
      createdAt: Date.now(),
      inviteLink: args.inviteLink,
    });
  },
});

/* LIST GUESTS (ADMIN) */
export const listGuests = query({
  handler: async (ctx) => {
    return await ctx.db.query("guests").collect();
  },
});

/* GET GUEST BY ID */
export const getGuestById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get("guests", args.id);
  },
});

/* UPDATE INVITE LINK */
export const updateGuestLink = mutation({
  args: {
    id: v.id("guests"),
    inviteLink: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      inviteLink: args.inviteLink,
    });
  },
});
