import { useState, useMemo } from "react";

export default function Admin() {
  const [page, setPage] = useState("guests"); // 👈 navigation
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const g = await fetch("/api/admin/guests", {
        headers: { password },
      }).then((r) => r.json());

      const r = await fetch("/api/admin/rsvps", {
        headers: { password },
      }).then((r) => r.json());

      setGuests(g);
      setRsvps(r.items || []);
    } finally {
      setLoading(false);
    }
  }

  function getRsvp(id) {
    return rsvps.find((x) => x.guestId === id);
  }

  const data = useMemo(() => {
    const attending = [];
    const pending = [];
    const notComing = [];

    guests.forEach((g) => {
      const r = getRsvp(g._id);

      if (!r) pending.push(g);
      else if (r.attending) attending.push(g);
      else notComing.push(g);
    });

    return { attending, pending, notComing };
  }, [guests, rsvps]);

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  const Card = ({ g, type }) => {
    const r = getRsvp(g._id);

    return (
      <div className="border rounded-2xl p-4 flex justify-between items-center bg-white shadow-sm">
        <div>
          <p className="font-medium text-gray-800">{g.name}</p>

          <p className="text-xs text-gray-500 mt-1">
            {type === "attending" && "Attending"}
            {type === "pending" && "Not responded yet"}
            {type === "not" && "Not attending"}
          </p>

          {r?.guests && type === "attending" && (
            <p className="text-xs text-gray-600 mt-1">Guests: {r.guests}</p>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={g.inviteLink}
            target="_blank"
            className="text-xs px-3 py-1 rounded-lg bg-[#f7efe6] text-[#b08968]"
          >
            View Invite
          </a>

          <button
            onClick={() => copy(g.inviteLink)}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100"
          >
            Copy
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* HEADER */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-serif text-gray-800">Wedding Admin</h1>
          <p className="text-sm text-gray-500">Stanly & Anisha</p>
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setPage("guests")}
            className={`px-5 py-2 rounded-full text-sm ${
              page === "guests" ? "bg-[#d4a373] text-white" : "bg-white border"
            }`}
          >
            👥 Guest List
          </button>

          <button
            onClick={() => setPage("generator")}
            className={`px-5 py-2 rounded-full text-sm ${
              page === "generator"
                ? "bg-[#d4a373] text-white"
                : "bg-white border"
            }`}
          >
            💌 Invitation Generator
          </button>
        </div>

        {/* PAGE 1: GUEST LIST */}
        {page === "guests" && (
          <>
            {/* LOGIN */}
            <div className="flex gap-2 mb-6">
              <input
                type="password"
                placeholder="Admin password"
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 p-3 border rounded-xl bg-white"
              />

              <button
                onClick={load}
                className="px-5 py-3 rounded-xl bg-[#d4a373] text-white"
              >
                {loading ? "Loading..." : "Load"}
              </button>
            </div>

            {/* GROUPS */}
            <h2 className="font-serif text-[#b08968] mb-2">Attending</h2>
            <div className="space-y-3 mb-6">
              {data.attending.map((g) => (
                <Card key={g._id} g={g} type="attending" />
              ))}
            </div>

            <h2 className="font-serif text-gray-600 mb-2">Not Responded</h2>
            <div className="space-y-3 mb-6">
              {data.pending.map((g) => (
                <Card key={g._id} g={g} type="pending" />
              ))}
            </div>

            <h2 className="font-serif text-gray-500 mb-2">Not Attending</h2>
            <div className="space-y-3">
              {data.notComing.map((g) => (
                <Card key={g._id} g={g} type="not" />
              ))}
            </div>
          </>
        )}

        {/* PAGE 2: INVITATION GENERATOR */}
        {page === "generator" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <h2 className="text-2xl font-serif text-gray-800">
              💌 Invitation Generator
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Create and share personalized wedding invites
            </p>

            <button
              onClick={() => (window.location.href = "/generator")}
              className="mt-5 px-6 py-3 bg-[#d4a373] text-white rounded-xl"
            >
              Open Generator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
