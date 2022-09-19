const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.tsx"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
  },
  plugins: [],
};
