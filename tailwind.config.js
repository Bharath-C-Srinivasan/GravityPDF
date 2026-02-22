/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050714',
        'neon-cyan': '#22d3ee',
        'neon-magenta': '#d946ef',
        'neon-orange': '#f97316',
        'neon-gold': '#fbbf24',
        'neon-green': '#39ff14',
        'electric-blue': '#0077b5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
