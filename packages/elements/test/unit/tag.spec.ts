// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it, 
    vi,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCTag, VCTags } from '../../src';

describe('<VCTag>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the label and base class', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTag, { label: 'beta' });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        const root = wrapper.element as HTMLElement;
        expect(root.textContent?.trim()).toBe('beta');
        expect(root.classList.contains('vc-tag')).toBe(true);
    });

    it('emits remove with the bound value when the remove button is clicked', async () => {
        const onRemove = vi.fn();
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTag, {
                    value: 'frontend',
                    label: 'frontend',
                    removable: true,
                    onRemove,
                });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        const button = wrapper.find('button.vc-tag-remove');
        expect(button.exists()).toBe(true);
        await button.trigger('click');
        expect(onRemove).toHaveBeenCalledWith('frontend');
    });

    it('does not render the remove button when removable is false', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTag, { label: 'static' });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        expect(wrapper.find('button.vc-tag-remove').exists()).toBe(false);
    });
});

describe('<VCTags>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('coerces strings into TagItem objects and forwards remove with value + item', async () => {
        const onRemove = vi.fn();
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTags, {
                    items: ['alpha', 'beta'],
                    removable: true,
                    onRemove,
                });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        const tags = wrapper.findAll('.vc-tag');
        expect(tags).toHaveLength(2);
        expect(tags[0].text()).toContain('alpha');
        await wrapper.findAll('button.vc-tag-remove')[1].trigger('click');
        expect(onRemove).toHaveBeenCalledWith('beta', expect.objectContaining({ value: 'beta' }));
    });

    it('respects per-item disabled (no remove button on disabled chips)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTags, {
                    items: [
                        { value: 'a', label: 'A' },
                        {
                            value: 'b', 
                            label: 'B', 
                            disabled: true, 
                        },
                    ],
                    removable: true,
                });
            },
        }), { global: { plugins: [[vuecsElements, {}]] } });
        expect(wrapper.findAll('button.vc-tag-remove')).toHaveLength(1);
    });
});
