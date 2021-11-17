[![npm version](https://badge.fury.io/js/vue-layout-navigation.svg)](https://badge.fury.io/js/vue-layout-navigation)
[![CI](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml)

# Vue-Layout-Navigation 🏝

This repository contains:
- vue templates
  - to render navigation components
- vuex store plugin 
  - to hold the current components of each level
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
It will be responsible for providing navigation items for specific levels on demand.

This implementation class shape should look like this:

```typescript
import {NavigationProviderInterface} from "./type";

export class NavigationProvider implements NavigationProviderInterface {
    async getComponent(level: ComponentLevel, id: string, context: NavigationProviderContext): Promise<NavigationComponentConfig | undefined> {
        // component for specific level for a given context.
    }

    async getComponents(level: ComponentLevel, context: NavigationProviderContext): Promise<NavigationComponentConfig[]> {
        // components for specific level for a given context.
    }

    async hasLevel(level: ComponentLevel): Promise<boolean> {
        // check if the level exists.
    }

    async getContextForUrl?(url: string): Promise<NavigationProviderContext | undefined> {
        // build component context for url
    }
}
```

---

The next step is to init the vuex store and inject an instance of the `ProviderClass` to the store.
The vue entry point could look like this:

```typescript
import Vue, { VNode } from 'vue';
import {NavigationProvider} from "./module";
import Dev from './serve.vue';

import VueLayoutNavigation, {
    storePlugin
} from 'vue-layout-navigation';

Vue.use(VueLayoutNavigation);

Vue.config.productionTip = false;

import Vuex from 'vuex';
import VueRouter from "vue-router";

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

After those steps are completed,
the SFC can be imported and render a specific navigation component level in reactive rendering mode.

```vue
<template>
    <div>
        <navigation-components :level="0" />
        
        <navigation-components :level="1" />
    </div>
</template>
```

## Example

For a full example check out `./dev/` directory of this project.

