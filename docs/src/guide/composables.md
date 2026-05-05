# Composables

vuecs ships two families of Vue composables:

- **`@vuecs/core`** — primitives for building component wrappers (forwarders, focus / typeahead helpers, ID generation, state machines). Zero runtime deps beyond Vue 3.
- **`@vuecs/design`** — runtime color-mode state + generic palette primitives. **`@vuecs/theme-tailwind`** ships the Tailwind-catalog-specific `useColorPalette()`.

Both families run in any Vue 3 setup — VitePress, plain Vite, Astro, non-Nuxt SSR. The Nuxt module thin-wraps the design composables with cookie-backed storage for true SSR persistence.

## `@vuecs/core`

These composables are exported from `@vuecs/core`'s root entry (no subpath) alongside `useComponentTheme` and `useComponentDefaults`. Most are direct ports of [Reka UI](https://reka-ui.com/)'s shared utilities, kept in-tree so `@vuecs/core` stays zero-dep and so consumers don't need to install `reka-ui` to benefit from the patterns.

### `useForwardProps()`

Returns a `ComputedRef` of the wrapper's props with `undefined` values dropped, suitable for `v-bind`-ing onto an inner component without leaking `undefined` over the inner's defaults.

```ts
import { useForwardProps } from '@vuecs/core';

const Wrapper = defineComponent({
    props: {
        size: { type: String, default: 'md' },
        color: String,
    },
    setup(props) {
        const forwarded = useForwardProps(props);
        return () => h(Inner, forwarded.value);
    },
});
```

### `useEmitAsProps()`

Converts the wrapper's declared `emits` into a map of `onEventName` handler props. Use with `useForwardProps` (or via `useForwardPropsEmits`) when forwarding to an inner component.

```ts
import { useEmitAsProps } from '@vuecs/core';

setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit);
    // → { onChange: fn, 'onUpdate:modelValue': fn, ... }
}
```

### `useForwardPropsEmits()`

`useForwardProps` + `useEmitAsProps` in one call. Returns a `ComputedRef` ready for `v-bind`.

```ts
import { useForwardPropsEmits } from '@vuecs/core';

setup(props, { emit }) {
    const bound = useForwardPropsEmits(props, emit);
    return () => h(Inner, bound.value);
}
```

### `useForwardExpose()`

Re-exposes the inner element/component on the wrapper's `expose`. Returns a `forwardRef` to attach as `ref` on the inner component, plus reactive `currentRef` / `currentElement` accessors.

```ts
import { useForwardExpose } from '@vuecs/core';

setup() {
    const { forwardRef, currentElement } = useForwardExpose();
    return () => h(InnerPrimitive, { ref: forwardRef });
}
```

After this, the wrapper's template ref forwards through to whatever the inner primitive exposes (DOM element, exposed methods, etc.).

### `useArrowNavigation()`

Resolves the next focusable item in a collection given an `ArrowUp` / `ArrowDown` / `Home` / `End` keyboard event. Items are matched by a CSS selector (default `[data-vc-collection-item]`).

Items are skipped when any of the following is true:

- the native `disabled` attribute is set to anything other than `"false"`
- `aria-disabled="true"`
- the `data-disabled` attribute is present
- the `disabled` CSS class is present (`VCLink` toggles its disabled state via class, not attribute)
- the element fails `Element.checkVisibility()` — collapsed submenu items inside `display: none` ancestors are filtered out so arrow keys can't focus them. In environments without layout (jsdom, older browsers) the visibility check is treated as passing.

```ts
import { useArrowNavigation } from '@vuecs/core';

const onKeyDown = (event: KeyboardEvent) => {
    useArrowNavigation(event, event.target as HTMLElement, listRef.value, {
        arrowKeyOptions: 'vertical',
        focus: true,
        loop: true,
    });
};
```

Used internally by `@vuecs/navigation` for keyboard-driven nav between sibling items at any depth.

### `useTypeahead()`

Accumulates keystrokes for ~1 s and resolves the next item whose text starts with the buffer. Repeated single characters cycle through items starting with that character.

```ts
import { useTypeahead } from '@vuecs/core';

const { handleTypeaheadSearch, resetTypeahead } = useTypeahead();

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
        handleTypeaheadSearch(event.key, items);
    }
};
```

`getNextMatch` and `wrapArray` are also exported for custom matching loops.

