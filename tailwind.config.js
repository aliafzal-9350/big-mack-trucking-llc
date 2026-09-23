/** @type {import('tailwindcss').Config} */
// Styling lives in app/globals.css (design tokens as CSS variables for the night/day shifts).
// Tailwind is kept for its preflight reset and utilities.
module.exports = {
  content: ['./app/**/*.{js,jsx,mdx}', './components/**/*.{js,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-text)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
