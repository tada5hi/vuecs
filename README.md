[![npm version](https://badge.fury.io/js/vue-layout-navigation.svg)](https://badge.fury.io/js/vue-layout-navigation)
[![CI](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml)

# Vue-Layout-Navigation 🏝

This repository contains:
- vue templates to render the components
- vuex store plugin to hold the current level components
- (nuxt-) middleware to init layout according a specific route

---
**NOTE**

This package is still in heavy development and should therefore not be used for production 😇

---

## Installation
This package requires `nodejs` & `npm` to be installed on the host machine.
```
$ npm i --save-dev vue-layout-navigation
```

## Usage
The first step is to define a class which implements the Interface `LayoutProviderInterface`.
It will be responsible for providing navigation items for specific levels on demand.

This implementation class shape should look like this:
```typescript
export class LayoutProvider implements LayoutProviderInterface {
    async getComponent(level: ComponentLevel, id: string, context: LayoutProviderContext): Promise<Component | undefined> {
        // component for specific level for a given context.
    }

    async getComponents(level: ComponentLevel, context: LayoutProviderContext): Promise<Component[]> {
        // components for specific level for a given context.
    }

    async hasLevel(level: ComponentLevel): Promise<boolean> {
        // check if the level exists.
    }

    async getContextForUrl?(url: string): Promise<LayoutProviderContext | undefined> {
        // build component context for url
    }
}
```
For a full example check out `./serve/module.ts` file in the root directory of this project.

---

The next step is to inject an instance of the class to the vuex store.
The vue entry point could like shown in the following:

```typescript
import Vue, { VNode } from 'vue';
import {LayoutProvider} from "./module";
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

(store as any).$layoutProvider = new LayoutProvider();
(store as any).$router = router;

Promise.resolve()
    .then(() => store.dispatch('layout/init'));

new Vue({
    render: (h): VNode => h(Dev),
    store,
    router
}).$mount('#app');
```

```vue

<script>
import {LayoutComponents} from "./vue-layout-navigation";

export default {
    components: {
        LayoutComponents
    }
}
</script>
<template>
    <div>
        <!-- type: 'main' | 'side' -->
        <layout-components :type="'main'" />
    </div>
</template>
```

## Configuration
Read the `Readme.md` in each package directory.

