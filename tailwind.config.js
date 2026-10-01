/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './index2.html', './article.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C81E1E',
          darkred: '#991B1B',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
