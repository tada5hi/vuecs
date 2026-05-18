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

    it('clicking a chip body toggles asc ↔ desc', async () => {
        const { wrapper, sort } = mountIndicators([{ key: 'role', direction: 'asc' }]);
        const chip = wrapper.element.querySelector('.vc-table-sort-indicators-chip') as HTMLElement;
        chip.click();
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

    it('chip remove is keyboard-accessible (Enter / Space)', async () => {
        const { wrapper, sort } = mountIndicators([{ key: 'role', direction: 'asc' }]);
        const remove = wrapper.element.querySelector(
            '.vc-table-sort-indicators-chip-remove',
        ) as HTMLElement;
        remove.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
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
});
