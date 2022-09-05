# @vue-layout/navigation 🍙

[![npm version](https://badge.fury.io/js/@vue-layout%2Fnavigation.svg)](https://badge.fury.io/js/@vue-layout%2Fnavigation)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

This repository contains provides vue components and helper/utility methods to
render a multi tier navigation, where tier-0 conditionally affects tier-1 and so on.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
  - [build](#build)
  - [buildWithRoute](#buildwithroute)
- [Types](#types)
  - [BuildContext](#buildcontext)
  - [Component](#component)
  - [ProviderInterface](#providerinterface)
  - [RouteBuildContext](#routebuildcontext)
- [Example](#example)

## Installation

```
$ npm i --save @vue-layout/navigation
```

## Usage

To use this Package, a class must be created, which implements the `ProviderInterface`.
The class is used to provide different navigation components for each `tier`.

The `tier` is a numeric value, which can reach from 0 to n (infinity).

The first step is to implement the class.

`module.ts`

```typescript
import {
    Component,
    ProviderInterface
} from "@vue-layout/navigation";

export class Provider implements ProviderInterface {
    componentsTierOne = [
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
    ];

    async getComponents(
        tier: number,
        components: Component[]
    ): Promise<Component[]> {
        // Return components for a specific tier.
        // The context provides the current active components for
        // the parent tiers.

        switch (tier) {
            case 0:
                return this.componentsTierOne;
            // ....
        }
    }

    async getComponentsActive(url: string): Promise<Component[]> {
        // build component context for url
        if (url === '/') {
            return [
                this.componentsTierOne[0]
            ]
        }

        if (url === '/about') {
            return [
                this.componentsTierOne[1]
            ]
        }

        return undefined;
    }

    async hasTier(tier: number): Promise<boolean> {
        // check if the tier exists.
        return tier === 1;
    }
}
```

The next step is to create the vue entrypoint. 

`index.ts`

```typescript
import {
    build,
    createPlugin
} from '@vue-layout/navigation';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { Provider } from './module';

const app = createApp();

const navigation = createPlugin({
    provider: new Provider(),
});
app.use(navigation);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        /* ... */     
    ],
});
app.use(router);

(async () => {
    const url = router?.currentRoute?.value?.fullPath;
    await build({ url });

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

### build


▸ `function` **build**(`context?: BuildContext`): `Promise`<`void`>

Build all navigation tiers, by `url` or active `components`. 

#### Example
**`URL`**
```typescript
import { build } from '@vue-layout/navigation';

await build({
    url: '/'
});
```

This will call the `getComponentsActive` method of the `ProviderInterface` implementation,
to calculate the active `components`.

**`components`**
```typescript
import { build } from '@vue-layout/navigation';

await build({
    components: [
        {id: 'default', tier: 0, name: 'Home'}
    ]
})
```

This `component` array will be provided as second argument as context to the `getComponents` method of
the `ProviderInterface` implementation, to build a specific tier navigation.

### buildWithRoute

▸ `function` **buildWithRoute**(`context?: Partial<RouteBuildContext>`): `Promise`<`void`>

Build all navigation tiers, by `route` (url) or by interpreting the `metaKey` attribute of 
a route component.

#### Example
**`route`**
```typescript
import { RouteLocation } from 'vue-router';
import { buildWithRoute } from '@vue-layout/navigation';

const route : RouteLocation = {
    fullPath: '/',
    ...
};

await buildWithRoute({
    route
})
```
This method call is under the hood equal to: `build({url: '/'})`.

**`metaKey`**
```typescript
import { defineComponent } from 'vue';
import { buildWithRoute } from '@vue-layout/navigation';

const metaKey = 'navigation';

const pageComponent = defineComponent({
    meta: {
        [metaKey]: [
            {id: 'default', tier: 0, name: 'Home'}
        ]
    },
    ...
});

await buildWithRoute({
    metaKey
})
```
This method call is under the hood equal to:
`build({components: [{id: 'default', tier: 0, name: 'Home'}]})`.


## Types

### BuildContext

```typescript
import { Component } from '@vue-layout/navigation';

type BuildContext = {
    components?: Component[],
    url?: string
};
```

### Component

```typescript
type Component = {
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
    components?: Component[],

    [key: string]: any
};
```

### ProviderInterface

```typescript
import { Component } from '@vue-layout/navigation';

interface ProviderInterface {
    getComponents(
        tier: number,
        components: Component[]
    ): Promise<Component[]>;

    getComponentsActive(url: string): Promise<Component[]>;

    hasTier(
        tier: number
    ): Promise<boolean>;
}
```

### RouteBuildContext

```typescript
import { RouteLocationNormalized } from 'vue-router';

type RouteBuildContext = {
    route: RouteLocationNormalized,
    metaKey: string
};
```

## Example

For a simple example, on how to use this library, check out the demo package:
[Example](https://github.com/tada5hi/vue-layout/tree/master/packages/navigation-demo)
