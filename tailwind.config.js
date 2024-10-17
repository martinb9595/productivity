module.exports = {
  content: ['./popup.html', './src/html/*.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  content: ["./src/html/**/*.html", "./src/js/**/*.js"],
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
