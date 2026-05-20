// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, { VCTable, VCTableLite } from '../../src';

const plugins = [[vuecsTable, {}]] as const;

type User = { id: number; name: string };
const data: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
];
const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
];

describe('<VCTable :busy :placeholder> integrated skeleton mode', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders skeleton tbody when :busy && :placeholder are both set', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: columns as never,
                    data: data as never,
                    busy: true,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const skeleton = wrapper.element.querySelector('tbody.vc-table-placeholder-body');
        expect(skeleton).not.toBeNull();
        // Real header still renders (column labels from :columns).
        expect(wrapper.element.querySelector('thead')).not.toBeNull();
        expect(wrapper.element.querySelectorAll('thead th').length).toBe(2);
        // tbody is `aria-hidden` so AT consumers don't enumerate skeleton bars.
        expect(skeleton!.getAttribute('aria-hidden')).toBe('true');
    });

    it('skeleton row count defaults to :data.length', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: columns as never,
                    data: data as never, // length 2
                    busy: true,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });
        const rows = wrapper.element.querySelectorAll('tbody.vc-table-placeholder-body tr');
        expect(rows.length).toBe(2);
    });

    it('skeleton row count falls back to 5 when :data is empty (first-load case)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: columns as never,
                    data: [] as never,
                    busy: true,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });
        const rows = wrapper.element.querySelectorAll('tbody.vc-table-placeholder-body tr');
        expect(rows.length).toBe(5);
    });

    it(':placeholder-rows overrides the default count', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: columns as never,
                    data: data as never,
                    busy: true,
                    placeholder: true,
                    placeholderRows: 8,
                });
            },
        }), { global: { plugins: [...plugins] } });
        const rows = wrapper.element.querySelectorAll('tbody.vc-table-placeholder-body tr');
        expect(rows.length).toBe(8);
    });

    it('toggling :busy off restores the real body', async () => {
        const busy = ref(true);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: columns as never,
                    data: data as never,
                    busy: busy.value,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        expect(wrapper.element.querySelector('tbody.vc-table-placeholder-body')).not.toBeNull();
        busy.value = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.element.querySelector('tbody.vc-table-placeholder-body')).toBeNull();
        // Real rows show data — each <td> contains the value text.
        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells.length).toBe(4); // 2 rows × 2 cols
    });

    it(':placeholder is a no-op without :busy', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: columns as never,
                    data: data as never,
                    busy: false,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });
        expect(wrapper.element.querySelector('tbody.vc-table-placeholder-body')).toBeNull();
    });

    it(':placeholder is a no-op without :columns (skeleton needs column count)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    data: [] as never,
                    busy: true,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });
        expect(wrapper.element.querySelector('tbody.vc-table-placeholder-body')).toBeNull();
    });
});

describe('<VCTableLite :busy :placeholder> integrated skeleton mode', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders skeleton tbody when :busy && :placeholder are both set', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTableLite, {
                    columns: columns as never,
                    data: data as never,
                    busy: true,
                    placeholder: true,
                });
            },
        }), { global: { plugins: [...plugins] } });
        const skeleton = wrapper.element.querySelector('tbody.vc-table-placeholder-body');
        expect(skeleton).not.toBeNull();
    });
});
