/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          950: '#1b0736',
          900: '#340e63',
          800: '#4c1d95',
          700: '#6b21a8',
          600: '#8b2fc9',
          500: '#a855f7',
          400: '#c084fc',
          300: '#d8b4fe',
          200: '#e9d5ff',
          100: '#f3e8ff',
        },
        obsidian: {
          950: '#040206',
          900: '#08040c',
          800: '#0f0817',
          700: '#180d24',
          600: '#231336',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'violet-glow': '0 0 25px rgba(168, 85, 247, 0.35)',
        'violet-lg': '0 10px 40px -10px rgba(168, 85, 247, 0.45)',
        'purple-card': '0 20px 50px -15px rgba(76, 29, 149, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
