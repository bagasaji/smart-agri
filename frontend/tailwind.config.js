/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'agri-green': '#1B4332',
        'agri-lime': '#52B788',
        'agri-sage': '#74C69D',
        'agri-light': '#B7E4C7',
        'agri-earth': '#6B4423',
        'agri-gold': '#D4A017',
        'agri-cream': '#F8FAF5',
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
