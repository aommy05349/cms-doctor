/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'i-green': '#25AC67',
                'i-red': '#E54D3F',
                'i-green1': '#179B97',
            },
            fontFamily: {
                noto: ['Noto-Thai', 'Noto', 'sans-serif'],
                'noto-light': ['Noto-Thai-Light', 'Noto-Light', 'sans-serif'],
                'noto-medium': [
                    'Noto-Thai-Medium',
                    'Noto-Medium',
                    'sans-serif',
                ],
                'noto-bold': ['Noto-Thai-Bold', 'Noto-Bold', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
