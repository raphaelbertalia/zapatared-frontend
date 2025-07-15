/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-laranja',
    'text-laranja',
    'bg-amarelo',
    'text-amarelo',
  ],
  theme: {
    extend: {
      colors: {
        laranja: "#ec4303",
        amarelo: "#fff200",
      },
      boxShadow: {
        leve: "0 1px 3px rgba(0,0,0,0.1)",
      },
      borderRadius: {
      grande: '10rem',
    },
    },
  },
  plugins: [],
};