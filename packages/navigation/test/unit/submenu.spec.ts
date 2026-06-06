// @vitest-environment jsdom
import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    vi,
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
                data: options.items,
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

// Two sibling groups for the "hover A, then B, then A again" reopen guard.
const twoGroups: NavigationItem[] = [
    {
        name: 'GroupA',
        children: [
            { name: 'A1', url: '/a/1' },
            { name: 'A2', url: '/a/2' },
        ],
    },
    {
        name: 'GroupB',
        children: [
            { name: 'B1', url: '/b/1' },
            { name: 'B2', url: '/b/2' },
        ],
    },
];

function pointer(el: Element, type: string) {
    el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'mouse' } as PointerEventInit));
}

// The currently-open flyout's child link labels (a closed flyout unmounts
// its content under Reka's unmountOnHide, so only the open one has links).
function openFlyoutLinks(root: Element): string[] {
    const contents = Array.from(root.querySelectorAll('.vc-nav-content'));
    const open = contents.find((c) => c.querySelector('.vc-nav-link'));
    return open ?
        Array.from(open.querySelectorAll('.vc-nav-link')).map((l) => (l.textContent || '').trim()) :
        [];
}

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

    it('dropdown: a group flyout renders plain content, NOT a nested NavigationMenuRoot', async () => {
        // Reka's NavigationMenu is built around a SINGLE root per bar.
        // Recursing the flyout panel in dropdown mode would nest a second
        // `NavigationMenuRoot` inside this root's content, which breaks the
        // hover state machine (the panel only opens on the first hover and
        // never reopens). The flyout children must render as a plain <ul>.
        vi.useFakeTimers();
        try {
            const wrapper = buildApp({ items, orientation: 'horizontal' });
            await nextTick();

            // The owning root is the only NavigationMenu marker in the tree —
            // the marker lives on `wrapper.element` itself (the <nav>), so the
            // descendant query must find none.
            expect((wrapper.element as HTMLElement).matches('[data-reka-navigation-menu]')).toBe(true);
            expect(wrapper.element.querySelectorAll('[data-reka-navigation-menu]').length).toBe(0);

            // Hover the group trigger to open the flyout (Reka unmounts it
            // while closed, so it must be opened to inspect its contents).
            const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
            trigger.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' } as PointerEventInit));
            trigger.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' } as PointerEventInit));
            vi.advanceTimersByTime(500);
            await nextTick();
            await nextTick();
            await nextTick();

            // The flyout content mounts its child links as a plain list, with
            // no nested NavigationMenu root inside it.
            const flyout = wrapper.element.querySelector('.vc-nav-content') as HTMLElement;
            expect(flyout).not.toBeNull();
            expect(flyout.querySelector('.vc-nav-items')).not.toBeNull();
            expect(flyout.querySelector('[data-reka-navigation-menu]')).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });

    it('dropdown: hovering A → B → A re-shows each group\'s own children (reopen guard)', async () => {
        // Regression for "the dropdown only opens on first hover / the list is
        // empty on the second item": each flyout must remount its own children
        // every time it opens, not be consumed/emptied by the first open.
        vi.useFakeTimers();
        try {
            const wrapper = buildApp({ items: twoGroups, orientation: 'horizontal' });
            await nextTick();

            const triggers = wrapper.element.querySelectorAll('.vc-nav-trigger');
            const a = triggers[0] as HTMLElement;
            const b = triggers[1] as HTMLElement;

            const open = async (trigger: HTMLElement) => {
                pointer(trigger, 'pointerenter');
                pointer(trigger, 'pointermove');
                vi.advanceTimersByTime(500);
                await nextTick(); await nextTick(); await nextTick();
            };

            await open(a);
            expect(openFlyoutLinks(wrapper.element)).toEqual(['A1', 'A2']);

            pointer(a, 'pointerleave');
            await open(b);
            expect(openFlyoutLinks(wrapper.element)).toEqual(['B1', 'B2']);

            pointer(b, 'pointerleave');
            await open(a);
            expect(openFlyoutLinks(wrapper.element)).toEqual(['A1', 'A2']);
        } finally {
            vi.useRealTimers();
        }
    });
});
