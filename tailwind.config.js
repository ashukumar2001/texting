/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        drawer: "0px 0px 36px 15px rgba(227, 227, 225, 0.45)",
      },
      borderRadius: {
        50: "50%",
      },
      letterSpacing: {
        extra: ".25rem",
      },
    },
    colors: {
      gray: {
        100: "#fdfdfd",
        200: "#ececea",
        300: "#e3e3e1",
        400: "#bdbdc7",
        500: "#505050",
      },
    },
  },
  plugins: [],
};
