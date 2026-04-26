// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useId } from '../../../src';

describe('useId', () => {
    it('returns the deterministic id when provided', () => {
        let resolved: string | undefined;
        mount(defineComponent({
            setup() {
                resolved = useId('my-id');
                return () => h('div');
            },
        }));
        expect(resolved).toBe('my-id');
    });

    it('generates an id with the default prefix', () => {
        let resolved: string | undefined;
        mount(defineComponent({
            setup() {
                resolved = useId();
                return () => h('div');
            },
        }));
        expect(resolved).toMatch(/^vc-/);
    });

    it('respects a custom prefix', () => {
        let resolved: string | undefined;
        mount(defineComponent({
            setup() {
                resolved = useId(undefined, 'foo');
                return () => h('div');
            },
        }));
        expect(resolved).toMatch(/^foo-/);
    });

    it('returns the bare Vue id when prefix is the empty string', () => {
        let resolved: string | undefined;
        mount(defineComponent({
            setup() {
                resolved = useId(undefined, '');
                return () => h('div');
            },
        }));
        expect(resolved).toBeTruthy();
        expect(resolved!.startsWith('vc-')).toBe(false);
    });
});
