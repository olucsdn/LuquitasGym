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
        gym: {
          dark: '#0F0F12',
          card: '#18181C',
          cardHover: '#222228',
          border: '#2A2A32',
          emerald: '#10B981',
          orange: '#F97316',
          text: '#F4F4F5',
          muted: '#A1A1AA',
        }
      }
    },
  },
  plugins: [],
}
