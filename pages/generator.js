import { useState } from "react";

export default function Generator() {
  const [input, setInput] = useState("");
  const [links, setLinks] = useState([]);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- DEFAULT MESSAGE ---------------- */
  function getMessage(name, link) {
    const defaultMsg = `Hi ${name},

You are warmly invited to our wedding 💍

We would be delighted to have you with us as we begin this beautiful new chapter of our lives.

With love,
Stanly & Anisha ❤️`;

    if (customMessage.trim()) {
      return customMessage.replace("{name}", name).replace("{link}", link);
    }

    return defaultMsg;
  }

  /* ---------------- GENERATE ---------------- */
  async function generate() {
    setLoading(true);

    const names = input
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);

    const results = [];

    for (const name of names) {
      const res = await fetch("/api/create-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          guestsAllowed: 10,
          customMessage,
        }),
      });

      const data = await res.json();
      const link = `${window.location.origin}/invite/${data.id}`;

      results.push({ name, link });
    }

    setLinks(results);
    setLoading(false);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Invitation Generator 💍
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create personalized wedding invites for your guests
          </p>
        </div>

        {/* INPUT */}
        <textarea
          className="w-full border rounded-xl p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          rows={5}
          placeholder="Enter guest names (one per line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* CUSTOM MESSAGE */}
        <textarea
          className="w-full border rounded-xl p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          rows={4}
          placeholder="Custom message (optional)"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-[#d4a373] text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
        >
          {loading ? "Creating invitations..." : "Generate Invitations"}
        </button>

        {/* RESULTS */}
        <div className="mt-8 space-y-5">
          {links.map((item, i) => {
            const message = getMessage(item.name, item.link);

            return (
              <div key={i} className="border rounded-2xl p-5 bg-[#faf8f5]">
                {/* NAME */}

                {/* MESSAGE + LINK TOGETHER */}
                <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border">
                  {message}
                  {"\n\n"}
                  <span className="text-gray-500 text-xs">
                    Open invitation:
                  </span>{" "}
                  <a
                    href={item.link}
                    target="_blank"
                    className="text-[#b08968] underline break-all"
                  >
                    Click here
                  </a>
                </div>

                {/* ACTIONS (cleaned) */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => copy(message)}
                    className="flex-1 bg-black text-white py-2 rounded-lg text-sm"
                  >
                    Copy Message
                  </button>

                  <button
                    onClick={() => copy(item.link)}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg text-sm"
                  >
                    Copy Link
                  </button>

                  <a
                    href={item.link}
                    target="_blank"
                    className="flex-1 bg-[#d4a373] text-white py-2 rounded-lg text-sm text-center"
                  >
                    Open
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
