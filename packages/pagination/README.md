# @vue-layout/pagination 📖

[![npm version](https://badge.fury.io/js/@vue-layout%2Fpagination.svg)](https://badge.fury.io/js/@vue-layout%2Fpagination)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

This library provides an easy way to paginate large datasets by providing a range
of customization options, including the number of items per page,
the number of visible page links,
and the layout of the pagination controls. .

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```
$ npm i --save @vue-layout/pagination
```

## Usage

Register the plugin.

```typescript
import install from '@vue-layout/pagination';
import { createApp } from 'vue'

const app = createApp({})

app.use(install, {
  /* optional options */
})
```

After the component is registered, it can be used as follows.

```vue
<script setup>
const busy = ref(false);

const load = async ({page, limit, offset}) => {
    busy.value = true;
    
    // run load operation
    
    busy.value = false
}
</script>
<template>
    <VCPagination
        :busy="busy"
        :total="100"
        :limit="10"
        :offset="0"
        @load="load"
    />
</template>
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
