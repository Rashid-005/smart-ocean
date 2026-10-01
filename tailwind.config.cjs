/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Popover"', 'sans-serif'],
      },
      colors: {
        navy: '#1a2332',
        ocean: '#0891b2',
        turquoise: '#14b8a6',
        sage: '#65a383',
        wheat: '#f5f0e8',
        amber: '#f59e0b',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}