import { installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import './vue';

import { VCTimeago } from './component';
import { provideConverter } from './converter';
import { provideLocale } from './locale';
import { provideLocales } from './locales';
import type { Options } from './type';

export * from './component';
export * from './locale';
export * from './type';

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);

    if (options.converter) {
        provideConverter(options.converter, app);
    }

    if (options.locales) {
        provideLocales(options.locales, app);
    }

    const locale = options.locale || 'en';
    provideLocale(locale, app);

    app.component('VCTimeago', VCTimeago);
}

export default { install } satisfies Plugin<[Options?]>;
