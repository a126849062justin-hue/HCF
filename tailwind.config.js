/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        // sci colors reference CSS custom properties (--theme-*-rgb) defined
        // via inline <style> in each HTML page (set dynamically by the theme system)
        sci: {
          base: 'rgba(var(--theme-base-rgb), <alpha-value>)',
          surface: 'rgba(var(--theme-surface-rgb), <alpha-value>)',
          cyan: 'rgba(var(--theme-cyan-rgb), <alpha-value>)',
          gold: 'rgba(var(--theme-gold-rgb), <alpha-value>)',
          gray: '#94a3b8',
          accent: 'rgba(var(--theme-cyan-rgb), <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    }
  },
  plugins: [],
}
