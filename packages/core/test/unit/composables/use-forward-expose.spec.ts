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
});
