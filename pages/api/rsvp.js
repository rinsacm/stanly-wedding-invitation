import { getConvexClient } from "../../lib/convexClient";
import { api } from "../../convex/_generated/api";

export default async function handler(req, res) {
  // ❌ allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = getConvexClient();

    // ✅ safe body handling
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { guestId, email, guests, attending, message } = body;

    // ❌ validation
    if (!guestId) {
      return res.status(400).json({ error: "Missing guestId" });
    }

    // ✅ fetch guest
    const guest = await client.query(api.guests.getGuestById, {
      id: guestId,
    });

    if (!guest) {
      return res.status(403).json({ error: "Invalid invite link" });
    }

    // ❌ check duplicate RSVP
    const existing = await client.query(api.rsvp.getByGuestId, {
      guestId,
    });

    if (existing) {
      return res.status(409).json({ error: "Already responded" });
    }

    // ✅ save RSVP
    await client.mutation(api.rsvp.create, {
      guestId: guestId,
      name: guest.name,
      email: email || "",
      guests: guests || 1,
      attending: attending === true || attending === "true",
      message: message || "",
      createdAt: Date.now(),
    });

    return res.status(200).json({
      success: true,
      message: "RSVP saved successfully",
    });
  } catch (err) {
    console.error("RSVP ERROR:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
}
