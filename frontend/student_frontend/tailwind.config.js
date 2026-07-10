/** @type {import('tailwindcss').Config} */
export default {
  // Enable class strategy and data-theme fallback so JS toggles always win over OS preference
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
