import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            // Drift guard for the generic-over-Row facade. The generic is a
            // hand-written cast layered over a plain `defineComponent`; only
            // the BUILT `dist` declarations show whether `Row` still threads
            // through props, slots and handler props.
            enabled: true,
            checker: 'vue-tsc',
            // strictNullChecks ON so the assertions don't pass vacuously.
            tsconfig: './test/tsconfig.json',
            include: ['test/types/**/*.test-d.ts'],
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
