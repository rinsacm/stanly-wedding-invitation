import { useState, useEffect } from "react";

/* ---------------- COUNTDOWN ---------------- */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate) - new Date();

      return {
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

/* ---------------- MAIN ---------------- */
export default function CinematicInvitation({ guestName, guestData, guestId }) {
  const [openRSVP, setOpenRSVP] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    email: "",
    guests: 1,
    attending: true,
  });

  const countdown = useCountdown("2026-05-25T11:00:00");

  /* ---------------- CHECK RSVP ---------------- */
  useEffect(() => {
    async function check() {
      if (!guestId) return;

      const res = await fetch(`/api/check-rsvp?guestId=${guestId}`);
      const data = await res.json();

      if (data.exists) setSubmitted(true);
    }
    check();
  }, [guestId]);

  /* ---------------- AUTO FILL ---------------- */
  useEffect(() => {
    if (guestData) {
      setForm((p) => ({
        ...p,
        guests: guestData.guestsAllowed || 1,
      }));
    }
  }, [guestData]);

  const update = (k, v) =>
    setForm((p) => ({
      ...p,
      [k]: v,
    }));

  /* ---------------- SUBMIT ---------------- */
  async function submit() {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestId,
        email: form.email,
        guests: form.guests,
        attending: form.attending,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setOpenRSVP(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#f8f5f2] flex flex-col items-center px-6 py-14 overflow-hidden">
      {/* 🌸 BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#d4a373]/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 💌 INTRO */}
      <div className="text-center z-10 max-w-xl">
        <p className="text-[#b08968] text-lg">Dear {guestName || "Guest"},</p>

        <p className="mt-4 text-gray-600">
          We are happy to invite you to our special day.
        </p>
      </div>

      {/* 💍 NAME + STORY */}
      <div className="text-center mt-10 max-w-2xl z-10">
        <h1 className="text-5xl font-serif text-gray-800">
          Stanly <span className="text-[#d4a373]">&</span> Anisha
        </h1>

        <p className="mt-6 text-gray-600">
          Two hearts came together and built one beautiful story.
        </p>

        <p className="mt-3 text-gray-600">
          Now we are starting a new life together, and we want you with us.
        </p>
      </div>

      {/* 📅 DATE + TIME */}
      <div className="mt-10 text-center">
        <p className="text-xs uppercase tracking-[4px] text-gray-500">
          Wedding Date
        </p>
        <p className="text-2xl font-serif text-[#d4a373] mt-2">
          25 May 2026 • 11:00 AM
        </p>
      </div>

      {/* ⏳ COUNTDOWN */}
      {countdown && (
        <div className="flex gap-6 mt-10">
          {Object.entries(countdown).map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-3xl font-serif text-[#d4a373]">{v}</div>
              <div className="text-xs uppercase text-gray-500">{k}</div>
            </div>
          ))}
        </div>
      )}

      {/* 📍 LOCATIONS (BACK TO SIMPLE CARDS) */}
      <div className="mt-12 space-y-4 text-center z-10">
        <a
          href="https://www.google.com/maps/search/?api=1&query=St+Antony's+Church+Manjalampura"
          target="_blank"
          className="block border rounded-2xl p-4 w-72 mx-auto bg-white/70"
        >
          <p className="font-semibold">St Antony's Church</p>
          <p className="text-xs text-gray-500">Manjalampura</p>
        </a>

        <a
          href="https://www.google.com/maps/search/?api=1&query=St+George+Convention+Centre+Kelakam"
          target="_blank"
          className="block border rounded-2xl p-4 w-72 mx-auto bg-white/70"
        >
          <p className="font-semibold">St George Convention Centre</p>
          <p className="text-xs text-gray-500">Kelakam</p>
        </a>
      </div>

      {/* 💖 RSVP */}
      {!submitted ? (
        <button
          onClick={() => setOpenRSVP(true)}
          className="mt-12 bg-[#d4a373] text-white px-8 py-3 rounded-full shadow-xl"
        >
          Will you attend?
        </button>
      ) : (
        <p className="mt-12 text-[#b08968]">Thank you for your response 🤍</p>
      )}

      {/* 💌 RSVP MODAL */}
      {openRSVP && !submitted && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96">
            <p className="text-center text-sm text-gray-500 mb-4">
              Please respond
            </p>

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => update("attending", true)}
                className="flex-1 p-2 bg-[#f1e4d6] rounded"
              >
                Yes
              </button>

              <button
                onClick={() => update("attending", false)}
                className="flex-1 p-2 bg-[#f5d6d6] rounded"
              >
                No
              </button>
            </div>

            {form.attending && (
              <select
                className="w-full border p-2 rounded mb-3"
                value={form.guests}
                onChange={(e) => update("guests", Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Guest(s)
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={submit}
              className="w-full bg-[#d4a373] text-white py-2 rounded"
            >
              Confirm
            </button>

            <button
              onClick={() => setOpenRSVP(false)}
              className="w-full text-xs text-gray-400 mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
