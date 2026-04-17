import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = getConvexClient();

    const { guestId, email, guests, attending, message } = req.body;

    // 🔴 1. Validate input
    if (!guestId) {
      return res.status(400).json({ error: "Missing guestId" });
    }

    // 🔐 2. Fetch guest from DB (SOURCE OF TRUTH)
    const guest = await client.query("guests:getGuestById", {
      id: guestId,
    });

    if (!guest) {
      return res.status(403).json({ error: "Invalid invitation link" });
    }

    // 🚫 3. Prevent duplicate RSVP
    const existing = await client.query("rsvp:getByGuestId", {
      guestId,
    });

    if (existing) {
      return res.status(409).json({ error: "Already responded" });
    }

    // ✅ 4. Save RSVP (IMPORTANT: name from DB)
    await client.mutation("rsvp:create", {
      guestId,
      name: guest.name, // ⭐ FIX: add name here
      email: email || "",
      guests: guests || 1,
      attending: !!attending,
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
      error: "Server error. Please try again.",
    });
  }
}
