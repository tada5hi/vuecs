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

const sizeOverride = {
    elements: {
        avatar: {
            variants: {
                size: {
                    sm: { root: 'avatar-sm' },
                    md: { root: 'avatar-md' },
                    lg: { root: 'avatar-lg' },
                },
            },
            defaultVariants: { size: 'md' },
        },
    },
};

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

    it('resolves the size prop through the variant system', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAvatar, { size: 'sm' }, { fallback: () => 'AB' });
            },
        }), { global: { plugins: [[vuecsElements, { overrides: sizeOverride }]] } });
        await nextTick();
        const root = wrapper.element as HTMLElement;
        expect(root.classList.contains('vc-avatar')).toBe(true);
        expect(root.classList.contains('avatar-sm')).toBe(true);
        expect(root.classList.contains('avatar-md')).toBe(false);
    });

    it('falls back to the default size variant when size is omitted', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAvatar, null, { fallback: () => 'AB' });
            },
        }), { global: { plugins: [[vuecsElements, { overrides: sizeOverride }]] } });
        await nextTick();
        const root = wrapper.element as HTMLElement;
        expect(root.classList.contains('avatar-md')).toBe(true);
        expect(root.classList.contains('avatar-sm')).toBe(false);
    });
});
