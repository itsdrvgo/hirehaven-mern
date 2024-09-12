import globals from "globals";
import pluginJs from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import tsEslint from "typescript-eslint";

export default [
    pluginJs.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        languageOptions: { globals: globals.node },
        rules: {
            "no-unused-vars": "off",
            semi: ["error", "always"],
            "unused-imports/no-unused-imports": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
];