### `useId()`

Thin wrapper around Vue 3.5's native `useId()` with a default `vc-` prefix. Pass a deterministic ID to short-circuit (useful for tests).

```ts
import { useId } from '@vuecs/core';

const id = useId();              // → 'vc-v-1'
const named = useId('my-id');    // → 'my-id'
const custom = useId(null, 'x'); // → 'x-v-2'
```

### `useStateMachine()`

Tiny state machine on top of `ref()`. Pass an initial state and a transition table; receive `state` and `dispatch`. Unknown events are ignored — they leave the state unchanged.

```ts
import { useStateMachine } from '@vuecs/core';

const { state, dispatch } = useStateMachine('closed', {
    closed: { OPEN: 'open' },
    open: { CLOSE: 'closed', TOGGLE: 'closed' },
} as const);

dispatch('OPEN'); // state.value === 'open'
```

Shipped as a Phase-3 prerequisite for the upcoming `@vuecs/overlays` package (open/closed transitions for modals, popovers, etc.).

## `@vuecs/design` and `@vuecs/theme-tailwind`

Framework-agnostic Vue composables for the two pieces of state consumers usually want to mutate at runtime: the active palette and the dark/light color mode. Color mode lives in `@vuecs/design` (theme-agnostic). Palette switching lives in `@vuecs/theme-tailwind` (Tailwind-catalog-specific) — but its building blocks are generic primitives in `@vuecs/design` so other themes can compose their own.

### Requirements

- **Vue 3** as a peer dep (already required by every component package).
- **`@vueuse/core`** as a peer dep of both packages.

```bash
npm install @vuecs/design @vueuse/core                  # color mode + generic palette primitives
npm install @vuecs/theme-tailwind                       # adds Tailwind setColorPalette / useColorPalette
```

### `useColorPalette()` (from `@vuecs/theme-tailwind`)

Reactive palette state with localStorage persistence. Wrapped via `createSharedComposable` — every call site shares the same ref + watcher, so picking a palette in one component updates every other consumer instantly.

```vue
<script setup lang="ts">
import { useColorPalette } from '@vuecs/theme-tailwind';

const { current, set, extend } = useColorPalette({
    initial: { primary: 'blue', neutral: 'neutral' },
});
</script>

<template>
    <p>Primary: {{ current.primary }}</p>
    <button @click="extend({ primary: 'green' })">Switch to green</button>
    <button @click="set({})">Reset to defaults</button>
</template>
```

#### API

```ts
interface UseColorPaletteOptions {
    /** Initial palette when no persisted value exists. Default: {} */
    initial?: ColorPaletteConfig;
    /** Persist via localStorage. Default: true */
    persist?: boolean;
    /** Storage key for the default backend. Default: 'vc-color-palette' */
    storageKey?: string;
}

interface UseColorPaletteReturn {
    /** Read-only view of the current palette assignment. */
    current: ComputedRef<ColorPaletteConfig>;
    /** Replace the entire palette. Pass `{}` to reset. */
    set(palette: ColorPaletteConfig): void;
    /** Shallow-merge — preserves scales not in `partial`. */
    extend(partial: ColorPaletteConfig): void;
}
```

#### `set` vs `extend`

| Verb | Semantic | Use when |
|------|----------|----------|
| `set({ primary: 'green' })` | Replace — drops every other scale | Resetting; full replacement; cookie/SSR scenarios where the source-of-truth is the new payload |
| `extend({ primary: 'green' })` | Shallow merge — keeps `neutral`, `success`, etc. | Per-scale UI controls (one slider per scale); typical interactive switching |

`extend()` mirrors the `extend()` marker in `@vuecs/core`'s theme system: same vocabulary, same "merge instead of replace" intent.

#### Persistence

Default backend is localStorage at the `vc-color-palette` key. Sanitization runs on every read — unknown scales and non-Tailwind palette names are dropped silently. To opt out:

```ts
const { current, set } = useColorPalette({ persist: false });
```

