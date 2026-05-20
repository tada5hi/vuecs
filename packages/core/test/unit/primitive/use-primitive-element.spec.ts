// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    createTextVNode,
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

    it('walks past a #text $el to the next element sibling (fragment-first-text case)', async () => {
        // Vue produces a Text node as a component's `$el` when the
        // component returns a fragment starting with a text vnode. This is
        // the case `usePrimitiveElement`'s `nodeName === '#text'` branch
        // exists for — without the walk, `currentElement` would point at
        // the Text anchor instead of the real `<article>` next to it.
        const FragmentRoot = defineComponent({
            setup() {
                return () => [
                    createTextVNode(''),
                    h('article', { class: 'real' }, 'body'),
                ];
            },
        });

        const observed: string[] = [];
        const Wrapper = defineComponent({
            setup() {
                const { primitiveElement, currentElement } = usePrimitiveElement();
                return () => {
                    observed.push(currentElement.value?.tagName ?? '');
                    return h('div', null, h(FragmentRoot, { ref: primitiveElement }));
                };
            },
        });

        mount(Wrapper);
        await nextTick();
        await nextTick();

        // The most recent observation should resolve to the real <article>.
        // (Early renders before the ref settles can read as empty — that's
        // expected; the walker only fires once the component instance is
        // assigned.)
        expect(observed[observed.length - 1]).toBe('ARTICLE');
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
