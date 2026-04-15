import { useState, useEffect } from "react";

const initialState = {
  name: "",
  email: "",
  guests: 1,
  attending: true,
  message: "",
};

/* ---------------- COUNTDOWN HOOK ---------------- */
function useCountdown(targetDate) {
  const calculateTimeLeft = () => {
    const diff = new Date(targetDate) - new Date();

    return {
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function Invitation() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const countdown = useCountdown("2026-05-25T09:00:00");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 409) {
        setStatus("Email already RSVP'd");
      } else if (!res.ok) {
        setStatus("Something went wrong");
      } else {
        setStatus("RSVP saved ❤️");
        setForm(initialState);
      }
    } catch {
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f2] to-[#fdfaf7] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* ---------------- LEFT SIDE ---------------- */}
        <div className="p-10 flex flex-col justify-center bg-[#f7efe6]">
          <p className="text-xs tracking-[3px] text-gray-500 uppercase mb-3">
            Wedding Invitation
          </p>

          <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4">
            Stanly <span className="text-[#d4a373]">&</span> Anisha
          </h1>

          <p className="text-gray-600 mb-6">
            Together with their families, they invite you to celebrate their
            wedding.
          </p>

          {/* COUNTDOWN */}
          <div className="grid grid-cols-4 gap-3 mb-8 text-center">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Min", value: countdown.minutes },
              { label: "Sec", value: countdown.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/60 backdrop-blur-md rounded-xl py-3 shadow-sm"
              >
                <div className="text-xl font-semibold text-[#d4a373]">
                  {item.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* DETAILS */}
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Date:</strong> May 25, 2026
            </p>
            <p>
              <strong>Ceremony:</strong> St. Mary's Church
            </p>
            <p>
              <strong>Reception:</strong> The Grand Hall
            </p>
          </div>

          <div className="mt-8 text-gray-500 text-sm italic">
            “Your presence is the greatest gift.”
          </div>
        </div>

        {/* ---------------- RIGHT SIDE ---------------- */}
        <div className="p-10 bg-white">
          <h2 className="text-2xl font-semibold mb-6">RSVP</h2>

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#d4a373] outline-none"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />

            <input
              type="email"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#d4a373] outline-none"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />

            <select
              className="w-full p-3 border border-gray-200 rounded-lg"
              value={form.guests}
              onChange={(e) => updateField("guests", Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.attending}
                onChange={(e) => updateField("attending", e.target.checked)}
              />
              I will attend
            </label>

            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="Message (optional)"
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
            />

            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4a373] to-[#e6c8a0] text-white font-semibold shadow-md hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Send RSVP"}
            </button>

            {status && (
              <p className="text-center text-sm text-gray-500 mt-2">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
