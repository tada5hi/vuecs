[![npm version](https://badge.fury.io/js/vue-layout-navigation.svg)](https://badge.fury.io/js/vue-layout-navigation)
[![CI](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml)

# Vue-Layout-Navigation 🏝

This repository contains:
- vue templates
  - to render navigation components
- vuex store plugin 
  - to hold the current components of each tier
- (nuxt-) middleware 
  - to init layout according meta properties instead of route.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)

## Installation
This package requires `nodejs` & `npm` to be installed on the host machine.
```
$ npm i --save-dev vue-layout-navigation
```

## Usage
The first step is to define a class which implements the Interface `NavigationProviderInterface`.
It will be responsible for providing navigation items for specific tiers on demand and will be injected
to the vuex store.

This implementation class shape should look like this:

```typescript
import {NavigationProviderInterface} from "./type";

export class NavigationProvider implements NavigationProviderInterface {
    async getComponent(
        tier: NavigationComponentTier, 
        id: string, 
        context: NavigationProviderContext
    ): Promise<NavigationComponentConfig | undefined> {
        // component for specific tier for a given context.
    }

    async getComponents(
        tier: NavigationComponentTier,
        context: NavigationProviderContext
    ): Promise<NavigationComponentConfig[]> {
        // components for specific tier for a given context.
    }

    async hasLevel(tier: NavigationComponentTier): Promise<boolean> {
        // check if the tier exists.
    }

    async getContextForUrl?(url: string): Promise<NavigationProviderContext | undefined> {
        // build component context for url
    }
}
```

---

The next step is to init the `vuex` store and inject an instance of the `NavigationProvider` to the store.
The vue entry point could look like this:

```typescript
import Vue, { VNode } from 'vue';
import Vuex from 'vuex';
import VueRouter from "vue-router";

// import the NavigationProviderInterface implementation
import {NavigationProvider} from "./module";

import VueLayoutNavigation, {
    storePlugin
} from 'vue-layout-navigation';

// register the plugin, vuex & vue-router
Vue.use(VueLayoutNavigation);
Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        // ... set paths
    ]
});

const store = new Vuex.Store({
    modules: {
        layout: storePlugin
    }
});

(store as any).$navigationProvider = new NavigationProvider();
(store as any).$router = router;

Promise.resolve()
    .then(() => store.dispatch('layout/initNavigation'));

new Vue({
    render: (h): VNode => h(Dev),
    store,
    router
}).$mount('#app');
```

--- 

After those steps are completed, the `NavigationComponents` SFC can be imported and 
render navigation components reactively for a specific tier.

```vue
<template>
    <div>
        <navigation-components :tier="0" />
        
        <navigation-components :tier="1" />
    </div>
</template>
```

## Example

For a full example check out `./dev/` directory of this project.

