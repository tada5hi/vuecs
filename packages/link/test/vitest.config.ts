import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            // Contract guard for `LinkProps` (#1705). `<VCLink>`'s public prop
            // surface used to be mirrored by hand into a second `LinkProperties`
            // type that carried a `[key: string]: any` index signature — so a
            // prop could exist at runtime while being absent from the type
            // (`query` was, for two minor releases), and a misspelled key
            // compiled silently. Both failure modes are invisible to the
            // runtime build AND to the runtime specs: the component works, the
            // type just lies. These assertions import the BUILT `dist`
            // declarations — where the consumer-facing type actually manifests
            // — and fail the build if the surface drifts from `linkProps` again.
            enabled: true,
            checker: 'vue-tsc',
            // Dedicated tsconfig turning ON strictNullChecks so the assertions
            // don't pass vacuously (the base config leaves strict off).
            // `ignoreDeprecations: '6.0'` is REQUIRED — the root tsconfig's
            // `baseUrl` raises TS5101 under TS6, which makes vue-tsc skip
            // type-checking and report "no errors" even on wrong assertions.
            tsconfig: './test/tsconfig.json',
            include: ['test/types/**/*.test-d.ts'],
            // vue-tsc walks the imported dist graph and flags pre-existing
            // strictness nits the build config tolerates; out of scope here.
            ignoreSourceErrors: true,
        },
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx}'],
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
    },
});
