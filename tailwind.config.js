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
          900: '#2f1350',
          800: '#4d286f',
          700: '#5e3488',
          600: '#7440a8',
          500: '#9463b9',
          400: '#b990d6',
          300: '#cbb0e2',
          200: '#ddd0ec',
          100: '#efe8f5',
        },
        obsidian: {
          950: '#040206',
          900: '#08040c',
          850: '#0a0710',
          800: '#0f0817',
          750: '#120a1a',
          700: '#180d24',
          650: '#1a0f28',
          600: '#231336',
        },
        paper: '#f7f5f2',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces"', '"Outfit"', 'serif'],
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
