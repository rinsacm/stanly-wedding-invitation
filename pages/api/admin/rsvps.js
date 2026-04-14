import { getConvexClient } from "../../../lib/convexClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const headerPassword =
    req.headers["x-admin-password"] ||
    (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res
      .status(500)
      .json({ error: "Admin password not configured on the server" });
  }

  if (!headerPassword || headerPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const client = getConvexClient();
    const items = await client.query("getRsvps");
    // Normalize items
    const normalized = (items || []).map((it) => ({
      id: it._id || it.id || null,
      name: it.name || "",
      email: it.email || "",
      guests: it.guests || 0,
      attending: !!it.attending,
      message: it.message || "",
      createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : null,
    }));

    const totalGuests = normalized.reduce(
      (sum, it) => sum + (it.attending ? Number(it.guests || 0) : 0),
      0,
    );

    return res
      .status(200)
      .json({ totalRsvps: normalized.length, totalGuests, items: normalized });
  } catch (err) {
    console.error("Failed to fetch RSVPs", err);
    return res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
}
