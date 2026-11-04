import nextConfig from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
    {
        ignores: ['.next/**', 'node_modules/**', '.netlify/**', 'lambda/**', '_experiments/**']
    },
    ...nextConfig,
    {
        rules: {
            '@next/next/no-img-element': 'off'
        }
    }
];

export default eslintConfig;
