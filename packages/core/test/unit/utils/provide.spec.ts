// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { inject, provide } from '../../../src';

describe('provide / inject (utility wrappers)', () => {
    it('provides + injects on a Vue App instance', () => {
        const app = createApp({ render: () => null });
        provide('foo', 'bar', app);
        expect(inject('foo', app)).toBe('bar');
    });

    it('skips re-provide when the key is already present on the app', () => {
        const app = createApp({ render: () => null });
        provide('foo', 'first', app);
        provide('foo', 'second', app);
        expect(inject('foo', app)).toBe('first');
    });

    it('returns undefined when injecting a missing key from an app', () => {
        const app = createApp({ render: () => null });
        expect(inject('missing', app)).toBeUndefined();
    });

    it('provides inside a component setup() context', () => {
        let injected: unknown;

        const Child = defineComponent({
            setup() {
                injected = inject('parent-key');
                return () => h('div');
            },
        });

        const Parent = defineComponent({
            setup() {
                provide('parent-key', 'value');
                return () => h(Child);
            },
        });

        mount(Parent);
        expect(injected).toBe('value');
    });

    it('skips re-provide inside setup() when the key already exists in the inject chain', () => {
        let outer: unknown;
        let inner: unknown;

        const Inner = defineComponent({
            setup() {
                provide('shared', 'inner-value');
                outer = inject('shared');

                const Leaf = defineComponent({
                    setup() {
                        inner = inject('shared');
                        return () => h('span');
                    },
                });
                return () => h(Leaf);
            },
        });

        const Outer = defineComponent({
            setup() {
                provide('shared', 'outer-value');
                return () => h(Inner);
            },
        });

        mount(Outer);
        expect(outer).toBe('outer-value');
        expect(inner).toBe('outer-value');
    });
});
