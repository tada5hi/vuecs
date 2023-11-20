# @vue-layout/gravatar 📷

[![npm version](https://badge.fury.io/js/@vue-layout%2Fgravatar.svg)](https://badge.fury.io/js/@vue-layout%2Fgravatar)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

A package containing a gravatar component.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```
$ npm i --save @vue-layout/gravatar
```

## Usage

Register the plugin.

```typescript
import install from '@vue-layout/gravatar';
import { createApp } from 'vue'

const app = createApp({})

app.use(install, {
  /* optional options */
})
```

After the component is registered, it can be used as follows.

```vue
<template>
    <VCGravatar
        :email="'max.mustermann@example.com'"
        :default-img="'retro'"
        :size="80"
        :rating="'g'"
    />
</template>
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
