import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import './vue';

import { VCTimeago } from './component';
import { provideConverter } from './converter';
import { provideLocales } from './locales';
import type { Options } from './type';

export * from './component';
export * from './type';

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);
    installConfigManager(app, options);

    if (options.converter) {
        provideConverter(options.converter, app);
    }

    if (options.locales) {
        provideLocales(options.locales, app);
    }

    // Bridge the legacy `locale` install option into core's cross-cutting
    // config so the component reads it via `useLocale()`. Omitted by
    // default — the locale resolves through core's `Config['locale']`
    // (default `en-US`), driveable globally by `app.use(vuecs, { config })`
    // or the `@vuecs/locale` plugin.
    if (options.locale) {
        installConfigManager(app, { config: { locale: options.locale } });
    }

    app.component('VCTimeago', VCTimeago);
}

export default { install } satisfies Plugin<[Options?]>;
