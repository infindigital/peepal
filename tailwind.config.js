/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './article.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        // Article page (English edition)
        inter: ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        lora: ['Lora', 'Georgia', 'serif'],
        georgia: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        system: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
