// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useForwardPropsEmits } from '../../../src';

describe('useForwardPropsEmits', () => {
    it('combines forwarded props and emit-as-props', () => {
        let resolved: Record<string, unknown> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            props: { size: { type: String, default: 'md' } },
            emits: ['change'],
            setup(props, { emit }) {
                const forwarded = useForwardPropsEmits(props, emit);
                return () => {
                    resolved = forwarded.value;
                    return h('div');
                };
            },
        });

        mount(Inner, { props: { size: 'lg' } });

        expect(resolved).toBeDefined();
        expect(resolved!.size).toBe('lg');
        expect(typeof (resolved as any).onChange).toBe('function');
    });

    it('omits emit handlers when no emit is provided', () => {
        let resolved: Record<string, unknown> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            props: { size: { type: String, default: 'md' } },
            setup(props) {
                const forwarded = useForwardPropsEmits(props);
                return () => {
                    resolved = forwarded.value;
                    return h('div');
                };
            },
        });

        mount(Inner);

        expect(resolved).toEqual({ size: 'md' });
    });
});
