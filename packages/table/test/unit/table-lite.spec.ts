// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, {
    VCTableLite,
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
];

const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: true,
    },
    {
        key: 'name',
        label: 'Name',
        sortable: true,
    },
];

describe('<VCTableLite> (plan 033 v0.2-C)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the columns driver auto-render path', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableLite, { columns: columns as never, data: data as never });
            },
        }), { global: { plugins: [...plugins] } });

        const headers = wrapper.element.querySelectorAll('thead th');
        expect(headers.length).toBe(2);
        expect(headers[0].textContent?.trim()).toBe('ID');

        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[0].textContent).toBe('1');
        expect(cells[1].textContent).toBe('Alice');
    });

    it('ignores sort interaction — clicks on sortable headers do NOT update aria-sort', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableLite, { columns: columns as never, data: data as never });
            },
        }), { global: { plugins: [...plugins] } });

        const sortableHeader = wrapper.element.querySelector('thead th[aria-sort]');
        expect(sortableHeader).not.toBeNull();
        expect(sortableHeader?.getAttribute('aria-sort')).toBe('none');

        (sortableHeader as HTMLElement).click();
        await wrapper.vm.$nextTick();

        // setSort is a no-op in Lite — aria-sort stays at 'none'.
        expect(sortableHeader?.getAttribute('aria-sort')).toBe('none');
    });

    it('does not emit update:sort', async () => {
        const onUpdateSort = ref<unknown>(null);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableLite, {
                    columns: columns as never,
                    data: data as never,
                    'onUpdate:sort': (v: unknown) => { onUpdateSort.value = v; },
                });
            },
        }), { global: { plugins: [...plugins] } });

        const sortableHeader = wrapper.element.querySelector('thead th[aria-sort]') as HTMLElement;
        sortableHeader.click();
        await wrapper.vm.$nextTick();

        expect(onUpdateSort.value).toBeNull();
    });

    it('does not respond to :row-clickable (prop is not declared)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                // Pass row-clickable via attrs — TableLite ignores it (no prop).
                return () => h(VCTableLite, {
                    columns: columns as never,
                    data: data as never,
                    'row-clickable': true,
                }, { default: () => h(VCTableRow, { row: data[0], index: 0 }) });
            },
        }), { global: { plugins: [...plugins] } });

        const row = wrapper.element.querySelector('tbody tr') as HTMLElement;
        // row-clickable=false in context → no tabindex/cursor-pointer.
        expect(row?.hasAttribute('tabindex')).toBe(false);
    });

    it('supports :responsive (sets data-responsive on <table>)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableLite, {
                    columns: columns as never,
                    data: data as never,
                    responsive: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const table = wrapper.element.querySelector('table');
        expect(table?.getAttribute('data-responsive')).toBe('true');
    });
});
