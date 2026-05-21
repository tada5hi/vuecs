// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import { VCPrimitive } from '../../../src';

// `Slot` is intentionally not exported from the package barrel — exercise it
// through `<VCPrimitive :as-child>` instead, which is its only consumption
// site inside vuecs.
describe('Slot (via VCPrimitive asChild)', () => {
    it('returns null when no default slot is provided', () => {
        const wrapper = mount(VCPrimitive, { props: { asChild: true } });
        // No element rendered; the test-utils root resolves to a comment node.
        expect(wrapper.element.nodeType).toBe(Node.COMMENT_NODE);
    });

    it('merges wrapper attrs into the cloned child', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(
                    VCPrimitive,
                    {
                        asChild: true, 
                        id: 'x', 
                        class: 'wrap', 
                    },
                    { default: () => h('button', { type: 'button', class: 'child' }, 'go') },
                );
            },
        }));

        expect(wrapper.element.tagName).toBe('BUTTON');
        expect((wrapper.element as HTMLButtonElement).type).toBe('button');
        expect(wrapper.element.id).toBe('x');
        expect(wrapper.element.className).toContain('wrap');
        expect(wrapper.element.className).toContain('child');
    });

    it('composes classes from wrapper and child; child wins on non-class attr conflict', () => {
        // mergeProps concatenates `class` lists in order, so both classes
        // appear on the final element. For non-class attrs (here `id`),
        // mergeProps(attrs, child.props) means the child's value wins —
        // this regression-pins the explicit-merge call site that reverses
        // the precedence cloneVNode(node, attrs) would otherwise apply.
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(
                    VCPrimitive,
                    {
                        asChild: true, 
                        class: 'foo', 
                        id: 'wrapper-id', 
                    },
                    { default: () => h('div', { class: 'bar', id: 'child-id' }) },
                );
            },
        }));

        expect(wrapper.element.className).toContain('foo');
        expect(wrapper.element.className).toContain('bar');
        // Non-class attr: child's `id` wins.
        expect(wrapper.element.id).toBe('child-id');
    });

    it('unwraps Fragment vnodes (e.g. from v-for/v-if templates)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(
                    VCPrimitive,
                    { asChild: true, 'data-x': '1' },
                    {
                        // Simulate a v-for fragment: array-of-vnodes is wrapped
                        // by Vue into a Fragment automatically when used inside
                        // a slot — passing an array here exercises the unwrap.
                        default: () => [h('a', { href: '/a' }, 'a')],
                    },
                );
            },
        }));

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.element.getAttribute('data-x')).toBe('1');
    });

    it('binds the consumer-supplied template ref to the cloned child', async () => {
        // Slot's `delete firstNonCommentChildren.props.ref` step exists so
        // cloneVNode preserves the original `vnode.ref` (already normalized
        // against the consumer's `currentRenderingInstance`) instead of
        // re-normalizing the string ref against Slot's instance. The
        // observable contract: a consumer's template ref on the slot child
        // resolves to the rendered (cloned) element, on the consumer's
        // component instance.
        const consumerRef = ref<HTMLElement | null>(null);

        const Consumer = defineComponent({
            setup() {
                return { consumerRef };
            },
            render() {
                return h(
                    VCPrimitive,
                    { asChild: true, class: 'wrap-cls' },
                    { default: () => h('a', { ref: 'consumerRef', href: '/x' }, 'link') },
                );
            },
        });

        const wrapper = mount(Consumer);
        await nextTick();

        // The consumer's `$refs.consumerRef` resolves to the cloned <a>,
        // not null — i.e. the asChild flow preserves ref binding.
        expect(consumerRef.value).not.toBeNull();
        expect(consumerRef.value?.tagName).toBe('A');
        // And the same element carries the wrapper's class via mergeProps.
        expect(wrapper.element.className).toContain('wrap-cls');
    });
});
