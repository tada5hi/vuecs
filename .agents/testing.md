# Testing

## Framework

- **Jest** (v30) with **ts-jest** for TypeScript support
- Each tested package has its own `test/jest.config.js`

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

Individual package test scripts use:
```bash
cross-env NODE_ENV=test jest --config ./test/jest.config.js
```

## Test File Naming

Tests use the `.spec.ts` suffix and live under `test/unit/`:
```
packages/core/test/unit/store.spec.ts
packages/core/test/unit/utils/evaluate.spec.ts
packages/navigation/test/unit/manager.spec.ts
```

## CI

The CI pipeline (`main.yml`) runs tests for the `navigation` package only via a matrix strategy. The `core` package tests are not explicitly included in CI but run via `npm run test` (Nx).
