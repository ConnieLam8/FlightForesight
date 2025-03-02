const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        custom: ["var(--font-DINPro)"],
      },
      backgroundColor: {
        primary: "#ff9e1b",
      },
      maxWidth: {
        customInput: "230px", // Add your custom maximum width here
      },
      padding: {
        pagePadding: "20px 40px",
      },
      textColor: {
        primary: "#ff9e1b",
      },
    },
  },
  plugins: [],
});