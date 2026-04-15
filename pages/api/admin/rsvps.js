import { getConvexClient } from "../../../lib/convexClient";

// 🔐 Helper: Admin Auth
function validateAdmin(req) {
  const headerPassword =
    req.headers["x-admin-password"] ||
    (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    return { ok: false, status: 500, error: "Admin password not configured" };
  }

  if (!headerPassword || headerPassword !== ADMIN_PASSWORD) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true };
}

// 🧹 Helper: Normalize data
function normalizeRsvps(items = []) {
  return items.map((it) => ({
    id: it._id || it.id || null,
    name: it.name || "",
    email: it.email || "",
    guests: it.guests || 0,
    attending: !!it.attending,
    message: it.message || "",
    createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : null,
  }));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Auth check
  const auth = validateAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const client = getConvexClient();
    const items = await client.query("rsvp:getRsvps");

    const normalized = normalizeRsvps(items);

    const totalGuests = normalized.reduce(
      (sum, it) => sum + (it.attending ? it.guests : 0),
      0,
    );

    return res.status(200).json({
      totalRsvps: normalized.length,
      totalGuests,
      items: normalized,
    });
  } catch (err) {
    console.error("Failed to fetch RSVPs", err);
    return res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
}
