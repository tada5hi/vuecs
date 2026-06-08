// @vitest-environment jsdom
import { installConfigManager, useLocale } from '@vuecs/core';
import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import {
    createApp,
    h,
    nextTick,
    ref,
} from 'vue';
import type { ComputedRef } from 'vue';
import localePlugin from '../../src';
import { installLocale } from '../../src/install';
import { useLocaleManager } from '../../src/composable';
import type { LocaleSource, UseLocaleReturn } from '../../src/types';

function setNavigatorLanguage(value: string | undefined) {
    Object.defineProperty(window.navigator, 'language', {
        value,
        configurable: true,
    });
}

describe('installLocale — config bridge', () => {
    beforeEach(() => {
        setNavigatorLanguage('fr-FR');
        localStorage.clear();
        document.documentElement.removeAttribute('lang');
    });

    it('bridges the resolved locale into core config and propagates set()/reset()', async () => {
        let read: ComputedRef<string> | undefined;
        let manager: UseLocaleReturn | undefined;

        const app = createApp({
            setup() {
                read = useLocale();
                manager = useLocaleManager();
                return () => h('span', read!.value);
            },
        });
        app.use(localePlugin, { persist: false });
        app.mount(document.createElement('div'));

        // auto → navigator language
        expect(read!.value).toBe('fr-FR');
        expect(manager!.isAuto.value).toBe(true);

        // override propagates through Config['locale'] to useLocale()
        manager!.set('de-DE');
        await nextTick();
        expect(read!.value).toBe('de-DE');
        expect(manager!.isAuto.value).toBe(false);
        expect(document.documentElement.lang).toBe('de-DE');

        // reset hands resolution back to the browser language
        manager!.reset();
        await nextTick();
        expect(read!.value).toBe('fr-FR');
        expect(manager!.isAuto.value).toBe(true);

        app.unmount();
    });

    it('a later static config.locale wins over the plugin bridge (merge semantics)', async () => {
        let read: ComputedRef<string> | undefined;
        let manager: UseLocaleReturn | undefined;

        const app = createApp({
            setup() {
                read = useLocale();
                manager = useLocaleManager();
                return () => h('span', read!.value);
            },
        });
        app.use(localePlugin, { persist: false });
        // A later install with an explicit static locale merges over the
        // plugin's ComputedRef — last install wins.
        installConfigManager(app, { config: { locale: 'it-IT' } });
        app.mount(document.createElement('div'));

        expect(read!.value).toBe('it-IT');

        // The static string detaches config from the plugin source, so
        // set() no longer propagates. Documents the sharp edge.
        manager!.set('de-DE');
        await nextTick();
        expect(read!.value).toBe('it-IT');
    });

    it('persists the source across installs when persist is enabled', async () => {
        const app1 = createApp({ setup: () => () => h('span') });
        const h1 = installLocale(app1, { persist: true });
        h1.set('es-ES');
        await nextTick();
        expect(localStorage.getItem('vc-locale')).toBe('es-ES');

        const app2 = createApp({ setup: () => () => h('span') });
        const h2 = installLocale(app2, { persist: true });
        expect(h2.source.value).toBe('es-ES');
        expect(h2.resolved.value).toBe('es-ES');
    });

    it('uses an injected source ref (cookie-like) and ignores persist/storage', () => {
        const cookie = ref<LocaleSource>('de-DE');
        const app = createApp({ setup: () => () => h('span') });
        const handles = installLocale(app, { source: cookie });

        expect(handles.source).toBe(cookie);
        expect(handles.resolved.value).toBe('de-DE');

        cookie.value = 'auto';
        expect(handles.resolved.value).toBe('fr-FR');
        app.unmount();
    });

    it('stops its effect scope on app unmount (no further <html lang> writes)', async () => {
        const source = ref<LocaleSource>('de-DE');
        const app = createApp({ setup: () => () => h('span') });
        installLocale(app, { source });
        app.mount(document.createElement('div'));
        await nextTick();
        expect(document.documentElement.lang).toBe('de-DE');

        app.unmount();
        document.documentElement.lang = 'unchanged';
        source.value = 'es-ES';
        await nextTick();
        expect(document.documentElement.lang).toBe('unchanged');
    });

    it('useLocale() falls back to en-US without the plugin installed', () => {
        let read: ComputedRef<string> | undefined;
        const app = createApp({
            setup() {
                read = useLocale();
                return () => h('span', read!.value);
            },
        });
        app.mount(document.createElement('div'));
        expect(read!.value).toBe('en-US');
        app.unmount();
    });
});
