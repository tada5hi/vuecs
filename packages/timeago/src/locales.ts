import type { App } from 'vue';
import type { Locales } from './type';
import {
    inject, provide,
} from './utils';

const LocalesSymbol = Symbol.for('TLocales');

export function provideLocales(
    locales: Locales,
    app?: App,
) {
    provide(LocalesSymbol, locales, app);
}

export function injectLocales() : Locales | undefined {
    return inject<Locales>(LocalesSymbol, undefined);
}
