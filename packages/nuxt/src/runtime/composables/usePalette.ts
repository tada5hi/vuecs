import { ref } from 'vue';
import type { Ref } from 'vue';
import { setPalette as setPaletteCss } from '@vuecs/design';
import type { PaletteConfig } from '@vuecs/design';
// @ts-expect-error resolved by Nuxt at build time
import { useRuntimeConfig } from '#imports';

export interface UsePaletteReturn {
    /**
     * Current palette — reflects the server-rendered value on first load,
     * updated by `setPalette()`.
     */
    current: Ref<PaletteConfig>;

    /**
     * Apply a new palette at runtime. On the client this mutates a
     * `<style id="vc-palette">` element in `<head>`; on the server this
     * is a no-op (SSR reads the palette via `appConfig` / `runtimeConfig`).
     */
    setPalette(palette: PaletteConfig): void;
}

export function usePalette(): UsePaletteReturn {
    const config = useRuntimeConfig();
    const initial = (config.public.vuecs?.palette || {}) as PaletteConfig;
    const current = ref<PaletteConfig>({ ...initial }) as Ref<PaletteConfig>;

    function setPalette(palette: PaletteConfig): void {
        current.value = palette;
        setPaletteCss(palette);
    }

    return { current, setPalette };
}
