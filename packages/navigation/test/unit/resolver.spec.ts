// @vitest-environment jsdom
/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import type { App, Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { NavigationItem, NavigationResolver } from '../../src';
import { VCNavItems } from '../../src';

function buildApp(props: Record<string, unknown>) {
    const App = defineComponent({
        setup() {
            return () => h(VCNavItems, props);
        },
    });

    return mount(App, {
        global: {
            plugins: [{
                install(app: App) {
                    installThemeManager(app, {});
                    installDefaultsManager(app, {});
                },
            }],
        },
        attachTo: document.body,
    });
}

function linkCount(root: Element): number {
    return root.querySelectorAll('[data-vc-collection-item]').length;
}

describe('VCNavItems resolver', () => {
    it('resolves a plain array resolver', async () => {
        const wrapper = buildApp({
            data: [
                { name: 'Overview', url: '/robots' },
                { name: 'Add', url: '/robots/add' },
            ] as NavigationItem[],
        });
        await nextTick();

        expect(linkCount(wrapper.element)).toBe(2);
    });

    it('resolves a synchronous function resolver', async () => {
        const resolver: NavigationResolver = () => [
            { name: 'Overview', url: '/robots' },
            { name: 'Add', url: '/robots/add' },
            { name: 'Settings', url: '/robots/settings' },
        ];

        const wrapper = buildApp({ data: resolver });
        await nextTick();

        expect(linkCount(wrapper.element)).toBe(3);
    });

    it('resolves an asynchronous function resolver', async () => {
        const resolver: NavigationResolver = async () => [
            { name: 'Overview', url: '/robots' },
        ];

        const wrapper = buildApp({ data: resolver });
        await nextTick();
        await nextTick();

        expect(linkCount(wrapper.element)).toBe(1);
    });

    it('re-runs the resolver when reactive state read before the await changes', async () => {
        const loggedIn: Ref<boolean> = ref(false);
        const resolver: NavigationResolver = () => (loggedIn.value ?
            [
                { name: 'Dashboard', url: '/dashboard' },
                { name: 'Profile', url: '/profile' },
            ] :
            [
                { name: 'Login', url: '/login' },
            ]);

        const wrapper = buildApp({ data: resolver });
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(1);

        loggedIn.value = true;
        await nextTick();
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(2);
    });

    it('re-runs the resolver via the :watch escape hatch (after-await reads)', async () => {
        const token: Ref<string | undefined> = ref(undefined);
        const resolver: NavigationResolver = async () => {
            await Promise.resolve();
            // read AFTER the await — auto-track can't see this
            return token.value ?
                [
                    { name: 'Account', url: '/account' },
                    { name: 'Billing', url: '/billing' },
                ] :
                [];
        };

        const wrapper = buildApp({ data: resolver, watch: [token] });
        await nextTick();
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(0);

        token.value = 'abc';
        await nextTick();
        await nextTick();
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(2);
    });

    it('exposes refresh() to imperatively re-run the resolver', async () => {
        let calls = 0;
        const resolver: NavigationResolver = () => {
            calls += 1;
            return [{ name: 'Overview', url: '/robots' }];
        };

        const exposed = ref<{ refresh: () => Promise<void> } | null>(null);
        const App = defineComponent({
            setup() {
                return () => h(VCNavItems, { data: resolver, ref: exposed });
            },
        });
        mount(App, {
            global: {
                plugins: [{
                    install(app: App) {
                        installThemeManager(app, {});
                        installDefaultsManager(app, {});
                    },
                }],
            },
            attachTo: document.body,
        });

        await nextTick();
        const before = calls;
        await exposed.value?.refresh();
        expect(calls).toBe(before + 1);
    });
});
