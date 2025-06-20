/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",       // for app directory
        "./src/components/**/*.{js,ts,jsx,tsx}" // shared UI components
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [],
}
