// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

const FRAMEWORK_IMPORTS = ["react", "react-native", "react-native-*", "expo", "expo-*", "@expo/*", "@tanstack/*", "zustand"];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["src/**/domain/**/*.ts"],
    ignores: ["src/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: FRAMEWORK_IMPORTS, message: "O domínio não pode depender de React, Expo ou bibliotecas de UI/estado." },
            { group: ["**/data/**", "**/presentation/**", "@/main/**"], message: "O domínio não pode importar data, presentation ou main." },
          ],
        },
      ],
    },
  },
  {
    files: ["src/core/**/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["@/features/**", "@/main/**"], message: "core e shared não podem depender de features ou main." }] },
      ],
    },
  },
  {
    files: ["src/features/*/data/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["**/presentation/**", "react", "react-native"], message: "A camada data não pode importar presentation nem React." }] },
      ],
    },
  },
]);
