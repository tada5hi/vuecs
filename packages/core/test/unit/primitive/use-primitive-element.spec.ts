// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
} from 'vue';
import { mount } from '@vue/test-utils';
import { VCPrimitive, usePrimitiveElement } from '../../../src';

describe('usePrimitiveElement', () => {
    it('resolves currentElement to the rendered DOM element', async () => {
        const Inner = defineComponent({
            setup() {
                return () => h('section', { 'data-x': '1' });
            },
        });

        const Wrapper = defineComponent({
            setup() {
                const { primitiveElement, currentElement } = usePrimitiveElement();
                return () => h(Inner, {
                    ref: primitiveElement,
                    'data-tag': currentElement.value?.tagName ?? '',
                });
            },
        });

        const wrapper = mount(Wrapper);
        await nextTick();
        expect(wrapper.element.tagName).toBe('SECTION');
    });

    it('returns null when no ref has been assigned', () => {
        const Wrapper = defineComponent({
            setup() {
                const { currentElement } = usePrimitiveElement();
                return () => h('div', { 'data-empty': currentElement.value == null ? '1' : '0' });
            },
        });

        const wrapper = mount(Wrapper);
        expect(wrapper.element.getAttribute('data-empty')).toBe('1');
    });

    it('skips through #text / #comment $el nodes (asChild template root)', async () => {
        // A primitive rendered via `:as-child` exposes a $el === Text/Comment
        // node from the wrapping <template>. usePrimitiveElement walks past
        // it to the real sibling element.
        const Wrapper = defineComponent({
            setup() {
                const { primitiveElement, currentElement } = usePrimitiveElement();
                return () => h(
                    'div',
                    null,
                    [
                        h(
                            VCPrimitive,
                            { asChild: true, ref: primitiveElement as any },
                            { default: () => h('p', { class: 'real' }, 'body') },
                        ),
                        h('span', { 'data-resolved': currentElement.value?.tagName ?? '' }),
                    ],
                );
            },
        });

        const wrapper = mount(Wrapper);
        await nextTick();
        await nextTick();

        // The resolved element is the cloned <p>, not the wrapping template's
        // text/comment placeholder. The span next to it carries the tag name
        // resolved via currentElement.
        const span = wrapper.element.querySelector('span[data-resolved]');
        expect(span?.getAttribute('data-resolved')).toBe('P');
    });
});
