# Vue-Layout-Navigation 🏝
This repository contains all packages for the Central-UI of the Personal Health Train (PHT).

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

