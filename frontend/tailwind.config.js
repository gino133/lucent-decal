/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        "on-background": "var(--color-on-background)",
        surface: "var(--color-surface)",
        outline: "var(--color-outline)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Montserrat", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      spacing: {
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        gutter: "24px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      borderRadius: {
        xl: "0.5rem",
        "2xl": "0.75rem",
      },
    },
  },
  plugins: [],
};
