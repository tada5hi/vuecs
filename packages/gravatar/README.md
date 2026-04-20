# @vuecs/gravatar 📷

[![npm version](https://badge.fury.io/js/@vuecs%2Fgravatar.svg)](https://badge.fury.io/js/@vuecs%2Fgravatar)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Gravatar avatar component for Vue 3.

## Installation

```bash
npm install @vuecs/gravatar @vuecs/core
```

## Quick Start

```typescript
import gravatar from '@vuecs/gravatar';

app.use(gravatar);
```

```vue
<VCGravatar email="user@example.com" :size="120" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `email` | `string` | `''` | Email address for Gravatar lookup |
| `hash` | `string` | `''` | Pre-computed MD5 hash (alternative to email) |
| `size` | `number` | `80` | Image size in pixels |
| `defaultImg` | `string` | `'retro'` | Default image style |
| `rating` | `string` | `'g'` | Content rating |
| `alt` | `string` | `'Avatar'` | Alt text |

## License

Made with 💚

Published under [MIT License](./LICENSE).
