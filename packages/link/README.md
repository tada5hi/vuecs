# @vuecs/link 🔗

[![npm version](https://badge.fury.io/js/@vuecs%2Flink.svg)](https://badge.fury.io/js/@vuecs%2Flink)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Router-aware link component for Vue 3 with automatic detection of vue-router or Nuxt. Falls back to `<a>` when no router is available.

## Installation

```bash
npm install @vuecs/link
```

## Quick Start

```typescript
import link from '@vuecs/link';

app.use(link);
```

```vue
<!-- Route link (uses RouterLink/NuxtLink when available) -->
<VCLink to="/about">About</VCLink>

<!-- External link -->
<VCLink href="https://example.com" target="_blank">External</VCLink>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string \| object` | `undefined` | Route location (uses vue-router/Nuxt) |
| `href` | `string` | `undefined` | Plain URL (renders as `<a>`) |
| `active` | `boolean` | `false` | Active state |
| `disabled` | `boolean` | `false` | Disabled state |
| `prefetch` | `boolean` | `true` | Enable prefetch (Nuxt) |
| `target` | `string` | `'_self'` | Link target |
| `query` | `object` | `undefined` | Query parameters to append |

## License

Made with 💚

Published under [MIT License](./LICENSE).
