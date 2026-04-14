// Convex server function: getRsvps
import { query } from "convex/values";

export default query(async ({ db }) => {
  const q = await db.table("rsvps").order("createdAt", "desc").collect();
  return q;
});
