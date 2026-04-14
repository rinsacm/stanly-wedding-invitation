import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, guests, message, attending } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const client = getConvexClient();
    // Check for existing RSVP by email to avoid duplicates
    const all = await client.query("getRsvps");
    const existing = (all || []).find(
      (r) => (r.email || "").toLowerCase() === (email || "").toLowerCase(),
    );
    if (existing) {
      return res
        .status(409)
        .json({
          error: "RSVP already received",
          id: existing._id || existing.id || null,
        });
    }

    const result = await client.mutation("addRsvp", {
      name,
      email,
      guests: guests || 1,
      message: message || "",
      attending: !!attending,
    });

    return res.status(201).json({ id: result?.id || null });
  } catch (err) {
    console.error("Failed to write RSVP (Convex)", err);
    return res.status(500).json({ error: "Failed to save RSVP" });
  }
}
