import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            // Drift guard for the generic-over-Row facade (#1601). The
            // generic is a hand-written cast layered over a plain
            // `defineComponent`; the runtime build can't catch a facade
            // that silently stops threading `Row` (wrong handler-prop
            // casing, a stale `Omit` key after a prop rename, a slot left
            // un-parameterized). These assertions import the BUILT `dist`
            // declarations — where the generic actually manifests — and
            // fail the build if inference regresses.
            enabled: true,
            checker: 'vue-tsc',
            // Dedicated tsconfig turning ON strictNullChecks so the
            // assertions don't pass vacuously (the base config leaves
            // strict off). Mirrors @vuecs/forms' type-test setup.
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
                branches: 70,
                functions: 70,
                lines: 70,
                statements: 70,
            },
        },
    },
});
