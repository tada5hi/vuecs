// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useEmitAsProps } from '../../../src';

describe('useEmitAsProps', () => {
    it('maps each declared emit to an `on<Event>` prop that proxies to emit', () => {
        let resolved: Record<string, (...args: any[]) => void> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            emits: ['change', 'update:modelValue'],
            setup(_, { emit }) {
                resolved = useEmitAsProps(emit);
                return () => h('div');
            },
        });

        const wrapper = mount(defineComponent({
            setup() {
                return () => h(Inner, { onChange: (v: number) => { (wrapper.vm as any).changed = v; } });
            },
            data: () => ({ changed: 0 }),
        }));

        expect(resolved).toBeDefined();
        expect(typeof resolved!.onChange).toBe('function');
        expect(typeof resolved!['onUpdate:modelValue']).toBe('function');

        resolved!.onChange(42);
        expect((wrapper.vm as any).changed).toBe(42);
    });
});
