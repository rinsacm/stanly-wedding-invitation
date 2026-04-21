import { getConvexClient } from "../../../lib/convexClient";

export default async function handler(req, res) {
  try {
    const { password } = req.headers;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const client = getConvexClient();

    // ✅ GET: fetch all guests
    if (req.method === "GET") {
      const guests = await client.query("guests:listGuests");
      return res.status(200).json(guests);
    }

    // 🗑 DELETE: remove guest
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Guest id required" });
      }

      await client.mutation("guests:deleteGuest", {
        id,
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
}
