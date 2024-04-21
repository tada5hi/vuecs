import type { App, Ref } from 'vue';
import { isRef, ref } from 'vue';
import {
    inject, provide,
} from './utils';

const LocaleSymbol = Symbol.for('TLocale');

export function provideLocale(
    locale: string | Ref<string>,
    app?: App,
) {
    const value = isRef(locale) ? locale : ref(locale);

    provide(LocaleSymbol, value, app);
}

export function injectLocale() : Ref<string> {
    const locale = inject<Ref<string>>(LocaleSymbol, undefined);
    if (!locale) {
        throw new Error('A timeago locale is not present in the vue context.');
    }

    return locale;
}
