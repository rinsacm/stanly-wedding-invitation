import { getConvexClient } from "../../../lib/convexClient";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const client = getConvexClient();

    const guest = await client.query("guests:getGuestById", { id });

    if (!guest) {
      return res.status(404).json({ error: "Invalid invite link" });
    }

    return res.status(200).json(guest);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
