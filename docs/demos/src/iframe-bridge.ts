import { isObject } from '@vuecs/core';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { applyDemoColorPalette } from './shared';

/*
 * Iframe runtime — runs inside each demo and coordinates with the parent
 * docs page via postMessage:
 *
 *   parent → iframe { type: 'set-color-mode', mode: 'light' | 'dark' }
 *   parent → iframe { type: 'set-variants', values: { <variantName>: <value> } }
 *   parent → iframe { type: 'set-props',    values: { <propPath>: <value> } }
 *   parent → iframe { type: 'set-palette', primary?, neutral? }
 *   iframe → parent { type: 'demo-resize', height: number }
 *   iframe → parent { type: 'demo-variants', catalog, defaults }
 *   iframe → parent { type: 'demo-props',    catalog, defaults }
 *
 * The parents (`Demo.vue` for passive showcases, `Playground.vue` for
 * interactive sandboxes) both listen for `demo-resize` to size the
 * iframe to its content. Only `Playground.vue` listens for
 * `demo-variants` (renders variant dropdowns) and `demo-props` (renders
 * rich type-aware controls); `Demo.vue` ignores those — passive demos
 * have no toolbar. The iframe listens for `set-color-mode` to flip the
 * `.dark` class on `<html>`, for `set-variants` to update
 * `variantState`, and for `set-props` to update `propState` — both of
 * which any demo can `import` and bind to its component.
 *
 * Origin handling: outgoing `postMessage` calls use `location.origin` as
 * the targetOrigin (not `'*'`), so the message is delivered only when
 * the parent serves the iframe from the same origin — which is always
 * the case for the vuecs.dev docs deploy. Cross-origin embedders never
 * receive height or variant catalog data.
 *
 * Incoming messages from `window.parent` are gated on
 * `event.origin === location.origin` for the same reason: a malicious
 * page that iframes ours can't trigger color-mode/variant/palette
 * mutations. `event.source === window.parent` is also checked as a
 * defense-in-depth against same-origin sibling frames.
 */

export type PropBooleanSpec = {
    type: 'boolean',
    default: boolean,
    section?: string,
    label?: string,
};
export type PropEnumSpec = {
    type: 'enum',
    default: string,
    options: readonly string[],
    section?: string,
    label?: string,
};
export type PropNumberSpec = {
    type: 'number',
    default: number,
    min?: number,
    max?: number,
    step?: number,
    section?: string,
    label?: string,
};
export type PropStringSpec = {
    type: 'string',
    default: string,
    section?: string,
    label?: string,
    placeholder?: string,
};
export type PropSpec = PropBooleanSpec | PropEnumSpec | PropNumberSpec | PropStringSpec;
export type PropCatalog = Record<string, PropSpec>;
export type PropValues = Record<string, boolean | string | number>;

type ParentMessage =    | { type: 'set-color-mode', mode: 'light' | 'dark' } |
    { type: 'set-variants', values: Record<string, string> } |
    { type: 'set-props', values: PropValues } |
    {
        type: 'set-palette',
        primary?: string,
        neutral?: string
    };

type VariantCatalog = Record<string, readonly string[]>;
type VariantValues = Record<string, string>;

/**
 * Reactive variant values, updated when the parent posts `set-variants`.
 * Demos that only switch theme variants can `import { variantState }` and
 * pass it as `:theme-variant="variantState"` on their VC* component.
 *
 * For demos with richer prop controls (booleans, numbers, nested
 * `themeVariant.size` paths), use `propState` instead — it carries the
 * full payload as a nested object you can spread with `v-bind`.
 */
export const variantState: Ref<VariantValues> = ref({});

/**
 * Reactive prop values, updated when the parent posts `set-props`.
 * Built from the catalog announced via `announceProps`. Dot-pathed keys
 * (`themeVariant.size`) are nested into objects, so a demo can write:
 *
 *     <VCPagination v-bind="propState" />
 *
 * and every announced prop — `total`, `limit`, `themeVariant`, etc. —
 * becomes interactive.
 */
export const propState: Ref<Record<string, unknown>> = ref({});

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
        window.parent.postMessage(
            { type: 'demo-resize', height: next },
            window.location.origin,
        );
    });
};

