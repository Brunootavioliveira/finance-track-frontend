/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0D0F1C',
          secondary: '#13162B',
          card: '#181B35',
          hover: '#1E2240',
        },
        accent: {
          purple: '#7C5CFC',
          'purple-light': '#9B7DFF',
          'purple-glow': 'rgba(124, 92, 252, 0.3)',
          green: '#22C55E',
          'green-dim': 'rgba(34, 197, 94, 0.15)',
          red: '#F43F5E',
          'red-dim': 'rgba(244, 63, 94, 0.15)',
        },
        text: {
          primary: '#EDF0FF',
          secondary: '#8891B4',
          muted: '#4A5177',
        }
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.35)',
        glow: '0 0 40px rgba(124, 92, 252, 0.15)',
        'glow-sm': '0 0 20px rgba(124, 92, 252, 0.2)',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(145deg, #1E2148, #13162B)',
        'purple-gradient': 'linear-gradient(135deg, #7C5CFC, #5B8AF5)',
        'green-gradient': 'linear-gradient(135deg, #22C55E, #16A34A)',
        'header-gradient': 'linear-gradient(90deg, #0D0F1C, #13162B)',
      }
    },
  },
  plugins: [],
}
