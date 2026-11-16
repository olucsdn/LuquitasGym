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
          dark: '#09090B',
          card: '#121215',
          cardHover: '#18181D',
          border: '#24242B',
          orange: '#FF6B00',
          orangeLight: '#FF8533',
          orangeMuted: 'rgba(255, 107, 0, 0.15)',
          text: '#FFFFFF',
          muted: '#A1A1AA',
        }
      }
    },
  },
  plugins: [],
}
