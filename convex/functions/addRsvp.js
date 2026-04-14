// Convex server function: addRsvp
// This file is run by Convex (not by Next.js). Keep as-is in your Convex project functions directory.
import { mutation } from "convex/values";

export default mutation(async ({ db }, rsvp) => {
  const doc = await db.insert("rsvps", { ...rsvp, createdAt: new Date() });
  return { id: doc._id };
});
