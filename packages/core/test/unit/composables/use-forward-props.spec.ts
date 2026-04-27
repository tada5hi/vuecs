// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useForwardProps } from '../../../src';

describe('useForwardProps', () => {
    it('includes only assigned-or-defaulted props (drops undefined assigned)', () => {
        let resolved: Record<string, unknown> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            props: {
                size: { type: String, default: 'md' },
                color: { type: String, default: undefined },
            },
            setup(props) {
                const forwarded = useForwardProps(props);
                return () => {
                    resolved = forwarded.value;
                    return h('div');
                };
            },
        });

        mount(Inner, { props: { color: 'red' } });

        expect(resolved).toEqual({ size: 'md', color: 'red' });
    });

    it('omits keys whose declared default is undefined and which were not passed', () => {
        let resolved: Record<string, unknown> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            props: { color: { type: String, default: undefined } },
            setup(props) {
                const forwarded = useForwardProps(props);
                return () => {
                    resolved = forwarded.value;
                    return h('div');
                };
            },
        });

        mount(Inner);

        expect(resolved).toEqual({});
    });

    it('camelizes kebab-case attrs from the parent vnode', () => {
        let resolved: Record<string, unknown> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            props: { fooBar: { type: String, default: undefined } },
            setup(props) {
                const forwarded = useForwardProps(props);
                return () => {
                    resolved = forwarded.value;
                    return h('div');
                };
            },
        });

        mount(defineComponent({
            setup() {
                return () => h(Inner, { 'foo-bar': 'baz' });
            },
        }));

        expect(resolved).toEqual({ fooBar: 'baz' });
    });

    it('preserves explicitly-passed values that override defaults', () => {
        let resolved: Record<string, unknown> | undefined;

        const Inner = defineComponent({
            name: 'Inner',
            props: { size: { type: String, default: 'md' } },
            setup(props) {
                const forwarded = useForwardProps(props);
                return () => {
                    resolved = forwarded.value;
                    return h('div');
                };
            },
        });

        mount(Inner, { props: { size: 'lg' } });
        expect(resolved).toEqual({ size: 'lg' });
    });
});
