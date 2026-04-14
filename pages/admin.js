import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/rsvps", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json?.error || "Failed");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "40px auto" }}>
      <div style={{ background: "#08121a", padding: 18, borderRadius: 12 }}>
        <h1 style={{ margin: 0 }}>Admin — RSVPs</h1>
        <p style={{ color: "#9aa6b2" }}>
          Enter admin password to view guest responses.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.04)",
              background: "transparent",
              color: "inherit",
            }}
            placeholder="Admin password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#e6b89c",
              border: "none",
              fontWeight: 700,
              color: "#08121a",
            }}
            onClick={load}
          >
            Load RSVPs
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "#f8d7da" }}>{error}</div>
        )}

        {data && (
          <div style={{ marginTop: 18 }}>
            <div style={{ marginBottom: 8, color: "#9aa6b2" }}>
              Total RSVPs: {data.totalRsvps} — Total guests attending:{" "}
              {data.totalGuests}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{item.name}</strong>{" "}
                      <span style={{ color: "#9aa6b2" }}>({item.email})</span>
                    </div>
                    <div style={{ color: "#9aa6b2" }}>
                      {item.attending
                        ? `${item.guests} coming`
                        : "Not attending"}
                    </div>
                  </div>
                  {item.message && (
                    <div style={{ marginTop: 8, color: "#c9d8e6" }}>
                      Message: {item.message}
                    </div>
                  )}
                  <div style={{ marginTop: 8, fontSize: 12, color: "#8898a6" }}>
                    Submitted: {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
