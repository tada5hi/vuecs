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
import {
    NavigationManager,
    VCNavItems,
    provideNavigationManager,
} from '../../src';

async function buildApp() {
    const manager = new NavigationManager({
        items: [
            { name: 'Home', url: '#home' },
            { name: 'Foo', url: '#foo' },
            { name: 'Bar', url: '#bar' },
        ],
    });
    await manager.build({ path: '#home' });

    const App = defineComponent({
        setup() {
            return () => h(VCNavItems);
        },
    });

    return mount(App, {
        global: {
            plugins: [{
                install(app: App) {
                    installThemeManager(app, {});
                    installDefaultsManager(app, {});
                    provideNavigationManager(manager, app);
                },
            }],
        },
        attachTo: document.body,
    });
}

function getLinks(root: Element): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>('[data-vc-collection-item]'));
}

describe('VCNavItems keyboard navigation', () => {
    it('marks every rendered link with data-vc-collection-item', async () => {
        const wrapper = await buildApp();
        await nextTick();
        await nextTick();

        expect(getLinks(wrapper.element).length).toBe(3);
    });

    it('moves focus to the next item on ArrowDown', async () => {
        const wrapper = await buildApp();
        await nextTick();
        await nextTick();

        const links = getLinks(wrapper.element);
        expect(links.length).toBe(3);

        links[0].focus();
        expect(document.activeElement).toBe(links[0]);

        links[0].dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', 
            bubbles: true, 
            cancelable: true, 
        }));
        expect(document.activeElement).toBe(links[1]);
    });

    it('Home / End jump to the first / last item', async () => {
        const wrapper = await buildApp();
        await nextTick();
        await nextTick();

        const links = getLinks(wrapper.element);

        links[1].focus();
        links[1].dispatchEvent(new KeyboardEvent('keydown', {
            key: 'End', 
            bubbles: true, 
            cancelable: true, 
        }));
        expect(document.activeElement).toBe(links[2]);

        links[2].dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Home', 
            bubbles: true, 
            cancelable: true, 
        }));
        expect(document.activeElement).toBe(links[0]);
    });

    it('loops from the last item back to the first on ArrowDown', async () => {
        const wrapper = await buildApp();
        await nextTick();
        await nextTick();

        const links = getLinks(wrapper.element);

        links[2].focus();
        links[2].dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', 
            bubbles: true, 
            cancelable: true, 
        }));
        expect(document.activeElement).toBe(links[0]);
    });
});
