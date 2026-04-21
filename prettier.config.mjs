/** @type {import("prettier").Config} */
export default {
  semi: true,
  useTabs: false,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  printWidth: 100,
  proseWrap: "always",
  quoteProps: "as-needed",
  requirePragma: false,
  htmlWhitespaceSensitivity: "css",
  embeddedLanguageFormatting: "auto",
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-packagejson"],
  tailwindAttributes: ["class", "className", "ngClass", ".*[cC]lassName"],
  tailwindFunctions: ["classNames", "clsx", "cn"],
};
