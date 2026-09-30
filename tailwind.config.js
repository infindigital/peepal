/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './article.html', './js/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
