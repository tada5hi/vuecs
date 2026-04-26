import { setPalette } from '@vuecs/design';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

/*
 * Iframe runtime — runs inside each demo and coordinates with the parent
 * docs page via postMessage:
 *
 *   parent → iframe { type: 'set-color-mode', mode: 'light' | 'dark' }
 *   parent → iframe { type: 'set-variants', values: { <variantName>: <value> } }
 *   iframe → parent { type: 'demo-resize', height: number }
 *   iframe → parent { type: 'demo-variants', catalog, defaults }
 *
 * The parent (`Demo.vue`) listens for `demo-resize` to size the iframe to
 * its content; for `demo-variants` to render variant dropdowns in the
 * toolbar. The iframe listens for `set-color-mode` to flip the `.dark`
 * class on `<html>` and for `set-variants` to update `variantState` —
 * which any demo Vue component can `import` and bind to its
 * `:theme-variant` prop.
 *
 * Origin is intentionally `'*'` — the iframe is same-origin in production
 * (served from the same docs host), and dev runs on localhost. No
 * untrusted parties are involved.
 */

type ParentMessage =    | { type: 'set-color-mode', mode: 'light' | 'dark' } |
    { type: 'set-variants', values: Record<string, string> } |
    {
        type: 'set-palette', 
        primary?: string, 
        neutral?: string 
    };

type VariantCatalog = Record<string, readonly string[]>;
type VariantValues = Record<string, string>;

/**
 * Reactive variant values, updated when the parent posts `set-variants`.
 * Demos that support variant switching: `import { variantState }` and
 * pass it as `:theme-variant="variantState"` on their VC* component.
 */
export const variantState: Ref<VariantValues> = ref({});

let pendingHeight: number | null = null;
let rafHandle: number | null = null;

const postHeight = (): void => {
    if (typeof window === 'undefined' || window.parent === window) return;
    const next = document.documentElement.scrollHeight;
    if (next === pendingHeight) return;
    pendingHeight = next;
    if (rafHandle !== null) cancelAnimationFrame(rafHandle);
    rafHandle = requestAnimationFrame(() => {
        rafHandle = null;
        window.parent.postMessage({ type: 'demo-resize', height: next }, '*');
    });
};

const applyColorMode = (mode: 'light' | 'dark'): void => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    // Mode flip can change line-heights / icon dimensions; re-measure.
    postHeight();
};

const handleParentMessage = (event: MessageEvent<ParentMessage>): void => {
    const { data } = event;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'set-color-mode') {
        applyColorMode(data.mode);
    } else if (data.type === 'set-variants') {
        variantState.value = { ...data.values };
    } else if (data.type === 'set-palette') {
        // Live runtime palette swap — rewrites `--vc-color-<scale>-*`
        // CSS custom props to point at a different Tailwind palette.
        // No theme re-resolution; CSS handles it via `var()` indirection.
        const palette: Record<string, string> = {};
        if (data.primary) palette.primary = data.primary;
        if (data.neutral) palette.neutral = data.neutral;
        setPalette(palette as Parameters<typeof setPalette>[0]);
        postHeight();
    }
};

/**
 * Announce this demo's variant catalog + defaults so the parent docs
 * page can render dropdowns in its toolbar. Call once after `app.mount()`,
 * BEFORE `installIframeBridge()` (or right after — order is forgiving as
 * long as it happens during initial load).
 *
 * The first key in `catalog` is rendered first in the toolbar; pass
 * keys in display order.
 */
export function announceVariants(catalog: VariantCatalog, defaults: VariantValues): void {
    if (typeof window === 'undefined' || window.parent === window) return;
    variantState.value = { ...defaults };
    window.parent.postMessage({
        type: 'demo-variants', 
        catalog, 
        defaults, 
    }, '*');
}

export function installIframeBridge(): void {
    if (typeof window === 'undefined' || window.parent === window) return;

    window.addEventListener('message', handleParentMessage);

    // Watch DOM size changes so animated mounts (overlays, transitions) keep
    // the parent iframe's height in sync.
    const ro = new ResizeObserver(postHeight);
    ro.observe(document.documentElement);

    // Variant changes can reflow the demo (e.g. size: lg shifts heights);
    // re-measure on mutation.
    watch(variantState, () => postHeight(), { deep: true });

    // Fire an initial measurement once layout settles.
    requestAnimationFrame(postHeight);
}
