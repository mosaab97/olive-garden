/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50:  '#f4f6f0',
          100: '#e6eadc',
          200: '#cdd6bb',
          300: '#aebb91',
          400: '#8fa068',
          500: '#6b7d47',    // primary olive green
          600: '#556336',
          700: '#424d2a',
          800: '#313920',
          900: '#1e2213',
        },
        earth: {
          50:  '#f7f4f0',
          100: '#ece5db',
          200: '#d9cbb7',
          300: '#c4ac8e',
          400: '#ae8d67',
          500: '#8B6914',    // earthy brown / gold
          600: '#7a5c10',
          700: '#5e460c',
          800: '#3e2e08',
          900: '#1f1704',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf7ef',
          200: '#f4edda',
          300: '#ecdfc0',
          DEFAULT: '#f7f3e9', // warm off-white background
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'], // for headings / branding
      },
    },
  },
  plugins: [],
};
