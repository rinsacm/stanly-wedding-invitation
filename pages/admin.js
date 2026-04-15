import { useState } from "react";

export default function AdminRsvps() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");

    const res = await fetch("/api/admin/rsvps", {
      headers: {
        "x-admin-password": password,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Failed");
      return;
    }

    setData(json);
  };

  // 🔐 LOGIN UI (shown first)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-gray-100">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-sm text-center border border-gray-200">
          <h2 className="text-2xl font-serif mb-4">Admin Access</h2>

          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={fetchData}
            className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Enter
          </button>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // 📊 DASHBOARD (after login)
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-center mb-8 text-gray-800">
          RSVP Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total RSVPs" value={data.totalRsvps} />
          <StatCard title="Attending" value={data.attendingCount} />
          <StatCard title="Total Guests" value={data.totalGuests} />
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
          {data.items.map((rsvp) => (
            <div key={rsvp.id} className="border-b py-4 flex justify-between">
              <div>
                <p className="font-semibold">{rsvp.name}</p>
                <p className="text-sm text-gray-500">{rsvp.email}</p>
              </div>

              <div className="text-sm">
                {rsvp.attending ? `${rsvp.guests} attending` : "Not attending"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow border text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
