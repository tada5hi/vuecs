// @vitest-environment jsdom
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import { nextTick, ref } from 'vue';
import { bindPalette } from '../../../src/composables/use-palette';
import { PALETTE_STYLE_ELEMENT_ID } from '../../../src/constants';
import type { PaletteConfig } from '../../../src/types';

describe('bindPalette', () => {
    afterEach(() => {
        document.getElementById(PALETTE_STYLE_ELEMENT_ID)?.remove();
    });

    it('applies the initial palette to the DOM on bind', () => {
        const source = ref<PaletteConfig>({ primary: 'green' });
        bindPalette(source);
        const style = document.getElementById(PALETTE_STYLE_ELEMENT_ID);
        expect(style?.textContent).toContain('--vc-color-primary-500: var(--color-green-500);');
    });

    it('re-applies on every source mutation', async () => {
        const source = ref<PaletteConfig>({ primary: 'blue' });
        bindPalette(source);
        source.value = { primary: 'rose' };
        await nextTick();
        const style = document.getElementById(PALETTE_STYLE_ELEMENT_ID);
        expect(style?.textContent).toContain('--vc-color-primary-500: var(--color-rose-500);');
        expect(style?.textContent).not.toContain('--color-blue-500');
    });

    it('set() replaces the entire palette (drops scales not in payload)', () => {
        const source = ref<PaletteConfig>({ primary: 'blue', neutral: 'zinc' });
        const { current, set } = bindPalette(source);
        set({ primary: 'orange' });
        expect(current.value).toEqual({ primary: 'orange' });
    });

    it('extend() shallow-merges partial over current (preserves untouched scales)', () => {
        const source = ref<PaletteConfig>({ primary: 'blue', neutral: 'zinc' });
        const { current, extend } = bindPalette(source);
        extend({ primary: 'green' });
        expect(current.value).toEqual({ primary: 'green', neutral: 'zinc' });
    });

    it('set({}) resets all scale assignments', () => {
        const source = ref<PaletteConfig>({ primary: 'blue', neutral: 'zinc' });
        const { current, set } = bindPalette(source);
        set({});
        expect(current.value).toEqual({});
    });
});

describe('usePalette (localStorage-backed)', () => {
    beforeEach(() => {
        localStorage.clear();
        document.getElementById(PALETTE_STYLE_ELEMENT_ID)?.remove();
    });

    it('drops unknown scales and non-Tailwind palette names from persisted JSON', async () => {
        // Tamper with localStorage before the composable mounts.
        localStorage.setItem(
            'vc-palette',
            JSON.stringify({
                primary: 'green', 
                bogus: 'totally-fake', 
                neutral: 'not-a-palette', 
            }),
        );
        // Fresh module import per spec — createSharedComposable caches the result.
        const { usePalette } = await import('../../../src/composables/use-palette');
        const { current } = usePalette();
        expect(current.value).toEqual({ primary: 'green' });
    });
});
