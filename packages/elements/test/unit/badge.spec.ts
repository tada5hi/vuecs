// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCBadge } from '../../src';

describe('<VCBadge>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the slot content with the base vc-badge class', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCBadge, null, { default: () => 'NEW' });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        const root = wrapper.element as HTMLElement;
        expect(root.tagName).toBe('SPAN');
        expect(root.textContent).toBe('NEW');
        expect(root.classList.contains('vc-badge')).toBe(true);
    });

    it('respects the tag prop', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCBadge, { tag: 'div' }, { default: () => 'x' });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        expect((wrapper.element as HTMLElement).tagName).toBe('DIV');
    });
});
