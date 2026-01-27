/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Workstream brand colors
        workstream: {
          purple: '#6366f1',      // Primary purple
          'purple-dark': '#4f46e5', // Darker purple for hover
          'purple-light': '#818cf8', // Lighter purple
          indigo: '#4338ca',      // Deep indigo
          navy: '#1e1b4b',        // Dark navy for backgrounds
        }
      }
    },
  },
  plugins: [],
}
