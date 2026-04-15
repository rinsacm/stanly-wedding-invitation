import { getConvexClient } from "../../../lib/convexClient";

// 🔐 Validate Admin Access
function validateAdmin(req) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    return {
      ok: false,
      status: 500,
      error: "Server misconfigured: ADMIN_PASSWORD missing",
    };
  }

  const headerPassword =
    req.headers["x-admin-password"] ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!headerPassword || headerPassword !== ADMIN_PASSWORD) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized access",
    };
  }

  return { ok: true };
}

// 🧹 Normalize RSVP data
function normalizeRsvps(items = []) {
  return items.map((item) => ({
    id: item._id ?? item.id ?? null,
    name: item.name ?? "",
    email: item.email ?? "",
    guests: Number(item.guests) || 0,
    attending: Boolean(item.attending),
    message: item.message ?? "",
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
  }));
}

// 📊 Calculate stats
function calculateStats(rsvps) {
  const totalGuests = rsvps.reduce(
    (sum, r) => sum + (r.attending ? r.guests : 0),
    0,
  );

  const attendingCount = rsvps.filter((r) => r.attending).length;

  return {
    totalRsvps: rsvps.length,
    attendingCount,
    totalGuests,
  };
}

// 🚀 API Handler
export default async function handler(req, res) {
  // ❌ Method check
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 🔐 Auth check
  const auth = validateAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const client = getConvexClient();

    // 📥 Fetch data
    const rawRsvps = await client.query("rsvp:getRsvps");

    // 🧹 Normalize
    const rsvps = normalizeRsvps(rawRsvps);

    // 📊 Stats
    const stats = calculateStats(rsvps);

    // ✅ Response
    return res.status(200).json({
      success: true,
      ...stats,
      items: rsvps,
    });
  } catch (error) {
    console.error("RSVP fetch error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch RSVPs",
    });
  }
}
