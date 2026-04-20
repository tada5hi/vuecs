# @vuecs/pagination 📖

[![npm version](https://badge.fury.io/js/@vuecs%2Fpagination.svg)](https://badge.fury.io/js/@vuecs%2Fpagination)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Pagination component for Vue 3 with page calculation utilities and icon support via presets.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Props](#props)
- [Theme Slots](#theme-slots)
- [License](#license)

## Installation

```bash
npm install @vuecs/pagination @vuecs/core
```

## Quick Start

```typescript
import pagination from '@vuecs/pagination';

app.use(pagination);
```

```vue
<template>
    <VCPagination
        :total="100"
        :limit="10"
        :offset="currentOffset"
        @load="onPageChange"
    />
</template>
```

Or with a unified meta object:

```vue
<VCPagination :meta="{ total: 100, limit: 10, offset: 0 }" @load="onPageChange" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | `0` | Total number of items |
| `limit` | `number` | `0` | Items per page |
| `offset` | `number` | `undefined` | Current offset |
| `busy` | `boolean` | `false` | Disables page buttons when true |
| `meta` | `PaginationMetaInput` | `undefined` | Unified object (overrides individual props) |
| `tag` | `string` | `'ul'` | Root element tag |
| `itemTag` | `string` | `'li'` | Page item element tag |
| `iconTag` | `string` | `'i'` | Icon element tag |
| `theme` | `ThemeOverride` | `undefined` | Per-instance theme override |

## Theme Slots

| Key | Default | Description |
|-----|---------|-------------|
| `root` | `vc-pagination` | Root container |
| `item` | `vc-pagination-item` | Page item wrapper |
| `link` | `vc-pagination-link` | Page button |
| `linkActive` | `active` | Active page button |
| `prevIcon` | `''` | Previous page icon class |
| `nextIcon` | `''` | Next page icon class |
| `firstIcon` | `''` | First page icon class |
| `lastIcon` | `''` | Last page icon class |

## License

Made with 💚

Published under [MIT License](./LICENSE).