For SSR-readable persistence (e.g. Nuxt cookie), see [Custom storage backends](#custom-storage-backends) below.

### `useColorMode()` (from `@vuecs/design`)

Reactive light/dark/system mode with `<html>` class sync. Uses VueUse's `usePreferredDark` to resolve `'system'`.

```vue
<script setup lang="ts">
import { useColorMode } from '@vuecs/design';

const { mode, resolved, isDark, toggle } = useColorMode();
</script>

<template>
    <button @click="toggle">
        {{ isDark ? '🌞 Light' : '🌙 Dark' }}
    </button>
    <p>Selected: {{ mode }} (resolves to {{ resolved }})</p>
</template>
```

#### API

```ts
type ColorMode = 'light' | 'dark' | 'system';

interface UseColorModeOptions {
    /** Initial mode when no persisted value exists. Default: 'system' */
    initial?: ColorMode;
    /** Persist via localStorage. Default: true */
    persist?: boolean;
    /** Storage key. Default: 'vc-color-mode' */
    storageKey?: string;
    /** Toggle .dark / .light class on <html>. Default: true */
    syncClass?: boolean;
}

interface UseColorModeReturn {
    /** Selected mode — may be 'system'. */
    mode: WritableComputedRef<ColorMode>;
    /** Effective mode — never 'system'. */
    resolved: ComputedRef<'light' | 'dark'>;
    /** Convenience boolean. Writable: true → 'dark', false → 'light'. */
    isDark: WritableComputedRef<boolean>;
    /** Flip light ↔ dark. */
    toggle(): void;
}
```

### Custom storage backends

For SSR-readable persistence (cookies, request-aware storage), call the lower-level building blocks with any reactive `Ref`. `bindColorPalette` lives in `@vuecs/design` (generic — accepts a renderer); `bindColorMode` also lives there.

```ts
import { bindColorPalette, bindColorMode } from '@vuecs/design';
import { renderColorPaletteStyles } from '@vuecs/theme-tailwind';
```

Both accept a `Ref<T>` and return the same shape as the high-level composables:

```ts
// Generic — any palette catalog plugs its own renderer
function bindColorPalette<T>(
    source: Ref<T>,
    render: (value: T) => string,
): UseColorPaletteReturn<T>;

function bindColorMode(
    source: Ref<ColorMode>,
    options?: { syncClass?: boolean },
): UseColorModeReturn;
```

The Nuxt module pattern (`@vuecs/theme-tailwind-nuxt`'s `useColorPalette`):

```ts
// themes/tailwind-nuxt/src/runtime/composables/useColorPalette.ts
import { bindColorPalette } from '@vuecs/design';
import { renderColorPaletteStyles } from '@vuecs/theme-tailwind';
import { useCookie } from '#imports';

export function useColorPalette() {
    const cookie = useCookie<ColorPaletteConfig>('vc-color-palette', {
        default: () => ({}),
        watch: true,
    });
    return bindColorPalette(cookie, renderColorPaletteStyles);
}
```

Same return shape, SSR-aware persistence. The generic `bindColorPalette<T>` lets non-Tailwind themes plug in their own renderer (corporate fork with its own palette catalog, Material-You-style theme, etc.) without reimplementing the apply-on-watch logic.

### SSR notes

- The composables are **client-side stateful** — on the server, watchers are still installed but `setColorPalette()` / `applyColorPaletteCss()` is a DOM-only no-op, and `useStorage` from VueUse reads/writes nothing. The first reactive read on the client triggers the initial paint.
- For zero-FOUC palette / color mode on first paint, you need an SSR plugin that injects `<style id="vc-palette">` and `class="dark"|"light"` before client JS runs. `@vuecs/nuxt` ships the color-mode SSR plugin; `@vuecs/theme-tailwind-nuxt` ships the palette SSR plugin. Other SSR frameworks roll their own using `renderColorPaletteStyles()` from `@vuecs/theme-tailwind` (or any theme's renderer composed with `applyColorPaletteCss()` from `@vuecs/design`).
- VitePress / SSG hosts: there is currently a one-frame flash on first load when localStorage holds a non-default palette, since SSG'd HTML is fixed at build time. An inline pre-paint `<script>` helper is the planned fix; until then, accept the one-frame flash.

## See also

- [Design Tokens](/guide/design-tokens) — the CSS layer the composables drive
- [Dark Mode](/getting-started/dark-mode) — `.dark` flip mechanics
- [Nuxt `useColorPalette`](/nuxt/use-palette) — SSR-cookie variant
- [Nuxt `useColorMode`](/nuxt/use-color-mode) — SSR-cookie variant
