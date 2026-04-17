import { getConvexClient } from "../../../lib/convexClient";

export default async function handler(req, res) {
  try {
    const { password } = req.headers;

    // 🔐 simple admin check
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const client = getConvexClient();

    // 📦 fetch all RSVPs from Convex
    const rsvps = await client.query("rsvp:listRsvps");

    // 📊 stats
    const totalRsvps = rsvps.length;

    const totalGuests = rsvps.reduce((sum, r) => {
      return sum + (r.attending ? r.guests : 0);
    }, 0);

    return res.status(200).json({
      totalRsvps,
      totalGuests,
      items: rsvps,
    });
  } catch (err) {
    console.error("RSVP ADMIN ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
}
