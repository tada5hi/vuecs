// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCCardPlaceholder } from '../../src';

const plugins = [[vuecsElements, {}]] as const;

describe('<VCCardPlaceholder>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders image + header + body + footer by default', () => {
        const wrapper = mount(VCCardPlaceholder, { global: { plugins: [...plugins] } });
        expect(wrapper.element.querySelector('.vc-card-placeholder-image')).not.toBeNull();
        expect(wrapper.element.querySelector('.vc-card-placeholder-header')).not.toBeNull();
        expect(wrapper.element.querySelector('.vc-card-placeholder-body')).not.toBeNull();
        expect(wrapper.element.querySelector('.vc-card-placeholder-footer')).not.toBeNull();
    });

    it('respects no-* props', () => {
        const wrapper = mount(VCCardPlaceholder, {
            props: {
                noImg: true,
                noHeader: true,
                noFooter: true,
            },
            global: { plugins: [...plugins] },
        });
        expect(wrapper.element.querySelector('.vc-card-placeholder-image')).toBeNull();
        expect(wrapper.element.querySelector('.vc-card-placeholder-header')).toBeNull();
        expect(wrapper.element.querySelector('.vc-card-placeholder-footer')).toBeNull();
        // Body still renders by default.
        expect(wrapper.element.querySelector('.vc-card-placeholder-body')).not.toBeNull();
    });

    it('bodyLines drives line count', () => {
        const wrapper = mount(VCCardPlaceholder, {
            props: {
                noImg: true,
                noHeader: true,
                noFooter: true,
                bodyLines: 7,
            },
            global: { plugins: [...plugins] },
        });
        const body = wrapper.element.querySelector('.vc-card-placeholder-body')!;
        expect(body.querySelectorAll('.vc-placeholder').length).toBe(7);
    });

    it('clamps pathological bodyLines to MAX_BODY_LINES (20)', () => {
        const wrapper = mount(VCCardPlaceholder, {
            props: {
                noImg: true,
                noHeader: true,
                noFooter: true,
                bodyLines: 100000,
            },
            global: { plugins: [...plugins] },
        });
        const body = wrapper.element.querySelector('.vc-card-placeholder-body')!;
        expect(body.querySelectorAll('.vc-placeholder').length).toBe(20);
    });

    it('coerces non-finite bodyLines to 0', () => {
        const wrapper = mount(VCCardPlaceholder, {
            props: {
                noImg: true,
                noHeader: true,
                noFooter: true,
                bodyLines: Number.NaN as never,
            },
            global: { plugins: [...plugins] },
        });
        // bodyLines === 0 → body section not rendered at all.
        expect(wrapper.element.querySelector('.vc-card-placeholder-body')).toBeNull();
    });
});
