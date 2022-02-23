# @vue-layout/navigation 🏝

[![npm version](https://badge.fury.io/js/@vue-layout%2Fnavigation.svg)](https://badge.fury.io/js/@vue-layout%2Fnavigation)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

This repository contains provides vue components and helper/utility methods to
render a multi tier navigation, where tier-0 conditionally affects tier-1 and so on.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [Nuxt](#nuxt)
- [Example](#example)

## Installation

```
$ npm i --save-dev @vue-layout/navigation
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
        context: Component[]
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
import Vue, { VNode } from 'vue';
import VueRouter from "vue-router";

import VueLayoutNavigation, { 
    build,
    setProvider
} from '@vue-layout/navigation';

// import the ProviderInterface implementation
import { Provider } from "./module";

// Create an instance and register it!
const provider = new Provider();
setProvider(provider);

// register the plugin & vue-router
Vue.use(VueLayoutNavigation);
Vue.use(VueRouter);

(async () => {
    const instance = new Vue({
        render: (h): VNode => h(Dev),
        router: new VueRouter({...})
    });

    // sadly there exists no typing for the history property... :/
    const url = (instance.$router as any)?.history?.current?.fullPath;
    await build({ url });

    instance.$mount('#app');
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

## Example

For a simple example, on how to use this library, check out the demo package:
[Example](https://github.com/tada5hi/vue-layout/tree/master/packages/navigation-demo)
