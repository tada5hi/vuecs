// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    createApp,
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { COLOR_PALETTE_STYLE_ELEMENT_ID } from '../../../../src/core/color-palette/apply';
import { useColorPaletteUnshared } from '../../../../src/core/color-palette/composable';
import type { ThemeRuntimeEntry } from '../../../../src/core/theme-runtime/types';

const THEME_MANAGER_SYMBOL = Symbol.for('VCThemeManager');

interface MockThemeManager {
    themes: ThemeRuntimeEntry[];
}

function mountWithManager(
    manager: MockThemeManager | undefined,
    setupFn: () => void,
): { unmount: () => void } {
    const app = createApp(defineComponent({
        setup() {
            setupFn();
            return () => h('div');
        },
    }));
    if (manager) {
        app.provide(THEME_MANAGER_SYMBOL, manager);
    }
    const root = document.createElement('div');
    app.mount(root);
    return {
        unmount() {
            app.unmount();
            root.remove();
        },
    };
}

function readPaletteStyle(): string {
    return document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.textContent ?? '';
}

let nextStorageKey = 0;
function freshStorageKey(): string {
    nextStorageKey += 1;
    return `vc-color-palette-test-${nextStorageKey}`;
}

describe('useColorPalette (generic dispatcher) — plan 021 slice 2', () => {
    afterEach(() => {
        document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.remove();
        document.documentElement.removeAttribute('data-bs-theme');
    });

    it('writes nothing when no theme declares palette.handle', async () => {
        const manager: MockThemeManager = { themes: [{}, {}] };
        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(readPaletteStyle()).toBe('');
        unmount();
    });

    it('writes the renderer output when a theme declares palette.handle', async () => {
        const handle = vi.fn((palette: Record<string, string>) => `:root { --primary: ${palette.primary}; }`);
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };

        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(handle).toHaveBeenCalledWith({ primary: 'blue' });
        expect(readPaletteStyle()).toContain('--primary: blue');
        unmount();
    });

    it('concatenates outputs from every theme that declares palette.handle', async () => {
        const tailwindRender = (p: Record<string, string>) => `/* tailwind */ :root { --tw-primary: ${p.primary}; }`;
        const bulmaRender = (p: Record<string, string>) => `/* bulma */ :root { --bulma-primary: ${p.primary}; }`;
        const manager: MockThemeManager = {
            themes: [
                { palette: { handle: tailwindRender } },
                { palette: { handle: bulmaRender } },
            ],
        };

        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared({
                initial: { primary: 'green' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        const css = readPaletteStyle();
        expect(css).toContain('--tw-primary: green');
        expect(css).toContain('--bulma-primary: green');
        // Tailwind block precedes Bulma block (install order).
        expect(css.indexOf('--tw-primary')).toBeLessThan(css.indexOf('--bulma-primary'));
        unmount();
    });

    it('skips themes that omit palette.handle but include other hooks', async () => {
        const handle = vi.fn((p: Record<string, string>) => `:root { --primary: ${p.primary}; }`);
        const manager: MockThemeManager = {
            themes: [
                { colorMode: { handle: () => {} } }, // colorMode-only, no palette
                { palette: { handle } },
                {}, // empty
            ],
        };

        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared({
                initial: { primary: 'red' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(handle).toHaveBeenCalledTimes(1);
        expect(readPaletteStyle()).toBe(':root { --primary: red; }');
        unmount();
    });

    it('re-renders when the palette changes via set()', async () => {
        const handle = (p: Record<string, string>) => `:root { --primary: ${p.primary}; }`;
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };

        let api: ReturnType<typeof useColorPaletteUnshared> | undefined;
        const { unmount } = mountWithManager(manager, () => {
            api = useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(readPaletteStyle()).toContain('--primary: blue');

        api!.set({ primary: 'green' });
        await nextTick();
        expect(readPaletteStyle()).toContain('--primary: green');
        unmount();
    });

    it('re-renders when extend() is used to merge a partial', async () => {
        const handle = (p: Record<string, string>) => `:root { --primary: ${p.primary}; --neutral: ${p.neutral}; }`;
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };

        let api: ReturnType<typeof useColorPaletteUnshared> | undefined;
        const { unmount } = mountWithManager(manager, () => {
            api = useColorPaletteUnshared({
                initial: { primary: 'blue', neutral: 'zinc' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(readPaletteStyle()).toContain('--primary: blue');
        expect(readPaletteStyle()).toContain('--neutral: zinc');

        api!.extend({ primary: 'orange' });
        await nextTick();
        expect(readPaletteStyle()).toContain('--primary: orange');
        // Other keys preserved by shallow merge default.
        expect(readPaletteStyle()).toContain('--neutral: zinc');
        unmount();
    });

    it('reactively picks up themes added via setThemes', async () => {
        const handle = vi.fn((p: Record<string, string>) => `:root { --primary: ${p.primary}; }`);
        const themesRef = ref<ThemeRuntimeEntry[]>([]);
        const manager = {
            get themes() {
                return themesRef.value;
            },
        } as unknown as MockThemeManager;

        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        // No theme installed initially → empty.
        expect(readPaletteStyle()).toBe('');
        expect(handle).not.toHaveBeenCalled();

        themesRef.value = [{ palette: { handle } }];
        await nextTick();
        expect(handle).toHaveBeenCalledWith({ primary: 'blue' });
        expect(readPaletteStyle()).toContain('--primary: blue');
        unmount();
    });

    it('no-ops gracefully when no ThemeManager is installed', async () => {
        const { unmount } = mountWithManager(undefined, () => {
            useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(readPaletteStyle()).toBe('');
        unmount();
    });

    it('applies sanitize to the initial palette', async () => {
        const handle = (p: Record<string, string>) => `:root { --primary: ${p.primary ?? 'unset'}; }`;
        const sanitize = (raw: unknown): { primary?: string } => {
            if (!raw || typeof raw !== 'object') return {};
            const input = raw as Record<string, unknown>;
            // Only allow specific palette names.
            if (typeof input.primary === 'string' && ['blue', 'green'].includes(input.primary)) {
                return { primary: input.primary };
            }
            return {};
        };
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };

        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared<{ primary?: string }>({
                initial: { primary: 'INVALID' as string },
                persist: false,
                storageKey: freshStorageKey(),
                sanitize,
            });
        });
        await nextTick();
        // Sanitize stripped the invalid value.
        expect(readPaletteStyle()).toContain('--primary: unset');
        unmount();
    });

    it('exposes current() reactively', async () => {
        const handle = (p: Record<string, string>) => `:root { --primary: ${p.primary}; }`;
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };

        let api: ReturnType<typeof useColorPaletteUnshared> | undefined;
        const { unmount } = mountWithManager(manager, () => {
            api = useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
            });
        });
        await nextTick();
        expect(api!.current.value).toEqual({ primary: 'blue' });

        api!.set({ primary: 'red' });
        await nextTick();
        expect(api!.current.value).toEqual({ primary: 'red' });
        unmount();
    });

    it('forwards a static nonce string to the rendered <style>', async () => {
        const handle = (p: Record<string, string>) => `:root { --primary: ${p.primary}; }`;
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };

        const { unmount } = mountWithManager(manager, () => {
            useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
                nonce: 'csp-static',
            });
        });
        await nextTick();
        const style = document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID);
        expect(style?.getAttribute('nonce')).toBe('csp-static');
        unmount();
    });

    it('invokes a nonce getter on each render — supports reactive nonce', async () => {
        const handle = (p: Record<string, string>) => `:root { --primary: ${p.primary}; }`;
        const manager: MockThemeManager = { themes: [{ palette: { handle } }] };
        const nonceRef = ref<string | undefined>('initial');

        let api: ReturnType<typeof useColorPaletteUnshared> | undefined;
        const { unmount } = mountWithManager(manager, () => {
            api = useColorPaletteUnshared({
                initial: { primary: 'blue' },
                persist: false,
                storageKey: freshStorageKey(),
                nonce: () => nonceRef.value,
            });
        });
        await nextTick();
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.getAttribute('nonce')).toBe('initial');

        nonceRef.value = 'rotated';
        api!.set({ primary: 'green' });
        await nextTick();
        expect(document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.getAttribute('nonce')).toBe('rotated');
        unmount();
    });
});
