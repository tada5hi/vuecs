// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
} from 'vue';
import type { App } from 'vue';
import { mount } from '@vue/test-utils';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { NavigationItem, NavigationResolverContext } from '../../src';
import { NavigationRegistry, VCNavItems, provideNavigationRegistry } from '../../src';

function withManagers(extra?: (app: App) => void) {
    return {
        install(app: App) {
            installThemeManager(app, {});
            installDefaultsManager(app, {});
            extra?.(app);
        },
    };
}

describe('VCNavItems click-driven selection', () => {
    it('marks a clicked url-less item active and clears the path match', async () => {
        const App = defineComponent({
            setup() {
                return () => h(VCNavItems, {
                    data: [
                        { name: 'Home', url: '/' },
                        { name: 'Admin', activeMatch: '/admin/' },
                    ] as NavigationItem[],
                    path: '/',
                });
            },
        });

        const wrapper = mount(App, {
            global: { plugins: [withManagers()] },
            attachTo: document.body,
        });
        await nextTick();

        // path '/' → Home is the best match initially.
        let active = wrapper.element.querySelectorAll('.vc-nav-link.active');
        expect(active.length).toBe(1);
        expect((active[0] as HTMLElement).textContent).toContain('Home');

        // Click the url-less Admin tab — no navigation, just selection.
        const links = wrapper.findAll('[data-vc-collection-item]');
        await links[1].trigger('click');
        await nextTick();

        active = wrapper.element.querySelectorAll('.vc-nav-link.active');
        expect(active.length).toBe(1);
        expect((active[0] as HTMLElement).textContent).toContain('Admin');

        wrapper.unmount();
    });

    it('republishes the selection through the registry to a dependent nav', async () => {
        const App = defineComponent({
            setup() {
                return () => h('div', [
                    h(VCNavItems, {
                        data: [
                            { name: 'Home', url: '/' },
                            { name: 'Admin', activeMatch: '/admin/' },
                        ] as NavigationItem[],
                        path: '/',
                        registry: true,
                        registryId: 'top',
                    }),
                    h(VCNavItems, {
                        data: ({ registry }: NavigationResolverContext) => (
                            registry('top').activeTrail.value[0]?.name === 'Admin' ?
                                [{ name: 'Realms', url: '/admin/realms' }] :
                                [{ name: 'Button', url: '/button' }]
                        ),
                    }),
                ]);
            },
        });

        const wrapper = mount(App, {
            global: {
                plugins: [withManagers((app) => {
                    provideNavigationRegistry(new NavigationRegistry(), app);
                })],
            },
            attachTo: document.body,
        });
        await nextTick();

        // Before selection the dependent nav shows its default list.
        expect(wrapper.element.textContent).toContain('Button');
        expect(wrapper.element.textContent).not.toContain('Realms');

        // Click the url-less Admin tab in the top nav.
        const topLinks = wrapper.findAll('[data-vc-collection-item]');
        const admin = topLinks.find((w) => w.text().includes('Admin'));
        await admin!.trigger('click');
        await nextTick();
        await nextTick();

        // Selection flowed through registry('top').activeTrail → dependent swap.
        expect(wrapper.element.textContent).toContain('Realms');
        expect(wrapper.element.textContent).not.toContain('Button');

        wrapper.unmount();
    });
});
