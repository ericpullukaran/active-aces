/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("@acme/tailwind-config")],
};
// const a = require("@acme/tailwind-config");
// const fs = require("fs");
// fs.appendFileSync("testss", JSON.stringify(a, null, 2));
// console.dir(a, { depth: Infinity });
