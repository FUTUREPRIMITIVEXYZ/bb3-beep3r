/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      mono: ["modeseven", "ui-monospace", "SFMono-Regular"],
    },
    extend: {
      colors: {
        "bpr-green": "#69e263",
        greydark: "#2D2D2D",
        greylight: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
