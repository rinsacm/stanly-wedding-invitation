import { useState } from "react";

export default function Invitation({
  couple = { a: "Stanly", b: "Anisha" },
  date = "Monday, May 25, 2026",
  venues = [
    {
      title: "VENUE 1",
      when: "MONDAY, MAY 25, 2026 - ELEVEN O'CLOCK IN THE MORNING",
      where: "ST. ANTONY'S CHURCH, MANJALAMPURA",
    },
    {
      title: "VENUE 2",
      when: "MONDAY, MAY 25, 2026",
      where: "St George Convention Centre, Adakkathode road, Kelakam",
    },
  ],
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    guests: 1,
    message: "",
    attending: true,
  });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          guests: 1,
          message: "",
          attending: true,
        });
      } else {
        const json = await res.json();
        setStatus(json?.error || "error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: "center", paddingBottom: 10 }}>
          <div style={{ fontSize: 14, letterSpacing: 2, color: "#cfc6bf" }}>
            MAY
          </div>
        </div>

        <div className="hero">
          <div className="details" style={{ textAlign: "center" }}>
            {/* Calendar strip with the 25 highlighted */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div className="small" style={{ width: 36 }}>
                Fri
              </div>
              <div className="small" style={{ width: 36 }}>
                Sat
              </div>
              <div className="small" style={{ width: 36 }}>
                Sun
              </div>
              <div className="small" style={{ width: 36 }}>
                Mon
              </div>
              <div className="small" style={{ width: 36 }}>
                Tue
              </div>
              <div className="small" style={{ width: 36 }}>
                Wed
              </div>
              <div className="small" style={{ width: 36 }}>
                Thu
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#0b1220",
                  background: "#f6efe9",
                  width: 110,
                  height: 110,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  boxShadow: "0 6px 18px rgba(2,6,23,0.3)",
                }}
              >
                25
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontStyle: "italic",
                  fontFamily: "serif",
                  fontSize: 20,
                  color: "#f3e7df",
                }}
              >
                save the date
              </div>
              <h1
                style={{
                  margin: "12px 0 6px 0",
                  letterSpacing: 4,
                  fontSize: 26,
                }}
              >
                {couple.a} & {couple.b}
              </h1>
            </div>

            <div
              style={{ marginTop: 18, textAlign: "center", color: "#9aa6b2" }}
            >
              {venues.map((v, i) => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.where)}`;
                return (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, letterSpacing: 2 }}>
                      {v.title}
                    </div>
                    <div
                      style={{
                        textTransform: "uppercase",
                        fontSize: 13,
                        marginTop: 6,
                      }}
                    >
                      {v.when}
                    </div>
                    <div style={{ marginTop: 6 }}>{v.where}</div>
                    <div style={{ marginTop: 6 }}>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#f6e1d6",
                          textDecoration: "underline",
                          fontSize: 13,
                        }}
                      >
                        View on map
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="meta">
            <h3 style={{ marginTop: 0 }}>RSVP</h3>
            <form onSubmit={submit}>
              <div className="form-row">
                <input
                  className="input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  className="input"
                  value={form.guests}
                  onChange={(e) =>
                    setForm({ ...form, guests: Number(e.target.value) })
                  }
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                  <option value={4}>4 guests</option>
                </select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label
                  className="small"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  <input
                    type="checkbox"
                    checked={form.attending}
                    onChange={(e) =>
                      setForm({ ...form, attending: e.target.checked })
                    }
                  />{" "}
                  Attending
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Message (optional)"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn" type="submit">
                  Send RSVP
                </button>
                <div className="small">
                  {status === "loading"
                    ? "Sending..."
                    : status === "success"
                      ? "Thanks — RSVP saved!"
                      : status === "error"
                        ? "Something went wrong"
                        : ""}
                </div>
              </div>
            </form>

            <div style={{ marginTop: 12 }} className="small">
              We respect your privacy. RSVP data is stored securely.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
