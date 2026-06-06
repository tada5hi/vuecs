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
import type { NavigationItem, NavigationResolverContext } from '../../src';
import {
    NavigationRegistry,
    VCNavItems,
    provideNavigationRegistry,
} from '../../src';

function mountTree(rootSetup: () => unknown) {
    const App = defineComponent({ setup: () => rootSetup });

    return mount(App, {
        global: {
            plugins: [{
                install(app: App) {
                    provideNavigationRegistry(new NavigationRegistry(), app);
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

describe('cross-nav registry', () => {
    it('a consumer nav reads a producer nav\'s published items via registry(id)', async () => {
        const wrapper = mountTree(() => h('div', [
            // producer — publishes its resolved output under "primary"
            h(VCNavItems, {
                registry: true,
                registryId: 'primary',
                resolver: [
                    { name: 'Resources', url: '/resources' },
                    { name: 'Settings', url: '/settings' },
                ] as NavigationItem[],
            }),
            // consumer — derives its items from the producer's published output
            h(VCNavItems, {
                resolver: (ctx: NavigationResolverContext) => ctx.registry('primary')
                    .items.value
                    .map((i) => ({ name: `sub:${i.name}`, url: `${i.url}/sub` })),
            }),
        ]));

        await nextTick();
        await nextTick();

        // 2 producer links + 2 consumer links
        expect(linkCount(wrapper.element)).toBe(4);
    });

    it('consumer re-resolves when the producer\'s resolver output changes', async () => {
        const loggedIn: Ref<boolean> = ref(false);

        const wrapper = mountTree(() => h('div', [
            h(VCNavItems, {
                registry: true,
                registryId: 'primary',
                resolver: () => (loggedIn.value ?
                    [
                        { name: 'A', url: '/a' },
                        { name: 'B', url: '/b' },
                    ] :
                    [{ name: 'A', url: '/a' }]),
            }),
            h(VCNavItems, {
                resolver: (ctx: NavigationResolverContext) => ctx.registry('primary')
                    .items.value
                    .map((i) => ({ name: `sub:${i.name}`, url: `${i.url}/sub` })),
            }),
        ]));

        await nextTick();
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(2); // 1 producer + 1 consumer

        loggedIn.value = true;
        await nextTick();
        await nextTick();
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(4); // 2 producer + 2 consumer
    });

    it('consumer falls back to an empty entry when the producer unmounts', async () => {
        const show: Ref<boolean> = ref(true);

        const wrapper = mountTree(() => h('div', [
            show.value ?
                h(VCNavItems, {
                    registry: true,
                    registryId: 'primary',
                    resolver: [{ name: 'A', url: '/a' }] as NavigationItem[],
                }) :
                null,
            h(VCNavItems, {
                resolver: (ctx: NavigationResolverContext) => ctx.registry('primary')
                    .items.value
                    .map((i) => ({ name: `sub:${i.name}`, url: `${i.url}/sub` })),
            }),
        ]));

        await nextTick();
        await nextTick();
        expect(linkCount(wrapper.element)).toBe(2);

        show.value = false;
        await nextTick();
        await nextTick();
        await nextTick();
        // producer gone; consumer reads empty entry → 0 links
        expect(linkCount(wrapper.element)).toBe(0);
    });
});
