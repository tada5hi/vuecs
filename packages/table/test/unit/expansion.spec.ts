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
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, {
    VCTable,
} from '../../src';

// jsdom doesn't ship ResizeObserver; stub it with a no-op so
// VCTableRowExpansion's lifecycle doesn't throw on mount.
beforeAll(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
        globalThis.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof globalThis.ResizeObserver;
    }
});

const plugins = [[vuecsTable, {}]] as const;

type User = { id: number; name: string };

const data: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Carol' },
];

describe('<VCTable> expansion (plan 038 v2-A)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('auto-injects a leading trigger column in the header when :expandable', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const headers = wrapper.element.querySelectorAll('thead th');
        // 1 placeholder for trigger + 1 for 'name'
        expect(headers.length).toBe(2);
        expect(headers[0].getAttribute('aria-hidden')).toBe('true');
    });

    it('auto-injects a leading trigger cell on each data row when :expandable', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const firstRow = wrapper.element.querySelector('tbody tr');
        expect(firstRow).not.toBeNull();
        // First cell is the trigger TD (carries our marker attr).
        const firstCell = firstRow!.querySelector(':scope > td:first-child');
        expect(firstCell?.getAttribute('data-expand-trigger-cell')).toBe('true');
        // Trigger button inside
        const button = firstCell!.querySelector('button.vc-table-expand-trigger');
        expect(button).not.toBeNull();
        expect(button?.getAttribute('aria-expanded')).toBe('false');
    });

    it('places the trigger at the trailing edge when :expandableTrigger="trailing"', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expandableTrigger: 'trailing',
                });
            },
        }), { global: { plugins: [...plugins] } });

        const firstRow = wrapper.element.querySelector('tbody tr');
        const lastCell = firstRow!.querySelector(':scope > td:last-child');
        expect(lastCell?.getAttribute('data-expand-trigger-cell')).toBe('true');
    });

    it('does NOT inject the trigger when :expandableTrigger="none"', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expandableTrigger: 'none',
                });
            },
        }), { global: { plugins: [...plugins] } });

        const triggerCells = wrapper.element.querySelectorAll('[data-expand-trigger-cell]');
        expect(triggerCells.length).toBe(0);
        // Header also has no placeholder cell
        expect(wrapper.element.querySelectorAll('thead th').length).toBe(1);
    });

    it('clicking the trigger toggles the row open and renders the expansion panel', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                const expanded = ref<(string | number)[]>([]);
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expanded: expanded.value,
                    'onUpdate:expanded': (next: (string | number)[] | null) => {
                        expanded.value = Array.isArray(next) ? next : [];
                    },
                }, { expansion: ({ row }: { row: User }) => h('p', `Details for ${row.name}`) });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = wrapper.element.querySelector(
            'tbody tr:first-child button.vc-table-expand-trigger',
        ) as HTMLButtonElement;
        expect(trigger).not.toBeNull();

        trigger.click();
        await nextTick();

        const panels = wrapper.element.querySelectorAll('[data-state="open"]');
        expect(panels.length).toBeGreaterThan(0);
        expect(wrapper.element.textContent).toContain('Details for Alice');
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('multi mode: emits a multi-key array via update:expanded', async () => {
        let lastEmit: unknown = null;
        const wrapper = mount(defineComponent({
            setup() {
                const expanded = ref<(string | number)[]>([]);
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expansionMode: 'multi',
                    expanded: expanded.value,
                    'onUpdate:expanded': (next: unknown) => {
                        lastEmit = next;
                        if (Array.isArray(next)) expanded.value = next as (string | number)[];
                    },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        const triggers = wrapper.element.querySelectorAll('button.vc-table-expand-trigger');
        (triggers[0] as HTMLButtonElement).click();
        await nextTick();
        (triggers[1] as HTMLButtonElement).click();
        await nextTick();
        expect(Array.isArray(lastEmit)).toBe(true);
        expect((lastEmit as unknown[]).length).toBe(2);
    });

    it('single mode: opening a second row replaces the first (accordion)', async () => {
        let lastEmit: unknown = null;
        const wrapper = mount(defineComponent({
            setup() {
                const expanded = ref<string | number | null>(null);
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expansionMode: 'single',
                    expanded: expanded.value,
                    'onUpdate:expanded': (next: unknown) => {
                        lastEmit = next;
                        if (next === null || typeof next === 'string' || typeof next === 'number') {
                            expanded.value = next as string | number | null;
                        }
                    },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        const triggers = wrapper.element.querySelectorAll('button.vc-table-expand-trigger');
        (triggers[0] as HTMLButtonElement).click();
        await nextTick();
        expect(lastEmit).toBe(1);

        (triggers[1] as HTMLButtonElement).click();
        await nextTick();
        expect(lastEmit).toBe(2);
    });

    it('seeds the open state from `_expanded` row-meta on first mount', async () => {
        let lastEmit: unknown = null;
        const seeded = [
            { id: 1, name: 'Alice' },
            {
                id: 2, 
                name: 'Bob', 
                _expanded: true, 
            },
            { id: 3, name: 'Carol' },
        ];
        mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: seeded as never,
                    expandable: true,
                    'onUpdate:expanded': (next: unknown) => { lastEmit = next; },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        await nextTick();
        await nextTick();
        expect(Array.isArray(lastEmit)).toBe(true);
        expect((lastEmit as (string | number)[])).toContain(2);
    });

    it('bumps colspan by +1 on <VCTableEmpty> when :expandable is on', async () => {
        const { VCTableEmpty } = await import('../../src');
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }, { key: 'email' }] as never,
                    data: [] as never,
                    expandable: true,
                }, { default: () => h(VCTableEmpty, null, () => 'Nothing here') });
            },
        }), { global: { plugins: [...plugins] } });

        // 2 data columns + 1 trigger column → colspan 3 on the
        // empty-band cell. (Asserting the rendered `<td colspan>`
        // catches a colspan-bump regression directly, not just a
        // header-cell-count proxy.)
        const emptyCell = wrapper.element.querySelector('tbody td');
        expect(emptyCell?.getAttribute('colspan')).toBe('3');
    });

    // ──────────────────────────────────────────────────────────────────
    // Audit fixes (post-PR review)
    // ──────────────────────────────────────────────────────────────────

    it('single mode: row visually expands after click (machine receives bare key, not [key])', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                const expanded = ref<string | number | null>(null);
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expansionMode: 'single',
                    expanded: expanded.value,
                    'onUpdate:expanded': (next: unknown) => {
                        if (next === null || typeof next === 'string' || typeof next === 'number') {
                            expanded.value = next as string | number | null;
                        }
                    },
                }, { expansion: ({ row }: { row: User }) => h('p', `details:${row.name}`) });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = wrapper.element.querySelector(
            'tbody tr:first-child button.vc-table-expand-trigger',
        ) as HTMLButtonElement;
        trigger.click();
        await nextTick();
        await nextTick();
        // The KEY ASSERTION: the row actually appears expanded (not just
        // an emit-shape test). Pre-fix, single mode wrapped bare keys
        // into arrays which made `value === key` always false in the
        // selection machine — so the row visually stayed closed.
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(wrapper.element.textContent).toContain('details:Alice');
    });

    it('setting :expanded back to [] collapses all rows (empty-array v-model bug fix)', async () => {
        const expanded = ref<(string | number)[]>([]);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    expanded: expanded.value,
                    'onUpdate:expanded': (next: unknown) => {
                        expanded.value = Array.isArray(next) ? next as (string | number)[] : [];
                    },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = wrapper.element.querySelector(
            'tbody tr:first-child button.vc-table-expand-trigger',
        ) as HTMLButtonElement;
        trigger.click();
        await nextTick();
        expect(expanded.value).toEqual([1]);

        // Now collapse via prop reset — pre-fix this silently fell back
        // to the stale `expansionInternal` and the row stayed open.
        expanded.value = [];
        await nextTick();
        const openTriggers = wrapper.element.querySelectorAll('[aria-expanded="true"]');
        expect(openTriggers.length).toBe(0);
    });

    it('_expanded seed runs when data loads asynchronously (post-mount)', async () => {
        const dataRef = ref<User[]>([]);
        let lastEmit: unknown = null;
        mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: dataRef.value as never,
                    expandable: true,
                    'onUpdate:expanded': (next: unknown) => { lastEmit = next; },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        // Mount fires with empty data — pre-fix, the onMounted seed ran
        // here against [], found nothing, and never re-evaluated.
        await nextTick();
        expect(lastEmit).toBeNull();

        // Later, data arrives with a row marked _expanded.
        dataRef.value = [
            { id: 10, name: 'Late' } as User,
            {
                id: 11, 
                name: 'Seeded', 
                _expanded: true, 
            } as User,
        ];
        await nextTick();
        await nextTick();
        expect(Array.isArray(lastEmit)).toBe(true);
        expect((lastEmit as (string | number)[])).toContain(11);
    });

    it('Enter on a focused trigger does NOT toggle row selection in grid mode', async () => {
        let selectionUpdates = 0;
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    selectionMode: 'multi',
                    'onUpdate:selection': () => { selectionUpdates += 1; },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = wrapper.element.querySelector(
            'tbody tr:first-child button.vc-table-expand-trigger',
        ) as HTMLButtonElement;
        // Focus the trigger, then fire Enter — should toggle expansion
        // (button click) but NOT row selection (which the row's onKeydown
        // would have done pre-fix because it didn't filter by target).
        trigger.focus();
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            cancelable: true,
        });
        trigger.dispatchEvent(enterEvent);
        await nextTick();
        expect(selectionUpdates).toBe(0);
    });

    it('click on trigger does not bubble up to row-click handler', async () => {
        let rowClickCount = 0;
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    expandable: true,
                    rowClickable: true,
                    onRowClick: () => { rowClickCount += 1; },
                }, { expansion: ({ row }: { row: User }) => h('p', row.name) });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = wrapper.element.querySelector(
            'tbody tr:first-child button.vc-table-expand-trigger',
        ) as HTMLButtonElement;
        trigger.click();
        await nextTick();
        expect(rowClickCount).toBe(0);
    });
});
