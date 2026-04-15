import { useEffect, useState } from "react";

export default function AdminRsvps() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/rsvps", {
      headers: {
        "x-admin-password": "YOUR_PASSWORD",
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-serif text-center mb-8 text-gray-800">
          RSVP Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total RSVPs" value={data.totalRsvps} />
          <StatCard title="Attending" value={data.attendingCount} />
          <StatCard title="Total Guests" value={data.totalGuests} />
        </div>

        {/* List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
          {data.items.map((rsvp) => (
            <div
              key={rsvp.id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{rsvp.name}</p>
                <p className="text-sm text-gray-500">{rsvp.email}</p>
                <p className="text-sm text-gray-600">Guests: {rsvp.guests}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  rsvp.attending
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {rsvp.attending ? "Attending" : "Not Attending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 shadow border border-gray-200 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}
