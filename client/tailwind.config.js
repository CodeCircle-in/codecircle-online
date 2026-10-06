/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Brand & Accent */
        primary: '#9fe870',
        'primary-active': '#cdffad',
        'primary-neutral': '#c5edab',
        'primary-pale': '#e2f6d5',
        'on-primary': '#0e0f0c',

        /* Surfaces */
        canvas: '#ffffff',
        'canvas-soft': '#e8ebe6',

        /* Text */
        ink: '#0e0f0c',
        'ink-deep': '#163300',
        body: '#454745',
        mute: '#868685',

        /* Semantic */
        positive: '#2ead4b',
        'positive-deep': '#054d28',
        warning: '#ffd11a',
        'warning-deep': '#b86700',
        'warning-content': '#4a3b1c',
        negative: '#d03238',
        'negative-deep': '#a72027',
        'negative-darkest': '#a7000d',
        'negative-bg': '#320707',

        /* Tertiary accents */
        'accent-orange': '#ffc091',
        'accent-cyan': '#38c8ff',
      },
      borderRadius: {
        'wise-sm': '8px',
        'wise-md': '12px',
        'wise-lg': '16px',
        'wise-xl': '24px',
        'wise-pill': '9999px',
      },
      spacing: {
        'wise-xxs': '2px',
        'wise-xs': '4px',
        'wise-sm': '8px',
        'wise-md': '12px',
        'wise-lg': '16px',
        'wise-xl': '24px',
        'wise-2xl': '32px',
        'wise-3xl': '48px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
