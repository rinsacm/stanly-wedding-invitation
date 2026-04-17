import { getConvexClient } from "../../lib/convexClient";

export default async function handler(req, res) {
  try {
    const { name, guestsAllowed = 2 } = req.body;

    const client = getConvexClient();

    // 1️⃣ create guest
    const id = await client.mutation("guests:addGuest", {
      name,
      guestsAllowed,
    });

    // 2️⃣ generate link
    const baseUrl = req.headers.origin;
    const link = `${baseUrl}/invite/${id}`;

    // 3️⃣ store link in DB ⭐ IMPORTANT FIX
    await client.mutation("guests:updateGuestLink", {
      id,
      inviteLink: link,
    });

    return res.status(200).json({ id, link });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create guest" });
  }
}
