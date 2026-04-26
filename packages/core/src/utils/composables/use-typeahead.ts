import { onScopeDispose, ref } from 'vue';
import type { Ref } from 'vue';

export type TypeaheadItem<T = unknown> = {
    ref: HTMLElement;
    value?: T;
    // Split out of `value` (was `T & { textValue?: string }`) — the
    // intersection collapses `value` to `never` when `T` is a primitive
    // (e.g. `TypeaheadItem<string>`), making the field unusable for
    // non-object data sources.
    textValue?: string;
};

function getActiveElement(): Element | null {
    if (typeof document === 'undefined') {
        return null;
    }
    let active: Element | null = document.activeElement;
    while (active && (active as HTMLElement & { shadowRoot?: ShadowRoot | null }).shadowRoot?.activeElement) {
        active = (active as HTMLElement & { shadowRoot: ShadowRoot }).shadowRoot.activeElement;
    }
    return active;
}

/**
 * Wraps an array around a start index so iteration looks forward from the
 * current match. `wrapArray(['a','b','c','d'], 2)` → `['c','d','a','b']`.
 */
export function wrapArray<T>(array: T[], startIndex: number): T[] {
    return array.map((_, index) => array[(startIndex + index) % array.length]);
}

/**
 * Picks the next matching value given the search buffer and the current match.
 * Repeated single-character searches cycle through items starting with that
 * character. Returns `undefined` if no match advances past `currentMatch`.
 */
export function getNextMatch(values: string[], search: string, currentMatch?: string): string | undefined {
    const isRepeated = search.length > 1 && Array.from(search).every((c) => c === search[0]);
    const normalized = isRepeated ? search[0] : search;
    const currentIndex = currentMatch ? values.indexOf(currentMatch) : -1;
    let wrapped = wrapArray(values, Math.max(currentIndex, 0));
    if (normalized.length === 1) {
        wrapped = wrapped.filter((v) => v !== currentMatch);
    }
    const next = wrapped.find((v) => v.toLowerCase().startsWith(normalized.toLowerCase()));
    return next !== currentMatch ? next : undefined;
}

/**
 * Typeahead search composable: accumulates keystrokes for ~1 s, then resets.
 * Pass each `keydown`'s `event.key` to `handleTypeaheadSearch` along with the
 * collection of focusable items; the matched element receives focus.
 *
 * Mirrors reka-ui's `useTypeahead` (MIT, https://github.com/unovue/reka-ui),
 * with an inlined 1 s auto-reset so `@vuecs/core` stays zero-dep.
 */
export function useTypeahead<T = unknown>(callback?: (key: string) => void): {
    search: Ref<string>;
    handleTypeaheadSearch: (key: string, items: TypeaheadItem<T>[]) => HTMLElement | undefined;
    resetTypeahead: () => void;
} {
    const search = ref('');
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Clear the in-flight reset timer when the owning scope disposes
    // (component unmount, manual effect-scope stop). Without this, a
    // pending timer fires after disposal and writes to `search.value`
    // post-unmount. `onScopeDispose` outside an active scope is a no-op
    // in production and only warns in dev — safe to call unconditionally.
    onScopeDispose(() => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    });

    const setSearch = (value: string) => {
        search.value = value;
        if (timer) {
            clearTimeout(timer);
        }
        if (value !== '') {
            timer = setTimeout(() => {
                search.value = '';
                timer = null;
            }, 1000);
        }
    };

    const handleTypeaheadSearch = (key: string, items: TypeaheadItem<T>[]): HTMLElement | undefined => {
        setSearch(search.value + key);

        if (callback) {
            callback(key);
            return undefined;
        }

        const currentEl = getActiveElement();
        const itemsWithText = items.map((item) => ({
            ...item,
            textValue: item.textValue ?? item.ref.textContent?.trim() ?? '',
        }));
        const currentMatch = itemsWithText.find((item) => item.ref === currentEl);
        const values = itemsWithText.map((item) => item.textValue);
        const nextMatch = getNextMatch(values, search.value, currentMatch?.textValue);
        const newItem = itemsWithText.find((item) => item.textValue === nextMatch);
        if (newItem) {
            newItem.ref.focus();
        }
        return newItem?.ref;
    };

    const resetTypeahead = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        search.value = '';
    };

    return {
        search, 
        handleTypeaheadSearch, 
        resetTypeahead, 
    };
}
