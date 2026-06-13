/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        accent: "#2563eb"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(37, 99, 235, 0.10)"
      }
    }
  },
  plugins: []
};
