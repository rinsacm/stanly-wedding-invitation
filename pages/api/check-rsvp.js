import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  const { guestId } = req.query;

  const client = getConvexClient();

  const existing = await client.query("rsvp:getByGuestId", {
    guestId,
  });

  res.status(200).json({ exists: !!existing });
}
