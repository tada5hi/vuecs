# @vuecs/locale

[![npm version](https://badge.fury.io/js/@vuecs%2Flocale.svg)](https://badge.fury.io/js/@vuecs%2Flocale)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Browser-language-aware, resettable locale source for vuecs. Detects the
navigator language (via `@vueuse/core`'s `useNavigatorLanguage`), lets you
apply an explicit override (e.g. a backend-saved user preference) and
`reset()` back to the default — and bridges the resolved value into
`@vuecs/core`'s cross-cutting config so `useLocale()` and every
locale-aware component (e.g. `@vuecs/timeago`) read it.

Full documentation: **[vuecs.dev/components/locale](https://vuecs.dev/components/locale)**

```bash
npm install @vuecs/locale
```

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import locale from '@vuecs/locale';

const app = createApp(App);
app.use(vuecs);
app.use(locale, { initial: 'auto', fallback: 'en-US' });
```

```ts
// after login — apply the backend-saved preference
import { useLocaleManager } from '@vuecs/locale';
const { set, reset, resolved, isAuto } = useLocaleManager();
set(user.preferences.locale); // e.g. 'de-DE'
reset();                      // back to 'auto' → browser language
```

```ts
// read-only consumption (works without this plugin)
import { useLocale } from '@vuecs/core';
const locale = useLocale(); // ComputedRef<string>
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
