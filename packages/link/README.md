# @vuecs/link 🔗

[![npm version](https://badge.fury.io/js/@vuecs%2Fgravatar.svg)](https://badge.fury.io/js/@vuecs%2Fgravatar)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

A package containing a link component.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```
$ npm i --save @vuecs/link
```

## Usage

Register the plugin.

```typescript
import install from '@vuecs/link';
import { createApp } from 'vue'

const app = createApp({})

app.use(install, {
  /* optional options */
})
```

After the component is registered, it can be used as follows.

```vue
<template>
    <VCLink
        :to="'/route'"
    />
</template>
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
