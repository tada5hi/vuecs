// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCAspectRatio } from '../../src';

describe('<VCAspectRatio>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the default slot inside the ratio wrapper', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAspectRatio, { ratio: 16 / 9 }, { default: () => h('img', { src: '/a.jpg', alt: 'a' }) });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        expect(wrapper.find('img').exists()).toBe(true);
        // Reka emits an inline style with `padding-bottom` for the ratio
        // computed as `100 / ratio` — a number string of any precision is fine.
        const root = wrapper.element as HTMLElement;
        expect(root.style.paddingBottom).toMatch(/%/);
    });
});
