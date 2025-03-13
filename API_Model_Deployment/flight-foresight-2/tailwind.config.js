import daisyui from './node_modules/daisyui'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Ensure React files are included
  ],
  theme: {
    extend: {},
  },
  // plugins: [
  //   require('daisyui')
  // ],
  plugins: [
    daisyui
  ],
  daisyui: {
    // themes: ["light"], // Add the themes you want to use
    themes: [
      
      {
        mytheme: {
          "base-100": "#ffffff", // Background color
        },
      },
    ],
  }
};