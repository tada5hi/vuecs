# @vue-layout/countdown ⏰

[![npm version](https://badge.fury.io/js/@vue-layout%2Fbasic.svg)](https://badge.fury.io/js/@vue-layout%2Fbasic)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

This package provides a customizable countdown timer for Vue3 web applications.
It offers a range of options for customization, including start and end times, step length, and more.
Ideal for time-based events such as auctions, sales, or promotions.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```
$ npm i --save @vue-layout/countdown
```

## Usage

Register the plugin.

```typescript
import install from '@vue-layout/countdown';
import { createApp } from 'vue'

const app = createApp({})

app.use(install, {
  /* optional options */
})
```

After the component is registered, it can be used as follows.

```vue
<template>
    <VCCountdown
        :auto-start="true"
        :emit-events="true"
        :interval="1000"
        :time="3600 * 1000"
    >
        <template #default="props">
            The countdown is still running for
            <span>
                {{ props.hours }} hour(s),
                {{ props.minutes }} minute(s),
                {{ props.seconds }} second(s)
            </span>.
        </template>
    </VCCountdown>
</template>
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
