// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { mount } from '@vue/test-utils';
import vuecsTable, { VCTablePlaceholder } from '../../src';

const plugins = [[vuecsTable, {}]] as const;

describe('<VCTablePlaceholder>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders a <table> with default 5 rows × 4 columns + header', () => {
        const wrapper = mount(VCTablePlaceholder, { global: { plugins: [...plugins] } });
        const table = wrapper.element as HTMLTableElement;
        expect(table.tagName).toBe('TABLE');
        expect(table.querySelectorAll('thead tr').length).toBe(1);
        expect(table.querySelectorAll('thead th').length).toBe(4);
        expect(table.querySelectorAll('tbody tr').length).toBe(5);
        expect(table.querySelectorAll('tbody td').length).toBe(20);
        expect(table.querySelectorAll('tfoot').length).toBe(0);
        expect(table.getAttribute('role')).toBe('presentation');
    });

    it('showFooter renders <tfoot>', () => {
        const wrapper = mount(VCTablePlaceholder, {
            props: {
                showFooter: true,
                rows: 2,
                columns: 3,
            },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelectorAll('tfoot tr').length).toBe(1);
        expect(wrapper.element.querySelectorAll('tfoot td').length).toBe(3);
    });

    it('showHeader=false suppresses <thead>', () => {
        const wrapper = mount(VCTablePlaceholder, {
            props: {
                showHeader: false,
                rows: 1,
                columns: 2,
            },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelectorAll('thead').length).toBe(0);
    });

    it('handles zero rows / columns gracefully', () => {
        const wrapper = mount(VCTablePlaceholder, {
            props: {
                rows: 0,
                columns: 0,
                showHeader: false,
            },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelectorAll('tbody tr').length).toBe(0);
    });

    it('every header bar receives a valid (non-undefined) width', () => {
        // Regression test for the negative-modulo bug — the header
        // band passes `rowIdx = -1` into widthFor, and JS `%` with a
        // negative dividend yields a negative remainder. Without the
        // normalized modulo, `pattern[-3]` was `undefined` and the
        // first 3 header bars rendered `width: undefined%` (dropped
        // by the browser, collapsing to zero width).
        const wrapper = mount(VCTablePlaceholder, {
            props: { rows: 1, columns: 4 },
            global: { plugins: [...plugins] },
        });
        const headerBars = wrapper.element.querySelectorAll(
            'thead .vc-placeholder',
        ) as NodeListOf<HTMLElement>;
        expect(headerBars.length).toBe(4);
        headerBars.forEach((bar) => {
            expect(bar.style.width).toMatch(/^\d+%$/);
        });
    });

    it('#thead slot replaces the default header row', () => {
        const wrapper = mount(VCTablePlaceholder, {
            props: { rows: 2, columns: 3 },
            slots: { thead: '<tr><th data-test="custom-thead">CUSTOM</th></tr>' },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('thead [data-test="custom-thead"]')).not.toBeNull();
        expect(wrapper.element.querySelectorAll('thead .vc-placeholder').length).toBe(0);
    });

    it('#tfoot slot replaces the default footer row when showFooter is on', () => {
        const wrapper = mount(VCTablePlaceholder, {
            props: {
                rows: 2,
                columns: 3,
                showFooter: true,
            },
            slots: { tfoot: '<tr><td data-test="custom-tfoot">CUSTOM</td></tr>' },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('tfoot [data-test="custom-tfoot"]')).not.toBeNull();
        expect(wrapper.element.querySelectorAll('tfoot .vc-placeholder').length).toBe(0);
    });
});
