import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rsvps: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    guests: v.number(),
    attending: v.boolean(),
    message: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
