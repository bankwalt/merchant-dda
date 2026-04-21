import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
import tailwindcssAnimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        sm: "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
        lg: "0px 2px 16px 0px rgba(0, 0, 0, 0.20)",
        xl: "0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
      },
    },
    fontFamily: {
      opensans: ["Open Sans", "sans-serif"],
    },
    colors: {
      modal: "rgb(var(--modal) / 0.4)",
      white: "rgb(var(--white) / <alpha-value>)",
      black: "rgb(var(--black) / <alpha-value>)",
      transparent: "transparent",
      neutral: {
        100: "rgb(var(--neutral-100) / <alpha-value>)",
        200: "rgb(var(--neutral-200) / <alpha-value>)",
        300: "rgb(var(--neutral-300) / <alpha-value>)",
        400: "rgb(var(--neutral-400) / <alpha-value>)",
        500: "rgb(var(--neutral-500) / <alpha-value>)",
        600: "rgb(var(--neutral-600) / <alpha-value>)",
        700: "rgb(var(--neutral-700) / <alpha-value>)",
        800: "rgb(var(--neutral-800) / <alpha-value>)",
        900: "rgb(var(--neutral-900) / <alpha-value>)",
      },
      primary: {
        100: "rgb(var(--primary-100) / <alpha-value>)",
        200: "rgb(var(--primary-200) / <alpha-value>)",
        300: "rgb(var(--primary-300) / <alpha-value>)",
        400: "rgb(var(--primary-400) / <alpha-value>)",
        500: "rgb(var(--primary-500) / <alpha-value>)",
        600: "rgb(var(--primary-600) / <alpha-value>)",
        700: "rgb(var(--primary-700) / <alpha-value>)",
        800: "rgb(var(--primary-800) / <alpha-value>)",
        900: "rgb(var(--primary-900) / <alpha-value>)",
      },
      secondary: {
        100: "rgb(var(--secondary-100) / <alpha-value>)",
        200: "rgb(var(--secondary-200) / <alpha-value>)",
        300: "rgb(var(--secondary-300) / <alpha-value>)",
        400: "rgb(var(--secondary-400) / <alpha-value>)",
        500: "rgb(var(--secondary-500) / <alpha-value>)",
        600: "rgb(var(--secondary-600) / <alpha-value>)",
        700: "rgb(var(--secondary-700) / <alpha-value>)",
        800: "rgb(var(--secondary-800) / <alpha-value>)",
        900: "rgb(var(--secondary-900) / <alpha-value>)",
      },
      info: {
        200: "rgb(var(--info-200) / <alpha-value>)",
        300: "rgb(var(--info-300) / <alpha-value>)",
        500: "rgb(var(--info-500) / <alpha-value>)",
        600: "rgb(var(--info-600) / <alpha-value>)",
        700: "rgb(var(--info-700) / <alpha-value>)",
        800: "rgb(var(--info-800) / <alpha-value>)",
      },
      success: {
        200: "rgb(var(--success-200) / <alpha-value>)",
        300: "rgb(var(--success-300) / <alpha-value>)",
        500: "rgb(var(--success-500) / <alpha-value>)",
        700: "rgb(var(--success-700) / <alpha-value>)",
        800: "rgb(var(--success-800) / <alpha-value>)",
      },
      warning: {
        200: "rgb(var(--warning-200) / <alpha-value>)",
        300: "rgb(var(--warning-300) / <alpha-value>)",
        500: "rgb(var(--warning-500) / <alpha-value>)",
        700: "rgb(var(--warning-700) / <alpha-value>)",
        800: "rgb(var(--warning-800) / <alpha-value>)",
      },
      error: {
        200: "rgb(var(--error-200) / <alpha-value>)",
        300: "rgb(var(--error-300) / <alpha-value>)",
        500: "rgb(var(--error-500) / <alpha-value>)",
        700: "rgb(var(--error-700) / <alpha-value>)",
        800: "rgb(var(--error-800) / <alpha-value>)",
      },
    },
  },
  plugins: [
    forms,
    aspectRatio,
    tailwindcssAnimate,
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".body-200": { fontSize: "0.75rem", fontWeight: "400", lineHeight: "166%" },
        ".body-300": { fontSize: "0.75rem", fontWeight: "600", lineHeight: "166%" },
        ".body-400": { fontSize: "0.875rem", fontWeight: "400", lineHeight: "140%" },
        ".body-500": { fontSize: "1rem", fontWeight: "400", lineHeight: "150%" },
        ".body-600": { fontSize: "1.125rem", fontWeight: "400", lineHeight: "155%" },
        ".legal-text": { fontSize: "0.625rem", fontWeight: "400", lineHeight: "160%" },
        ".inter": { fontSize: "0.875rem", fontWeight: "500", lineHeight: "1.225rem" },
        ".heading-100": { fontSize: "0.75rem", fontWeight: "600", lineHeight: "133%" },
        ".heading-200": { fontSize: "0.875rem", fontWeight: "600", lineHeight: "140%" },
        ".heading-300": { fontSize: "1rem", fontWeight: "600", lineHeight: "150%" },
        ".heading-400": { fontSize: "1.125rem", fontWeight: "600", lineHeight: "155%" },
        ".heading-500": { fontSize: "1.5rem", fontWeight: "600", lineHeight: "133%" },
        ".heading-600": { fontSize: "1.875rem", fontWeight: "600", lineHeight: "133%" },
        ".heading-700": { fontSize: "2.25rem", fontWeight: "600", lineHeight: "122%" },
        ".heading-800": { fontSize: "3rem", fontWeight: "700", lineHeight: "125%" },
        ".heading-900": { fontSize: "3.5rem", fontWeight: "700", lineHeight: "120%" },
      });
    }),
  ],
} satisfies Config;
