// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { nextTick, ref } from 'vue';
import { bindColorMode } from '../../../src/composables/use-color-mode';
import type { ColorMode } from '../../../src/composables/use-color-mode';

describe('bindColorMode', () => {
    afterEach(() => {
        document.documentElement.classList.remove('dark', 'light');
    });

    it('exposes mode that proxies to the source', () => {
        const source = ref<ColorMode>('dark');
        const { mode } = bindColorMode(source, { syncClass: false });
        expect(mode.value).toBe('dark');
        mode.value = 'light';
        expect(source.value).toBe('light');
    });

    it('resolves "light" / "dark" without consulting system preference', () => {
        const source = ref<ColorMode>('dark');
        const { resolved } = bindColorMode(source, { syncClass: false });
        expect(resolved.value).toBe('dark');
        source.value = 'light';
        expect(resolved.value).toBe('light');
    });

    it('isDark mirrors resolved and writes back to source', () => {
        const source = ref<ColorMode>('light');
        const { isDark } = bindColorMode(source, { syncClass: false });
        expect(isDark.value).toBe(false);
        isDark.value = true;
        expect(source.value).toBe('dark');
        isDark.value = false;
        expect(source.value).toBe('light');
    });

    it('toggle flips between light and dark from system mode', () => {
        const source = ref<ColorMode>('system');
        const { toggle, resolved } = bindColorMode(source, { syncClass: false });
        const initial = resolved.value;
        toggle();
        expect(source.value).toBe(initial === 'dark' ? 'light' : 'dark');
    });

    it('syncs the .dark / .light class on <html> when syncClass is true', async () => {
        const source = ref<ColorMode>('dark');
        bindColorMode(source, { syncClass: true });
        await nextTick();
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        source.value = 'light';
        await nextTick();
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('skips class sync when syncClass is false', async () => {
        const source = ref<ColorMode>('dark');
        bindColorMode(source, { syncClass: false });
        await nextTick();
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
