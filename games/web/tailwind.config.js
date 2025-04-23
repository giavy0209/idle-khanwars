/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{html,ts}', // Đảm bảo bao gồm cả file .html và .ts của Angular
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}