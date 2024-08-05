import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ['.eslintrc.js', 'eslint.config.mjs', 'src/db/*.ts'], },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/naming-convention":
        [
          "error",
          { "selector": "variableLike", "format": ["camelCase"] },
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Za-z0-9_]',
              match: true,
            },
          },
          {
            selector: 'class',
            format: ['PascalCase'],
            custom: {
              regex: 'X[A-Z][A-Za-z0-9_]',
              match: true,
            },
          },
          {
            selector: 'enum',
            format: ['PascalCase'],
            custom: {
              regex: '^Enum[A-Za-z0-9_]',
              match: true,
            },
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            custom: {
              regex: '^param[A-Za-z0-9_]',
              match: true,
            },
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
            custom: {
              regex: '^T[A-Za-z0-9_]',
              match: true,
            },
          },
        ],
    }
  }
];