const applyColorMode = (mode: 'light' | 'dark'): void => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    // Mode flip can change line-heights / icon dimensions; re-measure.
    postHeight();
};

/**
 * Walk dot-path keys (`themeVariant.size`) and build a nested object so
 * the demo's `v-bind="propState"` spreads top-level scalars and passes
 * the nested objects intact (`themeVariant` becomes `{ size, variant }`).
 */
const buildNestedState = (values: PropValues): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(values)) {
        const parts = key.split('.');
        if (parts.length === 1) {
            result[key] = value;
            continue;
        }
        let cursor: Record<string, unknown> = result;
        for (let i = 0; i < parts.length - 1; i += 1) {
            const part = parts[i];
            if (!isObject(cursor[part])) {
                cursor[part] = {};
            }
            cursor = cursor[part] as Record<string, unknown>;
        }
        cursor[parts[parts.length - 1]] = value;
    }
    return result;
};

const handleParentMessage = (event: MessageEvent<ParentMessage>): void => {
    // Reject cross-origin messages outright. Demos are same-origin with
    // the docs host, so any other origin means an unintended embedder.
    if (event.origin !== window.location.origin) return;
    // Defense-in-depth: only accept messages from our actual parent,
    // not sibling same-origin frames.
    if (event.source !== window.parent) return;
    const { data } = event;
    if (!isObject(data)) return;
    if (data.type === 'set-color-mode') {
        applyColorMode(data.mode);
    } else if (data.type === 'set-variants') {
        variantState.value = { ...data.values };
    } else if (data.type === 'set-props') {
        propState.value = buildNestedState(data.values);
    } else if (data.type === 'set-palette') {
        // Live runtime palette swap — rewrites `--vc-color-<scale>-*` so
        // all currently-mounted components re-tint without theme
        // re-resolution. The docs site is Tailwind-pinned; per-theme
        // proof lives in the runnable apps under `examples/`.
        const palette: Record<string, string> = {};
        if (data.primary) palette.primary = data.primary;
        if (data.neutral) palette.neutral = data.neutral;
        applyDemoColorPalette(palette);
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
 *
 * Convenience wrapper for the most common case: an enum-only catalog
 * driving `:theme-variant`. For richer demos with booleans, numbers, or
 * mixed prop families, use `announceProps` instead.
 */
export function announceVariants(catalog: VariantCatalog, defaults: VariantValues): void {
    if (typeof window === 'undefined' || window.parent === window) return;
    variantState.value = { ...defaults };
    window.parent.postMessage(
        {
            type: 'demo-variants',
            catalog,
            defaults,
        },
        window.location.origin,
    );
}

/**
 * Announce a typed prop catalog so the parent can render rich controls
 * (toggle / select / slider / text input) per prop. Updates flow back
 * via `set-props` and surface as `propState` — the demo binds it with
 * `v-bind="propState"` so every announced prop becomes interactive.
 *
 * Dot-path keys (`themeVariant.size`) auto-build nested objects, so you
 * can group variant axes under their parent prop without ad-hoc plumbing.
 */
export function announceProps(catalog: PropCatalog, defaults: PropValues): void {
    if (typeof window === 'undefined' || window.parent === window) return;
    propState.value = buildNestedState(defaults);
    window.parent.postMessage(
        {
            type: 'demo-props',
            catalog,
            defaults,
        },
        window.location.origin,
    );
}

export function installIframeBridge(): void {
    if (typeof window === 'undefined' || window.parent === window) return;

    window.addEventListener('message', handleParentMessage);

    // Watch DOM size changes so animated mounts (overlays, transitions) keep
    // the parent iframe's height in sync.
    const ro = new ResizeObserver(postHeight);
    ro.observe(document.documentElement);

    // Variant / prop changes can reflow the demo (e.g. size: lg shifts
    // heights); re-measure on mutation.
    watch(variantState, () => postHeight(), { deep: true });
    watch(propState, () => postHeight(), { deep: true });

    // Fire an initial measurement once layout settles.
    requestAnimationFrame(postHeight);
}
