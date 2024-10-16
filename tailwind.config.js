module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#45a049',
        background: '#f0f0f0',
        text: '#333',
        quote: '#0066cc',
        motivation: '#e6f7ff',
        statsBackground: '#f9f9f9',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      width: {
        '96': '24rem',
      },
      height: {
        '96': '24rem',
      },
      spacing: {
        '10px': '10px',
        '15px': '15px',
        '20px': '20px',
      },
      borderRadius: {
        '4px': '4px',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
