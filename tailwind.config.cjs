/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(red|green|blue|orange)-(100|500|700)/, // You can display all the colors that you need
      variants: ['lg', 'hover', 'focus', 'lg:hover'],      // Optional
    },
  ],
  theme: {
    extend: {
      fontFamily : {
        'poppins' : ['poppins', 'sans-serif'],
        'rasa' : ['rasa', 'sans-serif']
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        qc: {
          primary: "#7c3aed",
          secondary: "#34d399",
          "base-100": "#ffffff",
        },
      },
      "light",
      "dark",
      "night"
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
