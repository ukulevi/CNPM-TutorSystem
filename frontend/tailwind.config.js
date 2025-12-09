/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#003366',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#4DB8FF',
                    foreground: '#003366',
                },
                accent: {
                    DEFAULT: '#4DB8FF',
                    foreground: '#003366',
                },
                destructive: {
                    DEFAULT: '#ef4444',
                    foreground: '#ffffff',
                },
                background: '#ffffff',
                foreground: '#000000',
                ring: '#003366',
            },
        },
    },
    plugins: [],
}
