/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:   ['"Inter"', '"DM Sans"', 'sans-serif'],
        serif:  ['"Playfair Display"', 'serif'],
        display:['"Outfit"', '"Inter"', 'sans-serif'],
      },
      colors: {
        brand: {
          dark:      '#004d44',
          cream:     '#f9f8f4',
          mint:      '#eaf0ec',
          highlight: '#006c5f',
          blue:      '#1a65ff',
          orange:    '#e86a33',
          teal:      '#00a36c',
        },
        text: {
          main:  '#1a1f1d',
          muted: '#4a5550',
        }
      },
      boxShadow: {
        'floating':    '0 10px 40px -10px rgba(0,0,0,0.15)',
        'card':        '0 4px 24px rgba(0,0,0,0.06)',
        'bottom-nav':  '0 -1px 0 rgba(0,0,0,0.06), 0 -8px 32px rgba(0,0,0,0.08)',
        'glow-green':  '0 4px 20px rgba(0, 77, 55, 0.35)',
        'inner-top':   'inset 0 2px 4px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl2':  '1.25rem',
        '2xl2': '1.75rem',
        '3xl':  '1.5rem',
        '4xl':  '2rem',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in':    'fadeIn 0.4s ease both',
        'scale-in':   'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-up':   'slideFromBottom 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideFromBottom: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 77, 55, 0.3)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(0, 77, 55, 0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
      },
    }
  },
  plugins: [],
}