import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = getConvexClient();
    const items = await client.query("getRsvps");
    const totalGuests = (items || []).reduce(
      (sum, it) => sum + (it.attending ? Number(it.guests || 0) : 0),
      0,
    );
    return res.status(200).json({ totalGuests });
  } catch (err) {
    console.error("Failed to calculate attending", err);
    return res.status(500).json({ error: "Failed to calculate attending" });
  }
}
