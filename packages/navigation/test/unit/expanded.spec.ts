// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsNav, { VCNavItems } from '../../src';
import type { NavigationItem } from '../../src';
// The helpers are internal — `src/index.ts` re-exports components, registry
// and types only — so reach them by path rather than through the barrel.
import { normalizeItems } from '../../src/helpers/normalize';
import { resetItemsByTrace } from '../../src/helpers/reset';

function buildApp(items: NavigationItem[], path?: string) {
    const App = defineComponent({
        setup() {
            return () => h(VCNavItems, { data: items, path });
        },
    });

    return mount(App, {
        global: { plugins: [[vuecsNav, {}]] },
        attachTo: document.body,
    });
}

const childLabels = (root: Element) => Array
    .from(root.querySelectorAll('.vc-nav-link'))
    .map((l) => (l.textContent || '').trim());

describe('NavigationItem.expanded', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders children without a trigger when declared expanded', async () => {
        const wrapper = buildApp([
            { name: 'Home', url: '/home' },
            {
                name: 'Projects',
                expanded: true,
                children: [
                    { name: 'Outgoing', url: '/projects' },
                    { name: 'Incoming', url: '/projects/in' },
                ],
            },
        ], '/home');
        await nextTick();

        // The title keeps the trigger CLASS so the group still looks like one,
        // but it must not be an interactive disclosure: a control that cannot
        // close would report a permanently-true aria-expanded to assistive
        // tech and present a dead click target.
        const title = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(title).not.toBeNull();
        expect(title.tagName).not.toBe('BUTTON');
        expect(title.getAttribute('aria-expanded')).toBeNull();

        expect(wrapper.element.querySelector('[data-expanded]')).not.toBeNull();
        expect(childLabels(wrapper.element)).toEqual(['Home', 'Outgoing', 'Incoming']);
    });

    it('stays open on a path outside the group', async () => {
        const items: NavigationItem[] = [
            { name: 'Home', url: '/home' },
            {
                name: 'Projects',
                expanded: true,
                children: [{ name: 'Outgoing', url: '/projects' }],
            },
        ];

        // `/home` elects the leaf, so the group is neither active nor an
        // ancestor of the active item — the case that collapses it normally.
        const wrapper = buildApp(items, '/home');
        await nextTick();

        expect(childLabels(wrapper.element)).toContain('Outgoing');
    });

    it('collapses a group that does not declare it', async () => {
        const wrapper = buildApp([
            { name: 'Home', url: '/home' },
            {
                name: 'Projects',
                children: [{ name: 'Outgoing', url: '/projects' }],
            },
        ], '/home');
        await nextTick();

        const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(trigger).not.toBeNull();
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    /**
     * `displayChildren` is DERIVED — `resetItemsByTrace` rewrites it on every
     * resolve, which is why declaring it on a source item never stuck and
     * `expanded` had to exist as a separate input.
     */
    /**
     * The normalized tree is what a nav publishes to the registry, so a
     * dependent nav reads `displayChildren` from it. It has to agree with what
     * is actually on screen — an expanded group rendering its children while
     * reporting `displayChildren: false` is a trap for any consumer that keys
     * off it.
     */
    it('reports displayChildren on the derived tree', () => {
        const normalized = normalizeItems([
            { name: 'Home', url: '/home' },
            {
                name: 'Projects',
                expanded: true,
                children: [{ name: 'Outgoing', url: '/projects' }],
            },
        ]);

        // Active trail is the leaf, so the group is neither active nor an
        // ancestor — without `expanded` this resolves to false.
        resetItemsByTrace(normalized, ['Home']);

        const group = normalized.find((item) => item.name === 'Projects');
        expect(group?.active).toBe(false);
        expect(group?.activeWithin).toBe(false);
        expect(group?.displayChildren).toBe(true);
    });

    it('ignores displayChildren declared on the source item', async () => {
        const wrapper = buildApp([
            { name: 'Home', url: '/home' },
            {
                name: 'Projects',
                displayChildren: true,
                children: [{ name: 'Outgoing', url: '/projects' }],
            },
        ], '/home');
        await nextTick();

        const trigger = wrapper.element.querySelector('.vc-nav-trigger') as HTMLElement;
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
});
