# @vuecs/navigation 🧭

[![npm version](https://badge.fury.io/js/@vuecs%2Fnavigation.svg)](https://badge.fury.io/js/@vuecs%2Fnavigation)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Multi-level navigation components for Vue 3 with `NavigationManager`, path-based active state matching, and vue-router integration.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [NavigationManager](#navigationmanager)
- [Typed Slot Props](#typed-slot-props)
- [Theme Slots](#theme-slots)
- [License](#license)

## Installation

```bash
npm install @vuecs/navigation @vuecs/core @vuecs/link
```

## Quick Start

```typescript
import { install as installNavigation } from '@vuecs/navigation';

installNavigation(app, {
    items: [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
        {
            name: 'Settings',
            children: [
                { name: 'Profile', url: '/settings/profile' },
                { name: 'Security', url: '/settings/security' },
            ],
        },
    ],
});
```

```vue
<template>
    <VCNavItems :level="0" />
</template>
```

## Components

| Component | Description |
|-----------|-------------|
| `VCNavItems` | Renders a list of navigation items at a given level |
| `VCNavItem` | Single navigation item (link, separator, or group with children) |

## NavigationManager

The `NavigationManager` maintains the navigation tree state:

```typescript
import { NavigationManager, provideNavigationManager } from '@vuecs/navigation';

const manager = new NavigationManager({ items: [...] });
provideNavigationManager(manager, app);

// Build navigation matching current path
await manager.build({ path: '/settings/profile' });
```

Items can also be provided as an async function for lazy loading:

```typescript
installNavigation(app, {
    items: async ({ level, parent }) => {
        return fetchNavigationItems(level, parent);
    },
});
```

## Typed Slot Props

Slot prop interfaces are exported for render-function consumers:

```typescript
import {
    VCNavItem,
    type NavItemLinkSlotProps,
} from '@vuecs/navigation';

h(VCNavItem, { data }, {
    link: (props: NavItemLinkSlotProps) =>
        h('a', { onClick: () => props.select(props.data) }, props.data.name),
});
```

| Export | Used by |
|--------|---------|
| `NavItemSeparatorSlotProps<META>` | `VCNavItem` `separator` |
| `NavItemLinkSlotProps<META>` | `VCNavItem` `link` |
| `NavItemSubSlotProps<META>` | `VCNavItem` `sub` |
| `NavItemSubTitleSlotProps<META>` | `VCNavItem` `sub-title` |
| `NavItemSubItemsSlotProps<META>` | `VCNavItem` `sub-items` |
| `NavItemsItemSlotProps<META>` | `VCNavItems` `item` |

## Theme Slots

| Key | Default | Description |
|-----|---------|-------------|
| `group` | `vc-nav-items` | Items list container |
| `item` | `vc-nav-item` | Single item wrapper |
| `itemNested` | `vc-nav-item-nested` | Item with children |
| `separator` | `vc-nav-separator` | Separator element |
| `link` | `vc-nav-link` | Link element |
| `linkRoot` | `vc-nav-link-root` | Root-level link |
| `linkIcon` | `vc-nav-link-icon` | Link icon wrapper |
| `linkText` | `vc-nav-link-text` | Link text wrapper |

## License

Made with 💚

Published under [MIT License](./LICENSE).
