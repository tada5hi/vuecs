# Testing

## Framework

- **Vitest** with v8 coverage provider
- Each tested package has its own `test/vitest.config.ts`

## Test Locations

Only two packages currently have tests:

| Package | Test directory | What's tested |
|---------|---------------|---------------|
| `@vuecs/core` | `packages/core/test/unit/` | Store operations, utility functions (evaluate) |
| `@vuecs/navigation` | `packages/navigation/test/unit/` | NavigationManager |

## Running Tests

```bash
# All tests via Nx
npm run test

# Single package
npm run test --workspace=packages/core --if-present
npm run test --workspace=packages/navigation --if-present
```

## Test File Naming

Tests use the `.spec.ts` suffix and live under `test/unit/`:
```
packages/core/test/unit/store.spec.ts
packages/core/test/unit/utils/evaluate.spec.ts
packages/navigation/test/unit/manager.spec.ts
```

## Vitest Config

Each tested package has a `test/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx}'],
            thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
        },
    },
});
```

## CI

The CI pipeline (`main.yml`) runs tests for the `navigation` package only via a matrix strategy. The `core` package tests are not explicitly included in CI but run via `npm run test` (Nx).
