import { defineConfig } from 'tsdown';

/**
 * Shared tsdown options for every `@vuecs/*` package build. Spread into each
 * package's `tsdown.config.ts` — Vue-SFC packages add `plugins: [vue()]`.
 * Mirrors the `tsconfig.build.json extends "../../tsconfig.build.json"`
 * single-source pattern the repo already uses for TS config.
 *
 * `.mjs` (not `.ts`) so tsdown's native config loader resolves it without a
 * `--config-loader tsx` flag; the options are plain data, no types needed.
 */
export const base = defineConfig({
    entry: 'src/index.ts',
    format: 'esm',
    dts: false,
    sourcemap: true,
});
