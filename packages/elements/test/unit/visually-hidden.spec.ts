// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCVisuallyHidden } from '../../src';

describe('<VCVisuallyHidden>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders text inside a hidden span by default', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCVisuallyHidden, null, { default: () => 'screen-reader-only' });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        const root = wrapper.element as HTMLElement;
        expect(root.tagName).toBe('SPAN');
        expect(root.textContent).toBe('screen-reader-only');
        // Reka inlines `position: absolute; width: 1px; …` to keep content
        // accessible to AT but visually clipped.
        expect(root.style.position).toBe('absolute');
    });
});
