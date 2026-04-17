import { useState, useEffect } from "react";

const initialState = {
  name: "",
  email: "",
  guests: 1,
  attending: true,
  message: "",
};

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
    const interval = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

/* ---------------- MAIN ---------------- */
export default function Invitation({ guestName, guestData, guestId }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const countdown = useCountdown("2026-05-25T09:00:00");

  /* Autofill guest */
  useEffect(() => {
    if (guestData) {
      setForm((prev) => ({
        ...prev,
        name: guestData.name,
        guests: guestData.guestsAllowed || 1,
      }));
    }
  }, [guestData]);

  /* Check duplicate RSVP */
  useEffect(() => {
    if (!guestId) return;

    fetch(`/api/check-rsvp?guestId=${guestId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          setAlreadySubmitted(true);
        }
      });
  }, [guestId]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestId,
          email: form.email,
          guests: form.guests,
          attending: form.attending,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setAlreadySubmitted(true);
        setStatus("You already responded.");
      } else if (!res.ok) {
        setStatus(data.error || "Something went wrong");
      } else {
        setAlreadySubmitted(true);
        setStatus("RSVP saved ❤️");
      }
    } catch {
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f5f2]">
      <div className="max-w-6xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
        {/* ---------------- LEFT: INVITATION ---------------- */}
        <div className="p-10 bg-[#f7efe6] flex flex-col justify-center">
          <p className="text-xs tracking-[3px] text-gray-600 uppercase mb-3">
            Wedding Invitation
          </p>

          {guestName && (
            <p className="mb-3 text-md text-[#b08968] font-medium">
              Dear {guestName},
            </p>
          )}

          <h1 className="text-4xl font-serif mb-2 text-gray-800">
            Stanly <span className="text-[#d4a373]">&</span> Anisha
          </h1>

          <p className="text-sm italic mb-6 text-gray-600">
            are getting married
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            With love in our hearts and joy in our souls, we invite you to be
            part of our special day as we begin our beautiful journey together.
          </p>

          {/* COUNTDOWN */}
          {countdown && (
            <div className="grid grid-cols-4 gap-3 mb-6 text-center">
              {Object.entries(countdown).map(([k, v]) => (
                <div key={k} className="bg-white rounded-xl py-3">
                  <div className="text-lg text-[#d4a373]">{v}</div>
                  <div className="text-xs uppercase text-gray-600">{k}</div>
                </div>
              ))}
            </div>
          )}

          {/* DETAILS */}
          <div className="text-sm text-gray-800 space-y-2 mb-6">
            <p>
              <strong>Date:</strong> May 25, 2026
            </p>
            <p>
              <strong>Ceremony:</strong> St Antony's Church, Manjalampura
            </p>
            <p>
              <strong>Reception:</strong> St George Convention Centre, Kelakam
            </p>
          </div>

          {/* MAPS */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-1">📍 Ceremony</p>
              <iframe
                className="w-full h-[120px] rounded border"
                src="https://maps.google.com/maps?q=st+anthonys+church+manjalampura&output=embed"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-1">📍 Reception</p>
              <iframe
                className="w-full h-[120px] rounded border"
                src="https://maps.google.com/maps?q=st+george+convention+adakkathode&output=embed"
              />
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: FORM WITH BG ---------------- */}
        <div className="relative z-10 flex items-center justify-center h-full p-6">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/30">
            <h2 className="text-3xl font-serif text-center mb-2 text-gray-800">
              RSVP
            </h2>

            <p className="text-center text-sm text-gray-500 mb-6">
              We would love to celebrate with you
            </p>

            {alreadySubmitted && (
              <p className="text-green-600 text-center mb-4 text-sm">
                ✨ You’ve already responded
              </p>
            )}

            <form onSubmit={submit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Guest
                </label>
                <div className="mt-1 p-3 rounded-xl bg-gray-100 text-gray-700 font-medium">
                  {form.name}
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <input
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#d4a373] focus:ring-2 focus:ring-[#d4a373]/20 outline-none transition"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={alreadySubmitted}
                  required
                />
              </div>

              {/* ATTENDING (MODERN BUTTONS) */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Will you attend?
                </label>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => updateField("attending", true)}
                    disabled={alreadySubmitted}
                    className={`flex-1 py-2 rounded-xl border transition ${
                      form.attending
                        ? "bg-[#d4a373] text-white border-[#d4a373]"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("attending", false)}
                    disabled={alreadySubmitted}
                    className={`flex-1 py-2 rounded-xl border transition ${
                      !form.attending
                        ? "bg-[#d4a373] text-white border-[#d4a373]"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* GUEST COUNT */}
              {form.attending && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Number of Guests
                  </label>
                  <select
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200"
                    value={form.guests}
                    onChange={(e) =>
                      updateField("guests", Number(e.target.value))
                    }
                    disabled={alreadySubmitted}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* MESSAGE */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Message (optional)
                </label>
                <textarea
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200"
                  placeholder="Write a note..."
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  disabled={alreadySubmitted}
                />
              </div>

              {/* BUTTON */}
              <button
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d4a373] to-[#e6c8a0] text-white font-semibold shadow-md hover:scale-[1.02] transition"
                disabled={loading || alreadySubmitted}
              >
                {loading ? "Saving..." : "Confirm RSVP"}
              </button>

              {status && (
                <p className="text-center text-sm text-gray-500">{status}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
