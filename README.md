[![npm version](https://badge.fury.io/js/vue-layout-navigation.svg)](https://badge.fury.io/js/vue-layout-navigation)
[![CI](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout-navigation/actions/workflows/main.yml)

# Vue-Layout-Navigation 🏝
This repository contains all packages for the Central-UI of the Personal Health Train (PHT).


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
Import the package :)

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

