import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ---------------- CREATE GUEST ---------------- */
export const addGuest = mutation({
  args: {
    name: v.string(),
    guestsAllowed: v.number(),
    customMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("guests", {
      name: args.name,
      guestsAllowed: args.guestsAllowed,
      createdAt: Date.now(),
      customMessage: args.customMessage,
    });

    return id;
  },
});

/* ---------------- LIST GUESTS (ADMIN) ---------------- */
export const listGuests = query({
  handler: async (ctx) => {
    return await ctx.db.query("guests").collect();
  },
});

/* ---------------- GET GUEST BY ID ---------------- */
export const getGuestById = query({
  args: {
    id: v.id("guests"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/* ---------------- UPDATE GUEST LINK ---------------- */
export const updateGuestLink = mutation({
  args: {
    id: v.id("guests"),
    inviteLink: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      inviteLink: args.inviteLink,
    });
  },
});
/* ---------------- DELETE GUEST ---------------- */
export const deleteGuest = mutation({
  args: {
    id: v.id("guests"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
