import config from '@tada5hi/eslint-config';

export default [
    ...await config(),
    { ignores: ['**/dist/**', '.nx/cache/**', 'examples/nuxt/.nuxt/**', 'examples/nuxt/.output/**'] },
];
