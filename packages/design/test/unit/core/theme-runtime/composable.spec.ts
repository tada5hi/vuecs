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
import { bindColorMode } from '../../../../src/core/color-mode/bind';
import type { ColorMode } from '../../../../src/core/color-mode/types';
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

describe('bindColorMode — theme dispatch (plan 021)', () => {
    afterEach(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.removeAttribute('data-bs-theme');
        document.documentElement.removeAttribute('data-theme');
    });

    it('fires every installed theme\'s colorMode.handle on the initial mount', async () => {
        const bsApply = vi.fn();
        const bulmaApply = vi.fn();
        const manager: MockThemeManager = {
            themes: [
                { colorMode: { handle: bsApply } },
                { colorMode: { handle: bulmaApply } },
            ],
        };

        const source = ref<ColorMode>('dark');
        const { unmount } = mountWithManager(manager, () => {
            bindColorMode(source);
        });
        await nextTick();

        expect(bsApply).toHaveBeenCalledWith(document, 'dark');
        expect(bulmaApply).toHaveBeenCalledWith(document, 'dark');
        unmount();
    });

    it('re-dispatches on mode change', async () => {
        const handle = vi.fn();
        const manager: MockThemeManager = { themes: [{ colorMode: { handle } }] };

        const source = ref<ColorMode>('light');
        const { unmount } = mountWithManager(manager, () => {
            bindColorMode(source);
        });
        await nextTick();
        expect(handle).toHaveBeenLastCalledWith(document, 'light');

        source.value = 'dark';
        await nextTick();
        expect(handle).toHaveBeenLastCalledWith(document, 'dark');
        unmount();
    });

    it('fires hooks in install order (left-to-right)', async () => {
        const calls: string[] = [];
        const manager: MockThemeManager = {
            themes: [
                { colorMode: { handle: () => calls.push('A') } },
                { colorMode: { handle: () => calls.push('B') } },
                { colorMode: { handle: () => calls.push('C') } },
            ],
        };

        const source = ref<ColorMode>('dark');
        const { unmount } = mountWithManager(manager, () => {
            bindColorMode(source);
        });
        await nextTick();

        expect(calls).toEqual(['A', 'B', 'C']);
        unmount();
    });

    it('skips themes without a colorMode hook', async () => {
        const handle = vi.fn();
        const manager: MockThemeManager = {
            themes: [
                {}, // no colorMode
                { colorMode: { handle } },
                {}, // no colorMode
            ],
        };

        const source = ref<ColorMode>('dark');
        const { unmount } = mountWithManager(manager, () => {
            bindColorMode(source);
        });
        await nextTick();

        expect(handle).toHaveBeenCalledTimes(1);
        expect(handle).toHaveBeenCalledWith(document, 'dark');
        unmount();
    });

    it('no-ops when no ThemeManager is installed', async () => {
        // No manager provided — nothing to dispatch through. Should not throw.
        const source = ref<ColorMode>('dark');
        const { unmount } = mountWithManager(undefined, () => {
            bindColorMode(source);
        });
        await nextTick();

        // The .dark class still toggles (that's the design-system-level behaviour).
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        unmount();
    });

    it('reactively picks up themes added via setThemes (without mode change)', async () => {
        const handle = vi.fn();
        const themes = ref<ThemeRuntimeEntry[]>([]);
        const manager: MockThemeManager = {
            get themes() {
                return themes.value;
            },
        } as unknown as MockThemeManager;

        const source = ref<ColorMode>('dark');
        const { unmount } = mountWithManager(manager, () => {
            bindColorMode(source);
        });
        await nextTick();
        // No themes installed yet → no dispatch.
        expect(handle).not.toHaveBeenCalled();

        // Install a theme at runtime; the watch source includes a getter
        // for `manager.themes`, so the swap alone re-fires the watcher.
        // No mode change required.
        themes.value = [{ colorMode: { handle } }];
        await nextTick();

        expect(handle).toHaveBeenCalledWith(document, 'dark');
        unmount();
    });

    it('reproduces the data-bs-theme mirror that theme-bootstrap declares', async () => {
        const manager: MockThemeManager = {
            themes: [
                {
                    colorMode: {
                        handle(doc, mode) {
                            doc.documentElement.setAttribute('data-bs-theme', mode);
                        },
                    },
                },
            ],
        };

        const source = ref<ColorMode>('dark');
        const { unmount } = mountWithManager(manager, () => {
            bindColorMode(source);
        });
        await nextTick();
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');

        source.value = 'light';
        await nextTick();
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
        unmount();
    });
});
