// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCAvatar } from '../../src';

describe('<VCAvatar>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the fallback slot when no src is provided', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAvatar, null, { fallback: () => 'AB' });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        await nextTick();
        expect(wrapper.text()).toContain('AB');
        expect((wrapper.element as HTMLElement).classList.contains('vc-avatar')).toBe(true);
    });
});
