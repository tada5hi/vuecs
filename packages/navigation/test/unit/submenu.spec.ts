// @vitest-environment jsdom
import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
} from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsNav, { VCNavItems } from '../../src';
import type { NavigationItem } from '../../src';

type MountOptions = {
    items: NavigationItem[];
    path?: string;
    orientation?: 'horizontal' | 'vertical';
    submenu?: 'auto' | 'collapse' | 'dropdown';
};

function buildApp(options: MountOptions) {
    const App = defineComponent({
        setup() {
            return () => h(VCNavItems, {
                resolver: options.items,
                path: options.path,
                orientation: options.orientation,
                submenu: options.submenu,
            });
        },
    });

    return mount(App, {
        // The full plugin registers VCNavItems/VCNavItem globally so the
        // nested group children resolve via resolveComponent('VCNavItems').
        global: { plugins: [[vuecsNav, {}]] },
        attachTo: document.body,
    });
}

// A leaf precedes the group so the `findBestItemMatches` first-item
// fallback (returns index 0 at score 0 when nothing matches) lands on the
// leaf, leaving the group closed when no path is supplied.
const items: NavigationItem[] = [
    { name: 'Home', url: '/home' },
    {
        name: 'Resources',
        url: '/resources',
        children: [
            { name: 'Robots', url: '/resources/robots' },
            { name: 'Users', url: '/resources/users' },
        ],
    },
];

describe('VCNavItems submenu presentation', () => {
    beforeAll(() => {
        // Reka primitives probe these in jsdom where they're absent.
        Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || (() => false);
        Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || (() => undefined);
        Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => undefined);
    });

    afterEach(() => { document.body.innerHTML = ''; });

    it('defaults to collapse — renders a <ul> with a Collapsible trigger', async () => {
        const wrapper = buildApp({ items });
        await nextTick();

        expect((wrapper.element as HTMLElement).tagName).toBe('UL');

        const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(trigger).not.toBeNull();
        // Reka CollapsibleTrigger renders a native <button> exposing
        // aria-expanded + data-state.
        expect(trigger.tagName).toBe('BUTTON');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('collapse: clicking the trigger toggles aria-expanded and reveals children', async () => {
        const wrapper = buildApp({ items });
        await nextTick();

        const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        // Closed: Reka unmounts the content, so only the Home leaf renders.
        expect(wrapper.element.querySelectorAll('[data-vc-collection-item]').length).toBe(2);

        trigger.click();
        await nextTick();
        await nextTick();
        await nextTick();

        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        // Open: the nested <VCNavItems> mounts its two leaf links.
        expect(wrapper.element.querySelectorAll('[data-vc-collection-item]').length).toBe(4);
    });

    it('collapse: an active descendant auto-opens its parent branch', async () => {
        const wrapper = buildApp({ items, path: '/resources/users' });
        await nextTick();

        const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(trigger.getAttribute('aria-expanded')).toBe('true');

        const active = wrapper.element.querySelector('.vc-nav-link.active') as HTMLElement;
        expect(active).not.toBeNull();
        expect(active.textContent).toContain('Users');
    });

    it('dropdown: orientation="horizontal" mounts a NavigationMenu (auto)', async () => {
        const wrapper = buildApp({ items, orientation: 'horizontal' });
        await nextTick();

        // NavigationMenuRoot renders a <nav>, not the collapse-mode <ul>.
        expect((wrapper.element as HTMLElement).tagName).toBe('NAV');
        const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(trigger).not.toBeNull();
        expect(trigger.tagName).toBe('BUTTON');
    });

    it('explicit submenu="dropdown" wins over a vertical orientation', async () => {
        const wrapper = buildApp({
            items,
            orientation: 'vertical',
            submenu: 'dropdown',
        });
        await nextTick();

        expect((wrapper.element as HTMLElement).tagName).toBe('NAV');
    });

    it('explicit submenu="collapse" wins over a horizontal orientation', async () => {
        const wrapper = buildApp({
            items,
            orientation: 'horizontal',
            submenu: 'collapse',
        });
        await nextTick();

        expect((wrapper.element as HTMLElement).tagName).toBe('UL');
    });
});
