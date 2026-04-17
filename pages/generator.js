import { useState } from "react";

const DEFAULT_MESSAGE = (name, link) => `
Dear ${name},

You are warmly invited to our wedding 💍

Please view your invitation and RSVP here:
${link}

With love,
Stanly & Anisha ❤️
`;

export default function Generator() {
  const [input, setInput] = useState("");
  const [links, setLinks] = useState([]);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          guestsAllowed: 10,
          createdAt: Date.now(),
        }),
      });

      const data = await res.json();
      const link = `${window.location.origin}/invite/${data.id}`;

      results.push({ name, link });
    }

    setLinks(results);
    setLoading(false);
  }

  function getMessage(name, link) {
    if (customMessage.trim()) {
      return customMessage.replace("{name}", name).replace("{link}", link);
    }
    return DEFAULT_MESSAGE(name, link);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="min-h-screen p-6 flex justify-center bg-[#f8f5f2]">
      <div className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl mb-4 font-semibold text-center">
          Invitation Link Generator
        </h1>

        {/* INPUT */}
        <textarea
          className="w-full border p-3 mb-4 rounded-lg"
          rows={5}
          placeholder="Enter guest names (one per line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* CUSTOM MESSAGE */}
        <textarea
          className="w-full border p-3 mb-4 rounded-lg"
          rows={4}
          placeholder={`Custom message (optional)\nUse {name} and {link}`}
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-[#d4a373] text-white py-2 rounded-lg font-medium"
        >
          {loading ? "Generating..." : "Generate Links"}
        </button>

        {/* RESULTS */}
        <div className="mt-6 space-y-5">
          {links.map((item, i) => {
            const message = getMessage(item.name, item.link);

            return (
              <div
                key={i}
                className="border p-4 rounded-xl bg-gray-50 shadow-sm"
              >
                {/* NAME */}
                <div className="font-semibold text-lg">{item.name}</div>

                {/* 🔥 CLICKABLE LINK */}
                <a
                  href={item.link}
                  target="_blank"
                  className="text-blue-600 underline break-all text-sm"
                >
                  {item.link}
                </a>

                {/* MESSAGE */}
                <pre className="bg-white p-3 rounded mt-3 text-sm whitespace-pre-wrap border">
                  {message}
                </pre>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => copy(message)}
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                  >
                    Copy Message
                  </button>

                  <button
                    onClick={() => copy(item.link)}
                    className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy Link
                  </button>

                  <a
                    href={item.link}
                    target="_blank"
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Open Link
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    WhatsApp
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
