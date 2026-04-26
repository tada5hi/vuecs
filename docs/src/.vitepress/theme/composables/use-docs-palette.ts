import { setPalette } from '@vuecs/design';
import { reactive, watch } from 'vue';

/*
 * Global docs-site palette state. Cookie-driven so it survives page
 * navigation and reload. Both the navbar `PaletteSwitch` and the
 * home-page `Hero` swatches read/write the same reactive object —
 * picking a swatch on the hero updates the navbar dropdown, and
 * vice versa.
 *
 * Hydration timing — IMPORTANT:
 * `useDocsPalette()` is conventionally called inside `<script setup>`,
 * which runs DURING setup, BEFORE the first client paint. Module-level
 * state initializes to the defaults (blue / neutral) and SSG renders
 * with those defaults. On the first client-side invocation
 * `ensureInitialized()` synchronously mutates the state from the
 * cookie — so when the cookie holds a non-default palette, the very
 * first client render diverges from the SSG'd HTML. Vue logs a
 * hydration warning AND there's a brief visual flash before
 * `setPalette()` re-paints.
 *
 * This trade-off is accepted: the alternative (deferring the cookie
 * read to `onMounted()`) widens the FOUC window without removing it
 * — by then the page has already painted with defaults. The proper
 * fix is a small inline `<script>` in `<head>` that reads the cookie
 * pre-paint and injects `<style id="vc-palette">` so SSR + first
 * paint + first client render all see the persisted palette.
 *
 * That FOUC + hydration-mismatch fix is tracked as a follow-up: see
 * `.agents/plans/shared-palette-color-mode-composables.md` ("FOUC
 * prevention" section). Until it lands, accept a one-frame flash and
 * a console warning on cookie-different palettes.
 */

export const PRIMARY_PALETTES = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'teal', 'indigo'] as const;
export const NEUTRAL_PALETTES = ['neutral', 'slate', 'gray', 'zinc', 'stone'] as const;

export type PrimaryPalette = (typeof PRIMARY_PALETTES)[number];
export type NeutralPalette = (typeof NEUTRAL_PALETTES)[number];

export interface DocsPaletteState {
    primary: PrimaryPalette;
    neutral: NeutralPalette;
}

const COOKIE_NAME = 'vc-docs-palette';
// 1 year — same default as @vuecs/nuxt's color-mode cookie. Long enough
// that a returning user never sees the default palette unless they cleared
// site data; not so long it lingers indefinitely.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const target = `${name}=`;
    const cookies = document.cookie.split(';');
    for (const raw of cookies) {
        const trimmed = raw.trim();
        if (trimmed.startsWith(target)) {
            return decodeURIComponent(trimmed.slice(target.length));
        }
    }
    return null;
};

const writeCookie = (name: string, value: string): void => {
    if (typeof document === 'undefined') return;
    const v = encodeURIComponent(value);
    document.cookie = `${name}=${v}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
};

const sanitize = (parsed: Partial<DocsPaletteState>): DocsPaletteState => ({
    primary: PRIMARY_PALETTES.includes(parsed.primary as PrimaryPalette) ?
        (parsed.primary as PrimaryPalette) :
        'blue',
    neutral: NEUTRAL_PALETTES.includes(parsed.neutral as NeutralPalette) ?
        (parsed.neutral as NeutralPalette) :
        'neutral',
});

const state = reactive<DocsPaletteState>({ primary: 'blue', neutral: 'neutral' });

let initialized = false;

const ensureInitialized = (): void => {
    if (initialized) return;
    if (typeof document === 'undefined') return; // SSR no-op
    initialized = true;

    // Load existing cookie (if any) — runs only client-side, after the
    // composable is first invoked.
    const cookie = readCookie(COOKIE_NAME);
    if (cookie) {
        try {
            Object.assign(state, sanitize(JSON.parse(cookie) as Partial<DocsPaletteState>));
        } catch {
            // Malformed cookie — keep defaults, overwrite on next change.
        }
    }

    // Apply once on init so the page reflects the persisted choice
    // (the watcher below only fires on subsequent mutations).
    setPalette({ primary: state.primary, neutral: state.neutral });

    // Persist + apply on every mutation. Single watcher serves both
    // the navbar dropdown and the hero swatches — they're the same
    // reactive object.
    watch(
        state,
        (next) => {
            writeCookie(COOKIE_NAME, JSON.stringify(next));
            setPalette({ primary: next.primary, neutral: next.neutral });
        },
        { deep: true },
    );
};

/**
 * Returns the global docs-palette reactive state. Mutate `.primary` /
 * `.neutral` to change the palette site-wide — the watcher persists to
 * a cookie and calls `setPalette()` automatically.
 *
 * Server-side (no `document`): returns the default-state object as a
 * no-op. Client-side: on first invocation, synchronously loads the
 * cookie and applies `setPalette()`. See module-level doc comment for
 * the hydration-timing trade-off.
 */
export function useDocsPalette(): DocsPaletteState {
    ensureInitialized();
    return state;
}
