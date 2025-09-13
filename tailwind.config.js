/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: {
        smcode: {
          css: {
            code: { fontSize: '0.75rem' },      // inline code
            'pre code': { fontSize: '0.75rem' } // fenced code
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
};
