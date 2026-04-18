module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Great Vibes", "cursive"], // 💍 Names / headings
        wedding: ["Cormorant Garamond", "serif"], // 📜 elegant body / invite text
        body: ["Inter", "sans-serif"], // 📱 UI / small text
      },
    },
  },
  plugins: [],
};
