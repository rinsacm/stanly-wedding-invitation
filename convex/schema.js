import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  guests: defineTable({
    name: v.string(),
    guestsAllowed: v.number(),
    createdAt: v.number(),
    inviteLink: v.optional(v.string()),
  }),

  rsvps: defineTable({
    guestId: v.string(),
    name: v.string(),
    email: v.string(),
    guests: v.number(),
    attending: v.boolean(),
    message: v.string(),
    createdAt: v.number(),
  }),
});
