// .eslintrc.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // Importar correctamente el plugin
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Asegúrate de que JSX esté habilitado
        },
      },
      parser: "@typescript-eslint/parser", // Asegura que TypeScript esté siendo procesado
    },
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"], // Archivos de TypeScript
    extends: ["plugin:@typescript-eslint/recommended"],
    plugins: ["@typescript-eslint"],
  },
  pluginReact.configs.recommended,
  ...tseslint.configs.recommended,
];
