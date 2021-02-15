const colors = require('tailwindcss/colors');

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            // Build your palette here
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.trueGray,
            red: colors.red,
            yellow: colors.amber,
            blue: colors.blue,
            purple: colors.violet,
            green: colors.lime,
            teal: colors.teal,
        },
        extend: {
            fontFamily: {
                montserrat: ['Montserrat'],
            },
            transformOrigin: {
                0: '0%',
            },
            zIndex: {
                '-1': '-1',
            },
            height: {
                'fit-content': 'fit-content',
            },
        },
    },
    variants: {
        extend: {
            gradientColorStops: ['disabled', 'group-hover'],
            borderColor: ['disabled', 'group-focus', 'group-hover'],
            textColor: ['group-focus'],
            inset: ['hover', 'focus'],
            margin: ['last'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        // ...
    ],
};
