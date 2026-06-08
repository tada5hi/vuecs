// @vitest-environment jsdom
import { nextTick, ref } from 'vue';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import { bindLocale } from '../../src/bind';
import type { LocaleSource } from '../../src/types';

function setNavigatorLanguage(value: string | undefined) {
    Object.defineProperty(window.navigator, 'language', {
        value,
        configurable: true,
    });
}

describe('bindLocale', () => {
    beforeEach(() => {
        setNavigatorLanguage('fr-FR');
        document.documentElement.removeAttribute('lang');
    });

    afterEach(() => {
        document.documentElement.removeAttribute('lang');
    });

    it('resolves an explicit override directly', () => {
        const source = ref<LocaleSource>('de-DE');
        const { resolved, isAuto } = bindLocale(source, { syncLang: false });

        expect(resolved.value).toBe('de-DE');
        expect(isAuto.value).toBe(false);
    });

    it('defers to the navigator language when the source is "auto"', () => {
        const source = ref<LocaleSource>('auto');
        const { resolved, isAuto } = bindLocale(source, { syncLang: false });

        expect(resolved.value).toBe('fr-FR');
        expect(isAuto.value).toBe(true);
    });

    it('falls back when the source is "auto" and no navigator language exists', () => {
        setNavigatorLanguage(undefined);
        const source = ref<LocaleSource>('auto');
        const { resolved } = bindLocale(source, { fallback: 'en-GB', syncLang: false });

        expect(resolved.value).toBe('en-GB');
    });

    it('uses en-US as the default fallback', () => {
        setNavigatorLanguage(undefined);
        const source = ref<LocaleSource>('auto');
        const { resolved } = bindLocale(source, { syncLang: false });

        expect(resolved.value).toBe('en-US');
    });

    it('set() applies an override and reset() returns to the default', () => {
        const source = ref<LocaleSource>('auto');
        const {
            resolved, 
            isAuto, 
            set, 
            reset, 
        } = bindLocale(source, { syncLang: false });

        expect(resolved.value).toBe('fr-FR');

        set('de-DE');
        expect(source.value).toBe('de-DE');
        expect(resolved.value).toBe('de-DE');
        expect(isAuto.value).toBe(false);

        reset();
        expect(source.value).toBe('auto');
        expect(resolved.value).toBe('fr-FR');
        expect(isAuto.value).toBe(true);
    });

    it('reset() returns to a custom initial source', () => {
        const source = ref<LocaleSource>('it-IT');
        const { resolved, reset } = bindLocale(source, { initial: 'es-ES', syncLang: false });

        expect(resolved.value).toBe('it-IT');

        reset();
        expect(source.value).toBe('es-ES');
        expect(resolved.value).toBe('es-ES');
    });

    it('resolves "auto" from an injected navigatorLanguage ref (SSR path)', () => {
        // No browser navigator — the injected ref is the only source.
        setNavigatorLanguage(undefined);
        const source = ref<LocaleSource>('auto');
        const nav = ref<string | undefined>('de-DE');
        const { resolved } = bindLocale(source, { navigatorLanguage: nav, syncLang: false });

        expect(resolved.value).toBe('de-DE');

        // The injected ref stays reactive (client navigator changes, or a
        // late SSR header read).
        nav.value = 'es-ES';
        expect(resolved.value).toBe('es-ES');

        // Falls back when the injected ref is empty.
        nav.value = undefined;
        expect(resolved.value).toBe('en-US');
    });

    it('mirrors the resolved locale onto <html lang> when syncLang is enabled', async () => {
        const source = ref<LocaleSource>('de-DE');
        const { set } = bindLocale(source);

        await nextTick();
        expect(document.documentElement.lang).toBe('de-DE');

        set('pt-BR');
        await nextTick();
        expect(document.documentElement.lang).toBe('pt-BR');
    });
});
