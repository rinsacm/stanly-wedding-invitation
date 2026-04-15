import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = getConvexClient();
    await client.mutation("rsvp:addRsvp", req.body);

    return res.status(201).json({ success: true });
  } catch (err) {
    if (err.message === "DUPLICATE") {
      return res.status(409).json({ error: "Already RSVP'd" });
    }
    return res.status(500).json({ error: "Failed to save RSVP" });
  }
}
