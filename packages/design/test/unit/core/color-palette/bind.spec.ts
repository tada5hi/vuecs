// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { nextTick, ref } from 'vue';
import { COLOR_PALETTE_STYLE_ELEMENT_ID } from '../../../../src/core/color-palette/apply';
import { bindColorPalette } from '../../../../src/core/color-palette/bind';

describe('bindColorPalette (generic)', () => {
    afterEach(() => {
        document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.remove();
    });

    type FakePalette = { primary?: string };
    const renderFake = (p: FakePalette) => (
        p.primary ? `:root { --primary: ${p.primary}; }` : ''
    );
    const shallowMerge = <T>(current: T, partial: Partial<T>): T => ({ ...current, ...partial });

    it('renders + applies the initial value', () => {
        const source = ref<FakePalette>({ primary: 'green' });
        bindColorPalette(source, { render: renderFake, extend: shallowMerge });
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.textContent).toBe(':root { --primary: green; }');
    });

    it('re-renders on source mutation', async () => {
        const source = ref<FakePalette>({ primary: 'blue' });
        bindColorPalette(source, { render: renderFake, extend: shallowMerge });
        source.value = { primary: 'rose' };
        await nextTick();
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.textContent).toBe(':root { --primary: rose; }');
    });

    it('set() replaces the entire value', () => {
        const source = ref<FakePalette>({ primary: 'blue' });
        const { current, set } = bindColorPalette(source, { render: renderFake, extend: shallowMerge });
        set({ primary: 'orange' });
        expect(current.value).toEqual({ primary: 'orange' });
    });

    it('extend() applies the supplied merge function', () => {
        type MultiKey = { primary?: string; neutral?: string };
        const source = ref<MultiKey>({ primary: 'blue', neutral: 'zinc' });
        const { current, extend } = bindColorPalette(source, {
            render: () => '',
            extend: shallowMerge,
        });
        extend({ primary: 'green' });
        expect(current.value).toEqual({ primary: 'green', neutral: 'zinc' });
    });

    it('extend() honors a custom (e.g. replace) merge implementation', () => {
        type MultiKey = { primary?: string; neutral?: string };
        const source = ref<MultiKey>({ primary: 'blue', neutral: 'zinc' });
        const { current, extend } = bindColorPalette(source, {
            render: () => '',
            extend: (_current, partial) => partial as MultiKey,
        });
        extend({ primary: 'green' });
        expect(current.value).toEqual({ primary: 'green' });
    });

    it('set({}) resets to an empty object value', () => {
        type MultiKey = { primary?: string; neutral?: string };
        const source = ref<MultiKey>({ primary: 'blue', neutral: 'zinc' });
        const { current, set } = bindColorPalette(source, { render: () => '', extend: shallowMerge });
        set({});
        expect(current.value).toEqual({});
    });

    it('forwards a static nonce string to the <style> element', () => {
        const source = ref<FakePalette>({ primary: 'red' });
        bindColorPalette(source, {
            render: renderFake,
            extend: shallowMerge,
            nonce: 'static-nonce',
        });
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.getAttribute('nonce')).toBe('static-nonce');
    });

    it('invokes the nonce getter on each re-render (reactive nonce support)', async () => {
        const nonceRef = ref<string | undefined>('first');
        const source = ref<FakePalette>({ primary: 'red' });
        bindColorPalette(source, {
            render: renderFake,
            extend: shallowMerge,
            nonce: () => nonceRef.value,
        });
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.getAttribute('nonce')).toBe('first');

        // Mutate the source — getter is invoked again with the new nonce.
        nonceRef.value = 'second';
        source.value = { primary: 'green' };
        await nextTick();
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.getAttribute('nonce')).toBe('second');
    });

    it('re-applies the <style> nonce on nonce-only changes (no source mutation)', async () => {
        const nonceRef = ref<string | undefined>('first');
        const source = ref<FakePalette>({ primary: 'red' });
        bindColorPalette(source, {
            render: renderFake,
            extend: shallowMerge,
            nonce: () => nonceRef.value,
        });
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.getAttribute('nonce')).toBe('first');

        // Rotate only the nonce — palette stays the same. Models a CSP
        // policy update via `setConfig({ nonce })`.
        nonceRef.value = 'rotated';
        await nextTick();
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.getAttribute('nonce')).toBe('rotated');

        // Clearing the nonce removes the attribute on the next nonce-only tick.
        nonceRef.value = undefined;
        await nextTick();
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.hasAttribute('nonce')).toBe(false);
    });

    it('omits the nonce attribute when the getter returns undefined', () => {
        const source = ref<FakePalette>({ primary: 'red' });
        bindColorPalette(source, {
            render: renderFake,
            extend: shallowMerge,
            nonce: () => undefined,
        });
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.hasAttribute('nonce')).toBe(false);
    });
});
