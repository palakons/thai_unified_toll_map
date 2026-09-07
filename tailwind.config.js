/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'Inter', 'sans-serif'],
      },
      colors: {
        operator: {
          exat: {
            DEFAULT: '#2563EB', // Blue
            hover: '#1D4ED8',
            light: '#DBEAFE',
            text: '#1E40AF',
          },
          bem: {
            DEFAULT: '#7C3AED', // Purple
            hover: '#6D28D9',
            light: '#EDE9FE',
            text: '#5B21B6',
          },
          dmt: {
            DEFAULT: '#EA580C', // Orange
            hover: '#C2410C',
            light: '#FFEDD5',
            text: '#9A3412',
          },
          doh: {
            DEFAULT: '#059669', // Emerald/Green
            hover: '#047857',
            light: '#D1FAE5',
            text: '#065F46',
          },
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
