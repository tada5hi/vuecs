import { URL, fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

/*
 * Builds component demos as standalone HTML pages, output to
 * `docs/src/public/demos/` so VitePress's dev/build serves them as static
 * assets at `/demos/<name>.html`. The docs `<Demo>` host component embeds
 * each one in an `<iframe>` — completely isolating demo CSS from VitePress's
 * unlayered `button` reset and `.vp-doc` chrome rules.
 *
 * Each demo is a tiny Vue app: HTML shell + TS entry + .demo.vue component.
 * They compose just like a real consumer would: `app.use(vuecs, ...)` +
 * `app.use(<componentPlugin>)` against the same `@vuecs/theme-tailwind`
 * the docs site uses.
 *
 * Adding a new demo: drop `<name>.html` + `<name>.ts` + `<name>.demo.vue`
 * into `src/` — the rollup input map below auto-discovers every `.html`
 * file at build time, so no manual entry-list maintenance.
 */
const srcDir = fileURLToPath(new URL('./src', import.meta.url));

const buildEntries = (): Record<string, string> => Object.fromEntries(
    readdirSync(srcDir)
        .filter((file) => file.endsWith('.html'))
        .map((file) => [file.replace(/\.html$/, ''), `${srcDir}/${file}`]),
);

export default defineConfig({
    root: srcDir,
    // Demos are served by VitePress under `/demos/`; emit asset URLs
    // relative to that prefix so the iframe resolves CSS/JS correctly.
    base: '/demos/',
    publicDir: false,
    plugins: [
        vue(),
        tailwindcss(),
    ],
    build: {
        outDir: fileURLToPath(new URL('../src/public/demos', import.meta.url)),
        emptyOutDir: true,
        rollupOptions: { input: buildEntries() },
    },
    server: { port: 5174 },
});
