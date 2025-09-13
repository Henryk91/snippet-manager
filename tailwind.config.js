/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: {
        tight: {
          css: {
            // general text
            fontSize: '0.8125rem',           // ~13px
            lineHeight: '1.2',
            p: { marginTop: '0.25rem', marginBottom: '0.25rem' },
            li: { marginTop: '0.125rem', marginBottom: '0.125rem' },
            // headings (rare in snippets, but make them tight)
            'h1,h2,h3,h4': { marginTop: '0.4rem', marginBottom: '0.3rem' },
            // code blocks
            'pre': {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              padding: '0.5rem',             // 8px
              fontSize: '0.75rem',           // 12px
              lineHeight: '1.15',
              borderRadius: '0.5rem',
            },
            'pre code': { fontSize: '0.75rem', lineHeight: '1.15' },
            code: { fontSize: '0.75rem' },   // inline code
            // lists
            'ul,ol': { marginTop: '0.25rem', marginBottom: '0.25rem' },
            // remove big margins around first/last elements
            '> :first-child': { marginTop: '0 !important' },
            '> :last-child': { marginBottom: '0 !important' },
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
};
