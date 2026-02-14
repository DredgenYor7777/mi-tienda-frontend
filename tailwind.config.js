/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- ESTO ES LO IMPORTANTE: Busca en la carpeta src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}