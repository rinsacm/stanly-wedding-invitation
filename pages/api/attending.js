import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  try {
    const client = getConvexClient();
    const items = await client.query("rsvp:getRsvps");

    const totalGuests = (items || []).reduce(
      (sum, it) => sum + (it.attending ? it.guests : 0),
      0,
    );

    res.status(200).json({ totalGuests });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
}
