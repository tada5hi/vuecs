// @vitest-environment jsdom
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useEmitAsProps } from '../../../src';

describe('useEmitAsProps', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('warns and returns an empty map when no emits are declared', () => {
        let resolved: Record<string, (...args: any[]) => void> | undefined;

        const Inner = defineComponent({
            name: 'Silent',
            setup(_, { emit }) {
                resolved = useEmitAsProps(emit);
                return () => h('div');
            },
        });

        mount(Inner);

        expect(resolved).toEqual({});
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No emitted event found'));
    });

    it('handles object-form emits (e.g. `emits: { change: null }`)', () => {
        let resolved: Record<string, (...args: any[]) => void> | undefined;
        const heard: number[] = [];

        const Inner = defineComponent({
            name: 'Inner',
            emits: {
                change: null,
                'update:modelValue': (payload: number) => typeof payload === 'number',
            },
            setup(_, { emit }) {
                resolved = useEmitAsProps(emit);
                return () => h('div');
            },
        });

        mount(defineComponent({
            setup() {
                return () => h(Inner, { onChange: (v: number) => heard.push(v) });
            },
        }));

        expect(typeof resolved!.onChange).toBe('function');
        expect(typeof resolved!['onUpdate:modelValue']).toBe('function');
        resolved!.onChange(7);
        expect(heard).toEqual([7]);
    });

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
