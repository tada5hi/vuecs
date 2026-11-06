# Vue Plugin Pattern

All component packages follow the standard Vue 3 plugin pattern. Each exports an `install` function and a default plugin object:

```typescript
// Typical package entry (src/index.ts)
import { installDefaultsManager, installThemeManager } from '@vuecs/core';

export * from './components';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);
    // Register components globally
}

export default { install } satisfies Plugin<[Options?]>;
```

Consumers can use either `app.use(plugin)` for global registration or import components individually.
