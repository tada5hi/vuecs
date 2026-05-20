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
