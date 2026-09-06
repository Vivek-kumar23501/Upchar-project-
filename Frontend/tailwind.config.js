/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          dark: '#004d44',
          cream: '#f9f8f4',
          mint: '#eaf0ec',
          highlight: '#006c5f',
          blue: '#1a65ff',
          orange: '#e86a33', // New color added
        },
        text: {
          main: '#1a1f1d',
          muted: '#4a5550'
        }
      },
      boxShadow: {
        'floating': '0 10px 40px -10px rgba(0,0,0,0.15)', // New shadow added
      }
    }
  },
  plugins: [],
}