import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()],
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            enabled: true,
            checker: 'vue-tsc',
            // Dedicated tsconfig that turns ON strictNullChecks. The project's
            // base config leaves strict off, under which `null`/`undefined` are
            // assignable to every type — so the #1613 guard's `null` assertions
            // would pass vacuously whether or not the bug is present. The bug
            // only bites consumers WITH strictNullChecks, so the guard must run
            // under it to model the affected consumer faithfully.
            tsconfig: './test/tsconfig.json',
            include: ['test/types/**/*.test-d.ts'],
            // Scope the run to the type-test files. vue-tsc walks the whole
            // imported source graph and flags pre-existing strictness nits
            // (e.g. `possibly undefined`) that the build config tolerates;
            // those are out of scope for this guard.
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
