// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, { VCTableSortIndicators } from '../../src';
import type { TableColumn, TableSortState } from '../../src';

const plugins = [[vuecsTable, {}]] as const;

const columns: TableColumn[] = [
    {
        key: 'name', 
        label: 'Name', 
        sortable: true, 
    },
    {
        key: 'role', 
        label: 'Role', 
        sortable: true, 
    },
    { key: 'note', label: 'Note' }, // non-sortable
];

describe('<VCTableSortIndicators> (plan 033 v1.x-C)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    function mountIndicators(initial: TableSortState, extraProps: Record<string, unknown> = {}) {
        const sort = ref<TableSortState>(initial);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableSortIndicators, {
                    sort: sort.value,
                    columns,
                    'onUpdate:sort': (next: TableSortState) => { sort.value = next; },
                    ...extraProps,
                });
            },
        }), { global: { plugins: [...plugins] } });
        return { wrapper, sort };
    }

    it('renders empty state when sort is empty', () => {
        const { wrapper } = mountIndicators([]);
        expect((wrapper.element as HTMLElement).classList.contains('vc-table-sort-indicators')).toBe(true);
        expect(wrapper.element.textContent).toContain('no columns sorted yet');
    });

    it('renders one chip per descriptor with position + arrow', () => {
        const { wrapper } = mountIndicators([
            { key: 'role', direction: 'asc' },
            { key: 'name', direction: 'desc' },
        ]);
        const chips = wrapper.element.querySelectorAll('.vc-table-sort-indicators-chip');
        expect(chips.length).toBe(2);
        expect(chips[0].textContent).toContain('1.');
        expect(chips[0].textContent).toContain('Role');
        expect(chips[0].textContent).toContain('↑');
        expect(chips[1].textContent).toContain('2.');
        expect(chips[1].textContent).toContain('Name');
        expect(chips[1].textContent).toContain('↓');
    });

    it('clicking the chip toggle button toggles asc ↔ desc', async () => {
        const { wrapper, sort } = mountIndicators([{ key: 'role', direction: 'asc' }]);
        const toggle = wrapper.element.querySelector('.vc-table-sort-indicators-chip-toggle') as HTMLElement;
        toggle.click();
        await wrapper.vm.$nextTick();
        expect(sort.value).toEqual([{ key: 'role', direction: 'desc' }]);
    });

    it('clicking × removes that descriptor without toggling', async () => {
        const { wrapper, sort } = mountIndicators([
            { key: 'role', direction: 'asc' },
            { key: 'name', direction: 'asc' },
        ]);
        const removes = wrapper.element.querySelectorAll('.vc-table-sort-indicators-chip-remove');
        (removes[0] as HTMLElement).click();
        await wrapper.vm.$nextTick();
        expect(sort.value).toEqual([{ key: 'name', direction: 'asc' }]);
    });

    it('"Add column" select appends a sortable column with asc direction', async () => {
        const { wrapper, sort } = mountIndicators([]);
        const select = wrapper.element.querySelector('.vc-table-sort-indicators-add') as HTMLSelectElement;
        // The dropdown should only list SORTABLE columns not currently in sort.
        const optionValues = Array.from(select.options).map((o) => o.value).filter(Boolean);
        expect(optionValues).toEqual(['name', 'role']); // 'note' is not :sortable
        select.value = 'name';
        select.dispatchEvent(new Event('change'));
        await wrapper.vm.$nextTick();
        expect(sort.value).toEqual([{ key: 'name', direction: 'asc' }]);
    });

    it('"Clear all" empties the sort', async () => {
        const { wrapper, sort } = mountIndicators([
            { key: 'role', direction: 'asc' },
            { key: 'name', direction: 'desc' },
        ]);
        const clear = wrapper.element.querySelector('.vc-table-sort-indicators-clear') as HTMLElement;
        clear.click();
        await wrapper.vm.$nextTick();
        expect(sort.value).toEqual([]);
    });

    it('chip remove is keyboard-accessible (native <button> Enter / Space)', async () => {
        const { wrapper, sort } = mountIndicators([{ key: 'role', direction: 'asc' }]);
        const remove = wrapper.element.querySelector(
            '.vc-table-sort-indicators-chip-remove',
        ) as HTMLButtonElement;
        // Real `<button>` semantics — Enter / Space natively fire
        // a click on activation. `click()` is the closest jsdom
        // proxy that exercises that contract end-to-end.
        expect(remove.tagName).toBe('BUTTON');
        remove.click();
        await wrapper.vm.$nextTick();
        expect(sort.value).toEqual([]);
    });

    it('text strings are overridable via instance props', () => {
        const { wrapper } = mountIndicators([], {
            label: 'Sortieren:',
            emptyContent: 'Keine Spalten sortiert',
            addLabel: '+ Spalte hinzufügen',
        });
        expect(wrapper.element.textContent).toContain('Sortieren:');
        expect(wrapper.element.textContent).toContain('Keine Spalten sortiert');
    });

    it('returns null when sort + columns AND a table context are both absent', () => {
        const wrapper = mount(VCTableSortIndicators, { global: { plugins: [...plugins] } });
        // Vue renders a comment node for null roots.
        expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE);
    });

    it('hideAdd / hideClear suppress the respective controls', () => {
        const { wrapper } = mountIndicators(
            [{ key: 'role', direction: 'asc' }],
            { hideAdd: true, hideClear: true },
        );
        expect(wrapper.element.querySelector('.vc-table-sort-indicators-add')).toBeNull();
        expect(wrapper.element.querySelector('.vc-table-sort-indicators-clear')).toBeNull();
    });

    it('treats :sort="null" as empty array (migration shim)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableSortIndicators, {
                    sort: null as never,
                    columns,
                });
            },
        }), { global: { plugins: [...plugins] } });
        // Must not throw on null.map() — empty-state copy should render.
        expect((wrapper.element as HTMLElement).classList.contains('vc-table-sort-indicators')).toBe(true);
        expect(wrapper.element.textContent).toContain('no columns sorted yet');
    });

    it(':maxSortKeys caps appending via the chip row (evicts oldest)', async () => {
        const sort = ref<TableSortState>([
            { key: 'name', direction: 'asc' },
            { key: 'role', direction: 'asc' },
        ]);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableSortIndicators, {
                    sort: sort.value,
                    columns: [
                        {
                            key: 'name', 
                            label: 'Name', 
                            sortable: true, 
                        },
                        {
                            key: 'role', 
                            label: 'Role', 
                            sortable: true, 
                        },
                        {
                            key: 'note', 
                            label: 'Note', 
                            sortable: true, 
                        },
                    ],
                    maxSortKeys: 2,
                    'onUpdate:sort': (next: TableSortState) => { sort.value = next; },
                });
            },
        }), { global: { plugins: [...plugins] } });

        const select = wrapper.element.querySelector(
            '.vc-table-sort-indicators-add',
        ) as HTMLSelectElement;
        select.value = 'note';
        select.dispatchEvent(new Event('change'));
        await wrapper.vm.$nextTick();
        expect(sort.value.length).toBe(2);
        // Oldest (`name`) evicted; `role` and `note` remain.
        expect(sort.value.map((s) => s.key)).toEqual(['role', 'note']);
    });

    it('appendKey ignores non-sortable columns (defense for slot-prop callers)', async () => {
        // Mount with `#add` slot override — gives us programmatic
        // access to `addSlotProps.add` so we can simulate a custom
        // dropdown that fails to pre-filter.
        const sort = ref<TableSortState>([]);
        let capturedAdd: ((key: string) => void) | null = null;
        mount(defineComponent({
            setup() {
                return () => h(VCTableSortIndicators, {
                    sort: sort.value,
                    columns,
                    'onUpdate:sort': (next: TableSortState) => { sort.value = next; },
                }, {
                    add: (props: { options: TableColumn[]; add: (k: string) => void }) => {
                        capturedAdd = props.add;
                        return h('span', { 'data-test': 'custom-add' });
                    },
                });
            },
        }), { global: { plugins: [...plugins] } });
        // The `note` column has `sortable: false` — must not be added.
        capturedAdd!('note');
        expect(sort.value).toEqual([]);
        // The `name` column IS sortable — must be added.
        capturedAdd!('name');
        expect(sort.value).toEqual([{ key: 'name', direction: 'asc' }]);
        // Idempotent — adding the same key twice doesn't duplicate it.
        capturedAdd!('name');
        expect(sort.value).toEqual([{ key: 'name', direction: 'asc' }]);
    });

    it('#chip slot replaces per-chip rendering', () => {
        const sort = ref<TableSortState>([{ key: 'role', direction: 'asc' }]);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableSortIndicators, { sort: sort.value, columns }, {
                    chip: (chipProps: { descriptor: { key: string } }) => h(
                        'span',
                        { 'data-test': 'custom-chip', 'data-key': chipProps.descriptor.key },
                    ),
                });
            },
        }), { global: { plugins: [...plugins] } });
        const customChips = wrapper.element.querySelectorAll('[data-test="custom-chip"]');
        expect(customChips.length).toBe(1);
        expect(customChips[0].getAttribute('data-key')).toBe('role');
        // The default chip rendering is fully replaced — no toggle button.
        expect(wrapper.element.querySelector('.vc-table-sort-indicators-chip-toggle')).toBeNull();
    });

    it('reacts to external sort mutations', async () => {
        const sort = ref<TableSortState>([]);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableSortIndicators, { sort: sort.value, columns });
            },
        }), { global: { plugins: [...plugins] } });
        expect(wrapper.element.textContent).toContain('no columns sorted yet');
        sort.value = [{ key: 'role', direction: 'asc' }];
        await wrapper.vm.$nextTick();
        const chips = wrapper.element.querySelectorAll('.vc-table-sort-indicators-chip');
        expect(chips.length).toBe(1);
        expect(wrapper.element.textContent).not.toContain('no columns sorted yet');
    });

    it('renders two real <button> elements per chip (not nested role=button)', () => {
        const { wrapper } = mountIndicators([{ key: 'role', direction: 'asc' }]);
        const chip = wrapper.element.querySelector('.vc-table-sort-indicators-chip');
        expect(chip).not.toBeNull();
        // Wrapper is a <div>, not a button.
        expect((chip as HTMLElement).tagName).toBe('DIV');
        // Two real buttons inside, no <button> nesting.
        const buttons = chip!.querySelectorAll('button');
        expect(buttons.length).toBe(2);
        expect(buttons[0].classList.contains('vc-table-sort-indicators-chip-toggle')).toBe(true);
        expect(buttons[1].classList.contains('vc-table-sort-indicators-chip-remove')).toBe(true);
    });
});
