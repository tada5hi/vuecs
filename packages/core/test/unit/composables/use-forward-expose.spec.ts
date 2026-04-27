// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import { useForwardExpose } from '../../../src';

describe('useForwardExpose', () => {
    it('forwards a DOM element ref to currentElement', async () => {
        const Wrapper = defineComponent({
            setup() {
                const { forwardRef, currentElement } = useForwardExpose();
                return () => h('button', {
                    ref: forwardRef,
                    'data-current': currentElement.value?.tagName ?? '',
                });
            },
        });

        const wrapper = mount(Wrapper);
        await nextTick();
        expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('exposes wrapper props on the wrapper instance', async () => {
        const Wrapper = defineComponent({
            props: { label: { type: String, default: 'hello' } },
            setup() {
                const { forwardRef } = useForwardExpose();
                return () => h('span', { ref: forwardRef });
            },
        });

        const wrapper = mount(Wrapper, { props: { label: 'world' } });
        await nextTick();

        expect((wrapper.vm as any).label).toBe('world');
    });

    it('updates currentRef when forwardRef is called with a different element', async () => {
        const toggle = ref(false);

        const Wrapper = defineComponent({
            setup() {
                const { forwardRef, currentRef } = useForwardExpose();
                return () => h(toggle.value ? 'section' : 'div', {
                    ref: forwardRef,
                    'data-tag': (currentRef.value as Element | null)?.nodeName ?? '',
                });
            },
        });

        const wrapper = mount(Wrapper);
        await nextTick();

        toggle.value = true;
        await nextTick();

        expect(wrapper.element.tagName).toBe('SECTION');
    });

    it('returns early when forwardRef is called with null', async () => {
        let api: ReturnType<typeof useForwardExpose>;

        const Wrapper = defineComponent({
            setup() {
                api = useForwardExpose();
                return () => h('div', { ref: api.forwardRef });
            },
        });

        mount(Wrapper);
        await nextTick();

        expect(() => api!.forwardRef(null)).not.toThrow();
        expect(api!.currentRef.value).toBeNull();
    });

    it('preserves a pre-existing local expose on the wrapper', async () => {
        const Wrapper = defineComponent({
            setup(_, { expose }) {
                expose({ greet: () => 'hi' });
                const { forwardRef } = useForwardExpose();
                return () => h('div', { ref: forwardRef });
            },
        });

        const wrapper = mount(Wrapper);
        await nextTick();

        expect(typeof (wrapper.vm as any).greet).toBe('function');
        expect((wrapper.vm as any).greet()).toBe('hi');
    });

    it('merges exposed methods from a forwarded child component', async () => {
        const Child = defineComponent({
            setup(_, { expose }) {
                expose({ doStuff: () => 'child-value' });
                return () => h('span', 'child');
            },
        });

        const Wrapper = defineComponent({
            setup() {
                const { forwardRef } = useForwardExpose();
                return () => h(Child, { ref: forwardRef });
            },
        });

        const wrapper = mount(Wrapper);
        await nextTick();

        expect(typeof (wrapper.vm as any).doStuff).toBe('function');
        expect((wrapper.vm as any).doStuff()).toBe('child-value');
    });
});
