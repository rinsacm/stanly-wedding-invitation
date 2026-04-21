"use client";

import { useState, useMemo } from "react";

export default function Admin() {
  const [page, setPage] = useState("guests");
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🗑 DELETE MODAL STATE
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  async function load() {
    setLoading(true);

    try {
      const g = await fetch("/api/admin/guests", {
        headers: { password },
      }).then((r) => r.json());

      const r = await fetch("/api/admin/rsvps", {
        headers: { password },
      }).then((r) => r.json());

      setGuests(Array.isArray(g) ? g : g?.guests || []);
      setRsvps(r?.items || []);
    } finally {
      setLoading(false);
    }
  }

  function getRsvp(id) {
    return rsvps.find((x) => x.guestId === id);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  // 🗑 OPEN DELETE MODAL
  function openDelete(g) {
    setDeleteId(g._id);
    setDeleteName(g.name);
  }

  // 🗑 CONFIRM DELETE
  async function confirmDelete() {
    try {
      await fetch("/api/admin/guests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          password,
        },
        body: JSON.stringify({ id: deleteId }),
      });

      setGuests((prev) => prev.filter((g) => g._id !== deleteId));

      setDeleteId(null);
      setDeleteName("");
    } catch (err) {
      alert("Failed to delete invite");
    }
  }

  // 📊 SAFE DATA
  const data = useMemo(() => {
    const safeGuests = Array.isArray(guests) ? guests : [];

    const attending = [];
    const pending = [];
    const notComing = [];

    let totalPersons = 0;

    safeGuests.forEach((g) => {
      const r = getRsvp(g._id);

      if (!r) {
        pending.push(g);
      } else if (r.attending) {
        attending.push(g);
        totalPersons += Number(r.guests) || 1;
      } else {
        notComing.push(g);
      }
    });

    return {
      attending,
      pending,
      notComing,
      totalPersons,
      totalInvites: safeGuests.length,
    };
  }, [guests, rsvps]);

  // ================= CARD =================
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

          {r?.attending && (
            <p className="text-xs text-gray-600 mt-1">
              Guests: {Number(r.guests) || 1}
            </p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <a
            href={g.inviteLink}
            target="_blank"
            className="text-xs px-3 py-1 rounded-lg bg-[#f7efe6] text-[#b08968]"
          >
            View
          </a>

          <button
            onClick={() => copy(g.inviteLink)}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100"
          >
            Copy
          </button>

          <button
            onClick={() => openDelete(g)}
            className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  // ================= BOX =================
  const Box = ({ title, value }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );

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

        {/* ================= GUEST PAGE ================= */}
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

            {/* SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Box title="Total Invites" value={data.totalInvites} />
              <Box title="Pending Responses" value={data.pending.length} />
              <Box title="Persons Attending" value={data.totalPersons} />
              <Box title="Not Attending" value={data.notComing.length} />
            </div>

            {/* LISTS */}
            <h2 className="mb-2 font-semibold">🎉 Attending</h2>
            <div className="space-y-3 mb-6">
              {data.attending.map((g) => (
                <Card key={g._id} g={g} type="attending" />
              ))}
            </div>

            <h2 className="mb-2 font-semibold">⏳ Not Responded</h2>
            <div className="space-y-3 mb-6">
              {data.pending.map((g) => (
                <Card key={g._id} g={g} type="pending" />
              ))}
            </div>

            <h2 className="mb-2 font-semibold">❌ Not Attending</h2>
            <div className="space-y-3">
              {data.notComing.map((g) => (
                <Card key={g._id} g={g} type="not" />
              ))}
            </div>
          </>
        )}

        {/* ================= GENERATOR PAGE ================= */}
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

        {/* 🗑 DELETE MODAL */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-sm p-5 rounded-2xl shadow-xl text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete Invite?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Delete invite for{" "}
                <span className="font-semibold">{deleteName}</span>?
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 rounded-xl bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
