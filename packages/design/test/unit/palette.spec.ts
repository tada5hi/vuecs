// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { nextTick, ref } from 'vue';
import {
    COLOR_PALETTE_STYLE_ELEMENT_ID,
    applyColorPaletteCss,
    bindColorPalette,
} from '../../src/palette';

describe('applyColorPaletteCss', () => {
    afterEach(() => {
        document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.remove();
    });

    it('is a no-op when no document is provided', () => {
        expect(() => applyColorPaletteCss(':root { --x: 1; }', undefined)).not.toThrow();
    });

    it('inserts a <style id="vc-color-palette"> on first call', () => {
        applyColorPaletteCss(':root { --x: 1; }');
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style).not.toBeNull();
        expect(style!.tagName).toBe('STYLE');
        expect(style!.textContent).toBe(':root { --x: 1; }');
    });

    it('replaces the existing <style> content on subsequent calls', () => {
        applyColorPaletteCss(':root { --x: 1; }');
        applyColorPaletteCss(':root { --x: 2; }');
        const styles = document.querySelectorAll(`style#${COLOR_PALETTE_STYLE_ELEMENT_ID}`);
        expect(styles.length).toBe(1);
        expect(styles[0].textContent).toBe(':root { --x: 2; }');
    });
});

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
});
