import { useState } from '#app';
import { watch } from 'vue';

export type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'vuecs-color-mode';

export function useColorMode() {
    const mode = useState<ColorMode>('color-mode', () => 'light');

    if (import.meta.client) {
        const stored = globalThis.localStorage?.getItem(STORAGE_KEY) as ColorMode | null;
        if (stored === 'light' || stored === 'dark') {
            mode.value = stored;
        }

        const apply = (value: ColorMode) => {
            const root = globalThis.document?.documentElement;
            if (!root) return;
            root.classList.toggle('dark', value === 'dark');
            globalThis.localStorage?.setItem(STORAGE_KEY, value);
        };

        apply(mode.value);
        watch(mode, apply);
    }

    const toggle = () => {
        mode.value = mode.value === 'dark' ? 'light' : 'dark';
    };

    return { mode, toggle };
}
