/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

const fallbackFonts = [
  "ui-sans-serif", "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        special: ["lobular", ...fallbackFonts],

        sans: ["FUNGIS", ...fallbackFonts],
        serif: ["serif"],
        mono: ["monospace"],
      },
      colors: {
        fg: "#e30002",
        fgDark: "#a40002",
        bg: "#FCFEFF",
        alt: "#ffef9b",
        grayDark: "#5D7280",
        grayMed: "#D0DFE7",
        grayLight: "#E1ECF2",
        grayUltraLight: "#F1FAFF",
      },
      backgroundImage: {
        "tooth-pattern": "url('/images/tooth-pattern.svg')",
      },
      height: { screen: '100svh' },
      width: { screen: '100svw' },
      screens: {
        xs: '420px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-touch')(),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        }
      })
    })
  ],
};
