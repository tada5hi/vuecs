// @vitest-environment jsdom
import {
    afterEach,
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
    VCTableBody,
    VCTableCell,
    VCTableHeadCell,
    VCTableHeader,
    VCTableRow,
} from '../../src';

const plugins = [[vuecsTable, {}]] as const;

type User = { id: number; name: string };

const data: User[] = [
    {
        id: 1,
        name: 'Alice',
    },
    {
        id: 2,
        name: 'Bob',
    },
    {
        id: 3,
        name: 'Carol',
    },
];

describe('<VCTable> selection (plan 033 v1.x-A)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('emits role="grid" + aria-multiselectable on <table> when selection mode is set', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'multi',
                });
            },
        }), { global: { plugins: [...plugins] } });

        const table = wrapper.element.querySelector('table');
        expect(table?.getAttribute('role')).toBe('grid');
        expect(table?.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('omits role="grid" when selection mode is undefined (v0.1 plain table)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const table = wrapper.element.querySelector('table');
        expect(table?.hasAttribute('role')).toBe(false);
        expect(table?.hasAttribute('aria-multiselectable')).toBe(false);
    });

    it('single mode: rows render aria-selected="false" by default', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'single',
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        expect(rows.length).toBe(3);
        for (const tr of rows) {
            expect(tr.getAttribute('role')).toBe('row');
            expect(tr.getAttribute('aria-selected')).toBe('false');
        }
    });

    it('single mode: clicking a row emits update:selection with the row key', async () => {
        const emits: Array<unknown> = [];
        const selectionRef = ref<unknown>(null);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'single',
                    selection: selectionRef.value,
                    'onUpdate:selection': (next: unknown) => {
                        emits.push(next);
                        selectionRef.value = next;
                    },
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        (rows[1] as HTMLElement).click();
        await nextTick();

        // Row 1 is Bob (id: 2).
        expect(emits).toEqual([2]);
        expect(rows[1].getAttribute('aria-selected')).toBe('true');
    });

    it('multi mode: ctrl-click toggles a single row without affecting others', async () => {
        const selectionRef = ref<unknown>(null);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'multi',
                    selection: selectionRef.value,
                    'onUpdate:selection': (next: unknown) => { selectionRef.value = next; },
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        // Plain click row 0 → [1]
        (rows[0] as HTMLElement).click();
        await nextTick();
        expect(selectionRef.value).toEqual([1]);
        // Ctrl-click row 2 → [1, 3]
        rows[2].dispatchEvent(new MouseEvent('click', { ctrlKey: true, bubbles: true }));
        await nextTick();
        expect(selectionRef.value).toEqual([1, 3]);
        // Click row 0 again toggles it off → [3]
        (rows[0] as HTMLElement).click();
        await nextTick();
        expect(selectionRef.value).toEqual([3]);
    });

    it('multi mode: shift-click extends the range from the anchor', async () => {
        const selectionRef = ref<unknown>(null);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'multi',
                    selection: selectionRef.value,
                    'onUpdate:selection': (next: unknown) => { selectionRef.value = next; },
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        (rows[0] as HTMLElement).click(); // anchor + [1]
        await nextTick();
        rows[2].dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
        await nextTick();
        // Range from row 0 (id 1) to row 2 (id 3) → [1, 2, 3]
        expect(selectionRef.value).toEqual([1, 2, 3]);
    });

    it('uses :get-row-key when provided', async () => {
        const selectionRef = ref<unknown>(null);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'single',
                    selection: selectionRef.value,
                    getRowKey: (row: unknown) => `user-${(row as User).id}`,
                    'onUpdate:selection': (next: unknown) => { selectionRef.value = next; },
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        (rows[1] as HTMLElement).click();
        await nextTick();
        expect(selectionRef.value).toBe('user-2');
    });

    it('roving tabindex: only the focused row carries tabindex=0', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'multi',
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        // Default focus on row 0.
        expect(rows[0].getAttribute('tabindex')).toBe('0');
        expect(rows[1].getAttribute('tabindex')).toBe('-1');
        expect(rows[2].getAttribute('tabindex')).toBe('-1');
    });

    it('manual `:selected` on a row overrides the auto-resolved selection', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                    selectionMode: 'multi',
                    selection: [1, 2],
                }, {
                    default: () => h(VCTableBody, null, {
                        row: ({ row, index }: { row: User; index: number }) => h(
                            VCTableRow,
                            {
                                row,
                                index,
                                // Override only for id=3; pass undefined for others
                                // so the auto-resolved selection [1,2] applies.
                                selected: row.id === 3 ? true : undefined,
                            },
                            () => [h(VCTableCell, { columnKey: 'name' })],
                        ),
                    }),
                });
            },
        }), { global: { plugins: [...plugins] } });

        const rows = wrapper.element.querySelectorAll('tbody tr');
        // selection prop says 1 + 2 selected, but row index 2 (id=3) is force-selected via prop.
        // Auto-resolved: rows 0,1 = true; row 2 manual = true.
        expect(rows[0].getAttribute('aria-selected')).toBe('true');
        expect(rows[1].getAttribute('aria-selected')).toBe('true');
        expect(rows[2].getAttribute('aria-selected')).toBe('true');
    });

    it('renders a header consistently when selection is set', () => {
        // Smoke: header cells still render correctly when grid role is on.
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name', label: 'Name' }] as never,
                    data: data as never,
                    selectionMode: 'single',
                }, {
                    default: () => [
                        h(VCTableHeader, null, () => h(VCTableRow, null, () => [
                            h(VCTableHeadCell, { columnKey: 'name' }, () => 'Name'),
                        ])),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const headers = wrapper.element.querySelectorAll('thead th');
        expect(headers.length).toBe(1);
        expect(headers[0].textContent?.trim()).toBe('Name');
    });
});
