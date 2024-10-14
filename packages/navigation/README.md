# @vuecs/navigation 🧭

[![npm version](https://badge.fury.io/js/@vuecs%2Fnavigation.svg)](https://badge.fury.io/js/@vuecs%2Fnavigation)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

A package containing basic components, to build multi level navigation menus.

> **Note**
> The package is still in development and the API is still subject to change.
> Besides, the documentation still needs to be expanded

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
    - [buildNavigation](#buildnavigation)
- [Types](#types)
    - [NavigationBuildContext](#navigationbuildcontext)
    - [NavigationItem](#NavigationItem)
    - [NavigationProvider](#navigationprovider)
- [Example](#example)
- [License](#license)

## Installation

```
$ npm i --save @vuecs/navigation
```

## Usage

To use the navigation component, a constant must be defined, 
which satisfy the [NavigationProvider](#navigationprovider) type.

The implementation will provide different navigation elements for each tier.
The tier is a numeric value, which can be any positive integer (including 0).

`module.ts`

```typescript
import {
    NavigationItem,
    defineNavigationProvider
} from "@vuecs/navigation";

const primaryItems: NavigationItem[] = [
    {
        name: 'Home',
        url: '/',
        icon: 'fa fa-home'
    },
    {
        name: 'About',
        url: '/about',
        icon: 'fa fa-info'
    }
]

export const provider = defineNavigationProvider({
    async getItems(tier: number, itemsActive: NavigationItem[]) {
        // Return elements for a specific tier.
        // The context provides the current active elements for
        // the parent tiers.
        
        if(tier === 0) {
            return primaryItems;
        }
        
        // tier does not exist
        return undefined;
    },
    async getItemsActiveByURL(url: string) {
        // build element context for url
        if (url === '/') {
            return [
                primaryItems[0]
            ]
        }

        if (url === '/about') {
            return [
                primaryItems[1]
            ]
        }

        return undefined;
    }
});
```

The next step is to create the vue entrypoint. 

`index.ts`

```typescript
import {
    buildNavigation,
    install
} from '@vuecs/navigation';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { provider } from './module';

const app = createApp();

app.use(install({
    provider
}));

const router = createRouter({
    history: createWebHistory(),
    routes: [
        /* ... */     
    ],
});
app.use(router);

(async () => {
    const url = router?.currentRoute?.value?.fullPath;
    await buildNavigation({ url });

    app.mount('#app');
})();
```

--- 

After those steps are completed, the `VCNavItems` SFC can be placed anywhere, 
if registered globally.

```vue
<template>
    <div>
        <VCNavItems :tier="0" />
        
        <VCNavItems :tier="1" />
    </div>
</template>
```

## Functions

### buildNavigation


▸ `function` **buildNavigation**(`context?: NavigationBuildContext`): `Promise`<`void`>

Build all navigation tiers, by `url` or active `items`. 

#### Example
**`URL`**
```typescript
import { buildNavigation } from '@vuecs/navigation';

await buildNavigation({
    url: '/'
});
```

This will call the `getItemsActive` method of the `NavigationProvider` implementation,
to calculate the active items.

**`items`**
```typescript
import { buildNavigation } from '@vuecs/navigation';

await buildNavigation({
    items: [
        {id: 'default', tier: 0, name: 'Home'}
    ]
})
```

The `items` property will be passed as second argument to the `getItems` method of
the `NavigationProvider` implementation, to build a specific tier navigation.

**`route`**
```typescript
import { RouteLocation } from 'vue-router';
import { buildNavigationWithRoute } from '@vuecs/navigation';

const route : RouteLocation = {
    fullPath: '/',
    ...
};

await buildNavigation({
    route
})
```

## Types

### NavigationBuildContext

```typescript
import { NavigationItem } from '@vuecs/navigation';
import { RouteLocationNormalized } from 'vue-router';

declare type NavigationBuildContext = {
    items?: NavigationItem[],
    route?: RouteLocationNormalized,
    url?: string
};
```

### NavigationItem

```typescript
import { ElementType } from '@vuecs/navigation';

declare type NavigationItem = {
    id?: string | number,
    tier?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    // link or separator
    type?: `${ElementType}`,

    icon?: string,

    active?: boolean,

    display?: boolean,
    displayChildren?: boolean,

    root?: boolean,
    children?: NavigationItem[],

    requireLoggedIn?: boolean,
    requireLoggedOut?: boolean,
    requirePermissions?: string | string[] | ((checker: (name: string) => boolean) => boolean)

    [key: string]: any
};
```

### NavigationProvider

```typescript
import { NavigationItem } from '@vuecs/navigation';

declare type NavigationProvider = {
    getItems: (
        tier: number, items: NavigationItem[]
    ) => Promise<NavigationItem[] | undefined> | undefined | NavigationItem[],
    getItemsActive: (
        url: string
    ) => Promise<NavigationItem[]> | NavigationItem[]
};
```

## Example

For an implementation example, on how to use this library, check out the example
[package](https://github.com/tada5hi/vuecs/tree/master/examples/basic).

## License

Made with 💚

Published under [MIT License](./LICENSE).
