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

To use the navigation component, a function must be defined, 
to retrieve a set of elements for a specific level and parent element.

`module.ts`

```typescript
import {
    NavigationItem
} from "@vuecs/navigation";

const topNav: NavigationItem[] = [
    { name: 'Home', url: '/', icon: 'fa fa-home' },
    { name: 'Admin', url: '/admin/', activeMatch: '/admin/', icon: 'fas fa-cog' }
];

const sideDefaultNav : NavigationItem[] = [
    { name: 'Home', url: '/', icon: 'fa fa-home' },
    { name: 'About', url: '/info', icon: 'fa fa-info' }
];

const sideAdminNav : NavigatioNitem[] = [
    { name: 'Home', url: '/admin/', icon: 'fa fa-home' },
    { name: 'Users', url: '/admin/users', icon: 'fa fa-user' },
    
];

export function getNavigationItems(
    level: number,
    parent?: NavigationItem
) {
    if (level === 0) {
        return topNav;
    }
    
    if(parent) {
        if(level === 1) {
            if(parent.name === 'Home') {
                return sideDefaultNav;
            } 
            
            if(parent.name === 'Admin') {
                return sideAdminNav;
            }
        }
    }

    return [];
}
```

The next step is to create the vue entrypoint. 

`index.ts`

```typescript
import {
    injectNavigationManager,
    install
} from '@vuecs/navigation';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { getNavigationItems } from './module';

const app = createApp();

app.use(install({
    items: ({ level, parent }) => {
        return getNavigationItems(level, parent);
    }
}));

const router = createRouter({
    history: createWebHistory(),
    routes: [
        /* ... */
    ],
});
app.use(router);

(async () => {
    const path = router?.currentRoute?.value?.fullPath;
    
    const navigationManager = injectNavigationManager();
    await navigationManager.build({ path });

    app.mount('#app');
})();
```

--- 

After those steps are completed, the `VCNavItems` SFC can be placed anywhere, 
if registered globally.

```vue
<template>
    <div>
        <VCNavItems :level="0" />
        
        <VCNavItems :level="1" />
    </div>
</template>
```

## Types

### NavigationItem

```typescript
import { ElementType } from '@vuecs/navigation';

declare type NavigationItem = {
    level?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    // link or separator
    type?: `${ElementType}`,

    icon?: string,

    active?: boolean,
    activeMatch?: string,

    display?: boolean,
    displayChildren?: boolean,

    root?: boolean,
    children?: NavigationItem[],

    meta?: Record<string, any>
};
```

## Example

For an implementation example, on how to use this library, check out the example
[package](https://github.com/tada5hi/vuecs/tree/master/examples/nuxt).

## License

Made with 💚

Published under [MIT License](./LICENSE).
