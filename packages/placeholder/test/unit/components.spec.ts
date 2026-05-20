// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { mount } from '@vue/test-utils';
import vuecsPlaceholder, {
    VCPlaceholder,
    VCPlaceholderCard,
    VCPlaceholderTable,
    VCPlaceholderWrapper,
} from '../../src';

const plugins = [[vuecsPlaceholder, {}]] as const;

describe('<VCPlaceholder>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders a span with default width 100% + wave animation', () => {
        const wrapper = mount(VCPlaceholder, { global: { plugins: [...plugins] } });
        const el = wrapper.element as HTMLElement;
        expect(el.tagName).toBe('SPAN');
        expect(el.classList.contains('vc-placeholder')).toBe(true);
        expect(el.classList.contains('vc-placeholder-wave')).toBe(true);
        expect(el.style.width).toBe('100%');
        expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('accepts numeric width as percentage', () => {
        const wrapper = mount(VCPlaceholder, { props: { width: 60 }, global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).style.width).toBe('60%');
    });

    it('accepts CSS-length width verbatim', () => {
        const wrapper = mount(VCPlaceholder, { props: { width: '12rem' }, global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).style.width).toBe('12rem');
    });

    it('animation="glow" applies glow class instead of wave', () => {
        const wrapper = mount(VCPlaceholder, { props: { animation: 'glow' }, global: { plugins: [...plugins] } });
        expect(wrapper.element.classList.contains('vc-placeholder-glow')).toBe(true);
        expect(wrapper.element.classList.contains('vc-placeholder-wave')).toBe(false);
    });

    it('animation="none" applies neither animation class', () => {
        const wrapper = mount(VCPlaceholder, { props: { animation: 'none' }, global: { plugins: [...plugins] } });
        expect(wrapper.element.classList.contains('vc-placeholder-glow')).toBe(false);
        expect(wrapper.element.classList.contains('vc-placeholder-wave')).toBe(false);
    });

    it('size prop drives the size theme variant', () => {
        const wrapper = mount(VCPlaceholder, { props: { size: 'lg' }, global: { plugins: [...plugins] } });
        expect(wrapper.element.classList.contains('vc-placeholder-lg')).toBe(true);
    });

    it('shape="circle" applies the circle variant', () => {
        const wrapper = mount(VCPlaceholder, { props: { shape: 'circle' }, global: { plugins: [...plugins] } });
        expect(wrapper.element.classList.contains('vc-placeholder-circle')).toBe(true);
    });

    it('shape="pill" applies the pill variant', () => {
        const wrapper = mount(VCPlaceholder, { props: { shape: 'pill' }, global: { plugins: [...plugins] } });
        expect(wrapper.element.classList.contains('vc-placeholder-pill')).toBe(true);
    });

    it('clamps negative numeric width to 0%', () => {
        const wrapper = mount(VCPlaceholder, { props: { width: -50 }, global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).style.width).toBe('0%');
    });

    it(':duration sets the animation-duration inline style', () => {
        const wrapper = mount(VCPlaceholder, { props: { duration: '500ms' }, global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).style.animationDuration).toBe('500ms');
    });
});

describe('<VCPlaceholderTable>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders a <table> with default 5 rows × 4 columns + header', () => {
        const wrapper = mount(VCPlaceholderTable, { global: { plugins: [...plugins] } });
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
        const wrapper = mount(VCPlaceholderTable, {
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
        const wrapper = mount(VCPlaceholderTable, {
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
        const wrapper = mount(VCPlaceholderTable, {
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
        const wrapper = mount(VCPlaceholderTable, {
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
        const wrapper = mount(VCPlaceholderTable, {
            props: { rows: 2, columns: 3 },
            slots: { thead: '<tr><th data-test="custom-thead">CUSTOM</th></tr>' },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('thead [data-test="custom-thead"]')).not.toBeNull();
        // Default header bars are gone.
        expect(wrapper.element.querySelectorAll('thead .vc-placeholder').length).toBe(0);
    });

    it('#tfoot slot replaces the default footer row when showFooter is on', () => {
        const wrapper = mount(VCPlaceholderTable, {
            props: { rows: 2, columns: 3, showFooter: true },
            slots: { tfoot: '<tr><td data-test="custom-tfoot">CUSTOM</td></tr>' },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('tfoot [data-test="custom-tfoot"]')).not.toBeNull();
        expect(wrapper.element.querySelectorAll('tfoot .vc-placeholder').length).toBe(0);
    });
});

describe('<VCPlaceholderCard>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders image + header + body + footer by default', () => {
        const wrapper = mount(VCPlaceholderCard, { global: { plugins: [...plugins] } });
        expect(wrapper.element.querySelector('.vc-placeholder-card-image')).not.toBeNull();
        expect(wrapper.element.querySelector('.vc-placeholder-card-header')).not.toBeNull();
        expect(wrapper.element.querySelector('.vc-placeholder-card-body')).not.toBeNull();
        expect(wrapper.element.querySelector('.vc-placeholder-card-footer')).not.toBeNull();
    });

    it('respects no-* props', () => {
        const wrapper = mount(VCPlaceholderCard, {
            props: {
                noImg: true, 
                noHeader: true, 
                noFooter: true,
            },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('.vc-placeholder-card-image')).toBeNull();
        expect(wrapper.element.querySelector('.vc-placeholder-card-header')).toBeNull();
        expect(wrapper.element.querySelector('.vc-placeholder-card-footer')).toBeNull();
        // Body still renders by default.
        expect(wrapper.element.querySelector('.vc-placeholder-card-body')).not.toBeNull();
    });

    it('bodyLines drives line count', () => {
        const wrapper = mount(VCPlaceholderCard, {
            props: {
                noImg: true, 
                noHeader: true, 
                noFooter: true, 
                bodyLines: 7, 
            },
            global: { plugins: [...plugins] },
        });
        const body = wrapper.element.querySelector('.vc-placeholder-card-body')!;
        expect(body.querySelectorAll('.vc-placeholder').length).toBe(7);
    });
});

describe('<VCPlaceholderWrapper>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders default slot when loading=false', () => {
        const wrapper = mount(VCPlaceholderWrapper, {
            slots: { default: '<p data-test="real">real</p>', loading: '<p data-test="skeleton">skeleton</p>' },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('[data-test="real"]')).not.toBeNull();
        expect(wrapper.element.querySelector('[data-test="skeleton"]')).toBeNull();
        expect(wrapper.element.getAttribute('aria-busy')).toBeNull();
    });

    it('renders loading slot + ARIA loading announcement when loading=true', () => {
        const wrapper = mount(VCPlaceholderWrapper, {
            props: { loading: true },
            slots: { default: '<p data-test="real">real</p>', loading: '<p data-test="skeleton">skeleton</p>' },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('[data-test="real"]')).toBeNull();
        expect(wrapper.element.querySelector('[data-test="skeleton"]')).not.toBeNull();
        // W3C "Loading content" pattern — exposes the wrapper as a
        // polite live region so AT consumers get an announcement
        // when the loading state begins.
        expect(wrapper.element.getAttribute('aria-busy')).toBe('true');
        expect(wrapper.element.getAttribute('role')).toBe('status');
        expect(wrapper.element.getAttribute('aria-live')).toBe('polite');
    });
});
