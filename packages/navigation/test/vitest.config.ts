import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()],
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            // Drift guard for the generic-over-`Item` facade (#1659). The
            // generic is a hand-written cast layered over a plain
            // `defineComponent`; the runtime build can't catch a facade
            // that silently stops threading `Item` (wrong handler-prop
            // casing, a stale `Omit` key after a prop rename, a slot left
            // un-parameterized). These assertions import the BUILT `dist`
            // declarations — where the generic actually manifests — and
            // fail the build if inference regresses. Mirrors @vuecs/list
            // and @vuecs/table.
            enabled: true,
            checker: 'vue-tsc',
            // Dedicated tsconfig turning ON strictNullChecks so the
            // assertions don't pass vacuously (the base config leaves
            // strict off). `ignoreDeprecations: '6.0'` is REQUIRED — the
            // root tsconfig's `baseUrl` raises TS5101 under TS6, which
            // makes vue-tsc skip type-checking and report "no errors"
            // even on wrong assertions (vacuous guard).
            tsconfig: './test/tsconfig.json',
            include: ['test/types/**/*.test-d.ts'],
            // vue-tsc walks the imported dist graph and flags pre-existing
            // strictness nits the build config tolerates; out of scope here.
            ignoreSourceErrors: true,
        },
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx,vue}'],
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
    },
});
