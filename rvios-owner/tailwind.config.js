/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9E2226",
        "primary-dark": "#6E1518",
        "primary-light": "#C7484C",
      },
      fontFamily: {
        display: ["var(--font-yapari)", "var(--font-maghfira)", "sans-serif"],
        body: ["var(--font-panorama)", "var(--font-givonic)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
