import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            // Drift guard: DataCollection must stay a structural superset of
            // ListState & ListMutators (the <VCList :state> binding). The two
            // packages have no runtime coupling, so only a type-level
            // assertion can catch the shapes drifting apart. Imports the
            // BUILT dist declarations of both packages — the published
            // surface is what a consumer actually binds.
            enabled: true,
            checker: 'tsc',
            // Dedicated tsconfig turning ON strictNullChecks so the
            // assignments don't pass vacuously.
            tsconfig: './test/tsconfig.json',
            include: ['test/types/**/*.test-d.ts'],
            // tsc walks the imported dist graph and flags pre-existing
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
