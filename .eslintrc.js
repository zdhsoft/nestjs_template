module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', 'src/db/*.ts'],
    rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
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
    },
};
