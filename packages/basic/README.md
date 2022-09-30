# @vue-layout/basic 🍙

[![npm version](https://badge.fury.io/js/@vue-layout%2Fbasic.svg)](https://badge.fury.io/js/@vue-layout%2Fbasic)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

A package containing basic components, 
to build for example multi level navigation menus.

> **Note**
> The package is still in development and the API is still subject to change.
> Besides, the documentation still needs to be expanded

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
    - [buildNavigation](#buildnavigation)
    - [buildNavigationWithRoute](#buildnavigationwithroute)
- [Types](#types)
    - [NavigationBuildContext](#navigationbuildcontext)
    - [NavigationBuildRouteContext](#navigationbuildroutecontext)
    - [NavigationElement](#navigationelement)
    - [NavigationProvider](#navigationprovider)
- [Example](#example)
- [License](#license)

## Installation

```
$ npm i --save @vue-layout/basic
```

## Usage

To use the navigation component, a constant must be defined, 
which satisfy the type: `NavigationProvider`.

The implementation will provide different navigation elements for each `tier`.
The `tier` is a numeric value, which can reach from 0 to n (infinity).

`module.ts`

```typescript
import {
    NavigationElement,
    NavigationProvider
} from "@vue-layout/basic";

const primaryItems : NavigationElement[] = [
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

export const navigationProvider : NavigationProvider = {
    async hasTier(tier: number): Promise<boolean> {
        // check if the tier exists.
        return Promise.resolve(tier === 1);
    },
    async getElements(tier: number, items: NavigationElement[]): Promise<NavigationElement[]> {
        // Return elements for a specific tier.
        // The context provides the current active elements for
        // the parent tiers.

        switch (tier) {
            case 0:
                return primaryItems;
            // ....
        }
    },
    async getElementsActive(url: string): Promise<NavigationElement[]> {
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
};
```

The next step is to create the vue entrypoint. 

`index.ts`

```typescript
import {
    buildNavigation,
    createPlugin
} from '@vue-layout/basic';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { navigationProvider } from './module';

const app = createApp();

app.use(createPlugin({
    navigationProvider
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

After those steps are completed, the `NavigationComponents` SFC can be placed anywhere, if registered globally.

```vue
<template>
    <div>
        <navigation-components :tier="0" />
        
        <navigation-components :tier="1" />
    </div>
</template>
```

## Functions

### buildNavigation


▸ `function` **buildNavigation**(`context?: NavigationBuildContext`): `Promise`<`void`>

Build all navigation tiers, by `url` or active `elements`. 

#### Example
**`URL`**
```typescript
import { buildNavigation } from '@vue-layout/basic';

await buildNavigation({
    url: '/'
});
```

This will call the `getElementsActive` method of the `NavigationProvider` implementation,
to calculate the active `elements`.

**`items`**
```typescript
import { buildNavigation } from '@vue-layout/basic';

await buildNavigation({
    items: [
        {id: 'default', tier: 0, name: 'Home'}
    ]
})
```

This `element` array will be provided as second argument as context to the `getElements` method of
the `NavigationProvider` implementation, to build a specific tier navigation.

### buildNavigationWithRoute

▸ `function` **buildNavigationWithRoute**(`context?: Partial<NavigationBuildRouteContext>`): `Promise`<`void`>

Build all navigation tiers, by `route` (url) or by interpreting the `metaKey` attribute of 
a route component.

#### Example
**`route`**
```typescript
import { RouteLocation } from 'vue-router';
import { buildNavigationWithRoute } from '@vue-layout/basic';

const route : RouteLocation = {
    fullPath: '/',
    ...
};

await buildNavigationWithRoute({
    route
})
```
This method call is under the hood equal to: `buildNavigation({url: '/'})`.

**`metaKey`**
```typescript
import { defineComponent } from 'vue';
import { buildNavigationWithRoute } from '@vue-layout/basic';

const metaKey = 'navigation';

const pageComponent = defineComponent({
    meta: {
        [metaKey]: [
            {id: 'default', tier: 0, name: 'Home'}
        ]
    },
    ...
});

await buildNavigationWithRoute({
    metaKey
})
```
This method call is under the hood equal to:
`buildNavigation({items: [{id: 'default', tier: 0, name: 'Home'}]})`.


## Types

### NavigationBuildContext

```typescript
import { Component } from '@vue-layout/basic';

type NavigationBuildContext = {
    items?: Component[],
    url?: string
};
```

### NavigationBuildRouteContext

```typescript
import { RouteLocationNormalized } from 'vue-router';

type NavigationBuildRouteContext = {
    route: RouteLocationNormalized,
    metaKey: string
};
```

### NavigationElement

```typescript
type NavigationElement = {
    id?: string | number,
    tier?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    type?: 'separator' | 'link',

    icon?: string,
    environment?: 'development' | 'production' | 'testing',

    display?: boolean,
    displayChildren?: boolean,

    rootLink?: boolean,
    children?: NavigationElement[],

    requireLoggedIn?: boolean,
    requireLoggedOut?: boolean,
    requirePermissions?: string | string[] | ((checker: (name: string) => boolean) => boolean)


    [key: string]: any
};
```

### NavigationProvider

```typescript
import { NavigationElement } from '@vue-layout/basic';

declare type NavigationProvider = {
    getElements: (tier: number, items: NavigationElement[]) => Promise<NavigationElement[]>,
    getElementsActive: (url: string) => Promise<NavigationElement[]>,
    hasTier: (tier: number) => Promise<boolean>
};
```

## Example

For an implementation example, on how to use this library, check out the example
[package](https://github.com/tada5hi/vue-layout/tree/master/examples/basic).

## License

Made with 💚

Published under [MIT License](./LICENSE).
