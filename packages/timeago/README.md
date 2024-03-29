# @vuecs/timeago ⏰

[![npm version](https://badge.fury.io/js/@vuecs%2Ftimeago.svg)](https://badge.fury.io/js/@vuecs%2Ftimeago)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

A package containing a timeago component.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [Locales](#locales)
- [License](#license)

## Installation

```
$ npm i --save @vuecs/timeago
```

## Usage

Register the plugin.

```typescript
import install from '@vuecs/timeago';
import { createApp } from 'vue'

const app = createApp({})

app.use(install, {
    /* set the default locale */
    locale: 'en',
});
```

After the component is registered, it can be used as follows.

```vue
<template>
    <VCTimeago
        :date-time="1684746631769"
        :locale="'en'"
        :auto-update="true"
    />
</template>
```

### Locales

To support other locales, the corresponding locale 
object must be imported from the [date-fns](https://www.npmjs.com/package/date-fns) library.
In the following, this will be shown for the german language.

```typescript
import install from '@vuecs/timeago';
import { createApp } from 'vue'

import de from 'date-fns/locale/de';

const app = createApp({})

app.use(install, {
    locale: 'de',
    locales: {
        de,
    },
});
```
## License

Made with 💚

Published under [MIT License](./LICENSE).
