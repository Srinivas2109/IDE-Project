/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ide-bg': '#1e1e1e',
        'ide-sidebar': '#252526',
        'ide-panel': '#2d2d30',
        'ide-border': '#3e3e42',
        'ide-text': '#cccccc',
        'ide-text-secondary': '#969696',
        'ide-accent': '#007acc',
        'ide-accent-hover': '#005a9e',
        'ide-error': '#f48771',
        'ide-warning': '#cca700',
        'ide-info': '#75beff',
        'ide-success': '#89d185',
      },
      fontFamily: {
        'mono': ['Consolas', 'Monaco', 'Courier New', 'monospace'],
        'sans': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
