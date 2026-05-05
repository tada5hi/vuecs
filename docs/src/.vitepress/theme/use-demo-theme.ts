import { createSharedComposable } from '@vueuse/core';
import { ref } from 'vue';

export type DemoThemeName = 'tailwind' | 'bootstrap' | 'bulma';

/**
 * Shared reactive state for the iframe-demo theme picker. Lives outside
 * the SettingsModal so Demo.vue can `watch()` the same value and forward
 * changes to its iframe via postMessage.
 *
 * `createSharedComposable` makes every call site read/write the same ref —
 * mirrors the `useColorPalette` (from `@vuecs/theme-tailwind`) and `useColorMode`
 * (from `@vuecs/design`) pattern.
 */
export const useDemoTheme = createSharedComposable(() => {
    const current = ref<DemoThemeName>('tailwind');
    const set = (next: DemoThemeName) => {
        current.value = next;
    };
    return { current, set };
});
