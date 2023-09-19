/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minWidth: {
        profileWidth: "3rem",
      },
      minHeight: {
        profileHeight: "3rem",
      },
      backgroundImage: {
        "chat-background":
          "url('https://images.unsplash.com/photo-1515387784663-e2e29a23f69e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80')",
      },
      boxShadow: {
        drawer: "0px 0px 36px 15px rgba(227, 227, 225, 0.45)",
      },
      borderRadius: {
        50: "50%",
      },
      letterSpacing: {
        extra: ".25rem",
      },
      colors: {
        gray: {
          0: "#fff",
          100: "#fdfdfd",
          200: "#ececea",
          300: "#e3e3e1",
          400: "#bdbdc7",
          500: "#6b6b6b",
          600: "#505050",
        },
        backdrop: {
          0: "transparent",
          25: "rgba(253, 253, 253, .25)",
          50: "rgba(253, 253, 253, .50)",
          75: "rgba(253, 253, 253, .75)",
          125: "rgba(236, 236, 234, .25)",
          150: "rgba(236, 236, 234, .50)",
          175: "rgba(236, 236, 234, .75)",
          325: "rgba(227, 227, 225, .25)",
          350: "rgba(227, 227, 225, .50)",
          375: "rgba(227, 227, 225, .75)",
          425: "rgba(189, 189, 199, .25)",
          450: "rgba(189, 189, 199, .50)",
          475: "rgba(189, 189, 199, .75)",
          525: "rgba(80, 80, 80, .25)",
          550: "rgba(80, 80, 80, .50)",
          575: "rgba(80, 80, 80, .75)",
        },
        green: {
          active: "#00a67e",
        },
        para: {
          100: "rgba(80, 80, 80, 0.75)",
        },
      },
    },
  },
  plugins: [],
};
