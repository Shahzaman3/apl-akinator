/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'retro-sky': '#6CBDE3',
        'retro-grass': '#52B336',
        'retro-pitch': '#D5C492',
        'retro-wood': '#394632',
        'retro-border': '#111',
        'retro-gold': '#F4B41A',
        'retro-red': '#DF3A3A',
        brand: {
          titleBg: '#213054', // Dark blue border for title
          titleFill: '#FFC83D', // Yellow for main title
          subtitleBg: '#1A1A1A',
          panelBg: '#3F443E', // Dark green/brown for main panel
          panelBorder: '#D8B155',
          textHighlight: '#FFFFFF',
          startText: '#F7C64E'
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,1)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flash: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'flash': 'flash 1.5s ease-out forwards',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
