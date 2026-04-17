import { getConvexClient } from "../../../lib/convexClient";

export default async function handler(req, res) {
  try {
    const { password } = req.headers;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const client = getConvexClient();
    const guests = await client.query("guests:listGuests");

    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guests" });
  }
}
