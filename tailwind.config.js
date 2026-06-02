/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        'brand-red': '#E63946',
        'brand-bg': '#08080B',
        'brand-panel': '#121217',
        'brand-text': '#F5F1EA',
        'brand-muted': '#B8B3AD',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        glow: '0 0 35px rgba(230,57,70,0.26)',
      },
    },
  },
  plugins: [],
};
