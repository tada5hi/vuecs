# @vuecs/timeago ⏰

[![npm version](https://badge.fury.io/js/@vuecs%2Ftimeago.svg)](https://badge.fury.io/js/@vuecs%2Ftimeago)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Relative time display component for Vue 3 with locale support and auto-update.

## Installation

```bash
npm install @vuecs/timeago @vuecs/core date-fns
```

## Quick Start

```typescript
import timeago from '@vuecs/timeago';
import { de } from 'date-fns/locale';

app.use(timeago, {
    locale: 'de',
    locales: { de },
});
```

```vue
<VCTimeago :datetime="new Date('2024-01-01')" />
<!-- renders: "3 months ago" (auto-updates) -->
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `datetime` | `Date \| number \| string` | required | The date to display relative to now |
| `locale` | `string` | `undefined` | Override the global locale |
| `autoUpdate` | `number \| boolean` | `true` | Auto-update interval in seconds (`true` = 60s) |
| `converter` | `Function` | `undefined` | Custom converter function |
| `converterOptions` | `object` | `undefined` | Options passed to converter |

## License

Made with 💚

Published under [MIT License](./LICENSE).
