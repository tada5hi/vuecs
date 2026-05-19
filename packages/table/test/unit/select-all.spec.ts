// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h, ref } from 'vue';
import type { Ref } from 'vue';
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
type SelectionValue = number | number[] | null;

const data: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Carol' },
];

const columns = [
    { key: '_select', label: '' },
    { key: 'name', label: 'Name' },
];

function mountTable(selection: Ref<SelectionValue>, mode: 'single' | 'multi' = 'multi') {
    return mount(defineComponent({
        setup() {
            return () => h(VCTable, {
                columns: columns as never,
                data: data as never,
                selectionMode: mode,
                selection: selection.value,
                'onUpdate:selection': (next: SelectionValue) => { selection.value = next; },
            }, () => [
                h(VCTableHeader, () => h(VCTableRow, () => [
                    h(VCTableHeadCell, { isSelector: true }),
                    h(VCTableHeadCell, { columnKey: 'name' }, () => 'Name'),
                ])),
                h(VCTableBody, () => data.map((row, index) => h(VCTableRow, {
                    row: row as never,
                    index,
                }, () => [
                    h(VCTableCell, { isSelector: true }),
                    h(VCTableCell, { columnKey: 'name' }),
                ]))),
            ]);
        },
    }), { global: { plugins: [...plugins] } });
}

describe('<VCTableHeadCell isSelector> + <VCTableCell isSelector> (plan 033 v1.x-D)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders an indeterminate-capable checkbox in multi mode', () => {
        const selection = ref<SelectionValue>([]);
        const wrapper = mountTable(selection);
        const headerCheckbox = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        ) as HTMLInputElement;
        expect(headerCheckbox).not.toBeNull();
        expect(headerCheckbox.type).toBe('checkbox');
        expect(headerCheckbox.checked).toBe(false);
        expect(headerCheckbox.indeterminate).toBe(false);
    });

    it('per-row checkbox renders as <input type="radio"> in single mode', () => {
        const selection = ref<SelectionValue>(null);
        const wrapper = mountTable(selection, 'single');
        const bodyInputs = wrapper.element.querySelectorAll(
            'tbody .vc-table-selector-checkbox',
        ) as NodeListOf<HTMLInputElement>;
        expect(bodyInputs.length).toBe(3);
        expect(bodyInputs[0].type).toBe('radio');
    });

    it('select-all clicks all rows then clears on second click', async () => {
        const selection = ref<SelectionValue>([]);
        const wrapper = mountTable(selection);
        const headerCheckbox = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        ) as HTMLInputElement;

        headerCheckbox.click();
        await wrapper.vm.$nextTick();
        expect(selection.value).toEqual([1, 2, 3]);

        // Re-render — header now shows checked.
        const refreshed = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        ) as HTMLInputElement;
        expect(refreshed.checked).toBe(true);

        refreshed.click();
        await wrapper.vm.$nextTick();
        expect(selection.value).toEqual([]);
    });

    it('header checkbox is indeterminate when some but not all are selected', async () => {
        const selection = ref<SelectionValue>([1]);
        const wrapper = mountTable(selection);
        const headerCheckbox = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        ) as HTMLInputElement;
        expect(headerCheckbox.indeterminate).toBe(true);
        expect(headerCheckbox.checked).toBe(false);
    });

    it('per-row checkbox toggles that row independently', async () => {
        const selection = ref<SelectionValue>([]);
        const wrapper = mountTable(selection);
        const bodyCheckboxes = wrapper.element.querySelectorAll(
            'tbody .vc-table-selector-checkbox',
        ) as NodeListOf<HTMLInputElement>;
        bodyCheckboxes[1].click(); // toggle Bob
        await wrapper.vm.$nextTick();
        expect(selection.value).toEqual([2]);
    });

    it('header is empty in single mode (select-all does not apply)', () => {
        const selection = ref<SelectionValue>(null);
        const wrapper = mountTable(selection, 'single');
        const headerCheckbox = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        );
        expect(headerCheckbox).toBeNull();
    });

    it('select-all preserves off-screen selections (union, not overwrite)', async () => {
        // Simulate a paginated scenario: row id `99` is selected
        // but not in the visible data set. select-all must union it
        // in, not overwrite it.
        const selection = ref<SelectionValue>([99]);
        const wrapper = mountTable(selection);
        const headerCheckbox = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        ) as HTMLInputElement;
        headerCheckbox.click();
        await wrapper.vm.$nextTick();
        // 99 (off-screen) preserved + visible rows added.
        expect(selection.value).toEqual(expect.arrayContaining([99, 1, 2, 3]));
        expect((selection.value as number[]).length).toBe(4);
    });

    it('clear-all only removes visible row keys, not off-screen ones', async () => {
        const selection = ref<SelectionValue>([99, 1, 2, 3]);
        const wrapper = mountTable(selection);
        const headerCheckbox = wrapper.element.querySelector(
            'thead .vc-table-selector-checkbox',
        ) as HTMLInputElement;
        // All 3 visible rows are selected → state is 'all'. Click clears them.
        headerCheckbox.click();
        await wrapper.vm.$nextTick();
        expect(selection.value).toEqual([99]);
    });
});
