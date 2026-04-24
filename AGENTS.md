<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

# vuecs — Agent Guide

A Vue 3 component library monorepo providing reusable UI components (navigation, form controls, pagination, list controls, etc.) with TypeScript support, CSS extraction, and themes for Bootstrap, Tailwind, and Font Awesome. Published as scoped `@vuecs/*` packages on npm.

## Quick Reference

```bash
# Setup
npm ci

# Development
npm run build          # Build all packages via Nx
npm run test           # Run tests across packages via Nx
npm run lint           # ESLint on all packages
npm run lint:fix       # Auto-fix lint issues
```

- **Node.js**: >=20 (most packages), CI uses v22
- **Package manager**: npm (workspaces)
- **Task runner**: Nx (caches build and test)

### Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@vuecs/core` | Theme system, global behavioral defaults, utilities, component infrastructure | 2.0.0 |
| `@vuecs/countdown` | Countdown/timer component | 1.0.1 |
| `@vuecs/form-controls` | Form input components (input, select, checkbox, textarea, range slider) | 2.5.0 |
| `@vuecs/gravatar` | Gravatar avatar component | 1.0.2 |
| `@vuecs/link` | Router-aware link component (vue-router/nuxt) | 1.0.1 |
| `@vuecs/list-controls` | List display controls | 2.0.1 |
| `@vuecs/navigation` | Multi-level navigation with NavigationManager | 2.4.1 |
| `@vuecs/pagination` | Pagination component | 1.3.1 |
| `@vuecs/theme-bootstrap-v4` | Bootstrap v4 theme | 1.0.1 |
| `@vuecs/theme-bootstrap-v5` | Bootstrap v5 theme | 2.0.1 |
| `@vuecs/theme-font-awesome` | Font Awesome icon theme | 1.1.1 |
| `@vuecs/theme-tailwind` | Tailwind CSS theme (exports `merge: ClassesMergeFn`) | 0.0.0 |
| `@vuecs/timeago` | Relative time display component | 1.1.2 |

### Dependency Layers

```
Layer 0 (no internal deps):  core, countdown, gravatar, link, timeago
Layer 1 (depends on core):   form-controls, list-controls, navigation, pagination
Layer 2 (depends on Layer 0): themes (@vuecs/core peer dep only — pure data that targets component packages at runtime)
```

`navigation` also depends on `@vuecs/link`.

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Monorepo layout, package organization, nested core re-exports, and build outputs
- **[Architecture](.agents/architecture.md)** — Vue plugin pattern, theme system, NavigationManager, and theme architecture
- **[Testing](.agents/testing.md)** — Jest setup, test locations, and coverage
- **[Conventions](.agents/conventions.md)** — Commit messages, linting, release-please, CI/CD pipelines
