import { readFileSync } from 'node:fs';

import { createConfig } from '../../rollup.config.mjs';

export default {
    ...createConfig({
        pkg: JSON.parse(readFileSync(new URL('./package.json', import.meta.url), { encoding: 'utf-8' })),
        vuePlugin: true,
    }),
    input: 'src/index.ts',
};
