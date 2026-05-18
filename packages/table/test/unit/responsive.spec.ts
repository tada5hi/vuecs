// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, { VCTable } from '../../src';

const plugins = [[vuecsTable, {}]] as const;

describe('<VCTable> stacked responsive mode (plan 033 v0.2-D)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('does NOT emit data-responsive when the prop is omitted', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: [{ key: 'name' }] as never, data: [] as never });
            },
        }), { global: { plugins: [...plugins] } });

        const table = wrapper.element.querySelector('table');
        expect(table?.hasAttribute('data-responsive')).toBe(false);
    });

    it('emits data-responsive="true" when :responsive', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: [] as never,
                    responsive: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const table = wrapper.element.querySelector('table');
        expect(table?.getAttribute('data-responsive')).toBe('true');
    });

    it('preserves data-label="<column.label>" on every <td> for the stacked-mode pseudo', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        { key: 'name', label: 'Full Name' },
                        { key: 'email', label: 'Email Address' },
                    ] as never,
                    data: [{ name: 'Alice', email: 'a@example.com' }] as never,
                    responsive: true,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[0].getAttribute('data-label')).toBe('Full Name');
        expect(cells[1].getAttribute('data-label')).toBe('Email Address');
    });
});
