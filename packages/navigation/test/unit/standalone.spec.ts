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
import type { NavigationItem } from '../../src';
import { VCNavItems } from '../../src';

type MountOptions = {
    items: NavigationItem[];
    path?: string;
    variant?: string;
    orientation?: 'horizontal' | 'vertical';
};

function buildApp(options: MountOptions) {
    const App = defineComponent({
        setup() {
            return () => h(VCNavItems, {
                data: options.items,
                path: options.path,
                variant: options.variant,
                orientation: options.orientation,
            });
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

describe('VCNavItems standalone (manager-less)', () => {
    it('renders raw items without a navigation manager', async () => {
        const wrapper = buildApp({
            items: [
                { name: 'Overview', url: '/robots' },
                { name: 'Add', url: '/robots/add' },
            ],
        });
        await nextTick();

        const links = wrapper.element.querySelectorAll('[data-vc-collection-item]');
        expect(links.length).toBe(2);
    });

    it('marks only the single best-match item active for the current path', async () => {
        const wrapper = buildApp({
            items: [
                { name: 'Overview', url: '/robots' },
                { name: 'Add', url: '/robots/add' },
            ],
            path: '/robots/add',
        });
        await nextTick();

        const active = wrapper.element.querySelectorAll('.vc-nav-link.active');
        expect(active.length).toBe(1);
        expect((active[0] as HTMLElement).textContent).toContain('Add');
    });

    it('applies the pills + vertical variant classes', async () => {
        const wrapper = buildApp({
            items: [
                { name: 'Overview', url: '/robots' },
                { name: 'Add', url: '/robots/add' },
            ],
            variant: 'pills',
            orientation: 'vertical',
        });
        await nextTick();

        const group = wrapper.element as HTMLElement;
        expect(group.tagName).toBe('UL');
        expect(group.classList.contains('vc-nav-items--pills')).toBe(true);
        expect(group.classList.contains('vc-nav-items--vertical')).toBe(true);
        expect(wrapper.element.querySelector('.vc-nav-link--pills')).not.toBeNull();
    });
});
