import { inject, provide } from '@vuecs/core';
import { readonly, ref } from 'vue';
import type { App, Ref } from 'vue';
import type { ToastEntry, ToastEntryInput } from './types';

// ──────────────────────────────────────────────────────────────────────────
// App-scoped manager (one per app — provided by the @vuecs/overlays plugin)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Holds the per-app toast queue + id sequence. Scoped to the app (not a module
 * singleton) so concurrent SSR requests never share state and multiple apps on
 * one page stay isolated. `<VCToaster>` reads `entries`; every `useToast()`
 * call in the same app shares this instance.
 */
export class ToastManager {
    readonly entries: Ref<ToastEntry[]> = ref<ToastEntry[]>([]);

    private seq = 0;

    generateId(): string {
        this.seq += 1;
        return `vc-toast-${this.seq}`;
    }
}

const TOAST_MANAGER_KEY = Symbol.for('VCToastManager');

export function tryInjectToastManager(app?: App): ToastManager | undefined {
    return inject<ToastManager>(TOAST_MANAGER_KEY, app);
}

export function injectToastManager(app?: App): ToastManager {
    const instance = tryInjectToastManager(app);
    if (!instance) {
        throw new Error('[vuecs] No ToastManager available. Install @vuecs/overlays (app.use) and call useToast() from a component setup / inject context.');
    }
    return instance;
}

export function provideToastManager(manager: ToastManager = new ToastManager(), app?: App): ToastManager {
    // `provide()` is a no-op when the key is already present (install-order
    // safety). Return the *provided* manager so callers never get an orphan
    // instance that `useToast()` / `<VCToaster>` won't inject.
    const existing = tryInjectToastManager(app);
    if (existing) return existing;
    provide(TOAST_MANAGER_KEY, manager, app);
    return manager;
}

export type UseToastReturn = {
    /** Readonly queue — drives `<VCToaster>`'s iteration. */
    entries: Readonly<Ref<ReadonlyArray<ToastEntry>>>;
    /**
     * Push a new toast onto the queue. Returns the entry's `id` so callers
     * can later `dismiss(id)` or `update(id, ...)`.
     */
    add: (entry: ToastEntryInput) => string;
    /** Remove a toast by id. Fires its `onDismiss` callback if set. No-op when id isn't in the queue. */
    dismiss: (id: string) => void;
    /** Patch a queued toast in place (e.g. progress updates). No-op when id isn't in the queue. */
    update: (id: string, patch: Partial<Omit<ToastEntry, 'id'>>) => void;
    /** Remove every queued toast. Fires each entry's `onDismiss`. */
    clear: () => void;
};

/**
 * App-scoped toast queue. Injects the per-app `ToastManager` (provided by the
 * @vuecs/overlays plugin), so it MUST be called from a component setup / inject
 * context — capture the returned API once and reuse it in handlers (including
 * store actions / interceptors wired at app init via `app.runWithContext`).
 * Adding from a handler and rendering inside `<VCToaster>` reuse the one
 * per-app queue.
 *
 *   const toast = useToast();
 *   toast.add({ title: 'Saved', description: 'User updated.', color: 'success' });
 *
 * The composable owns NO timer logic — auto-dismiss + pause-on-hover are
 * driven by Reka's `ToastRoot` `duration` prop.
 */
export function useToast(): UseToastReturn {
    const manager = injectToastManager();
    const { entries } = manager;

    function add(entry: ToastEntryInput): string {
        // No viewport to render server-side — skip enqueuing (app scoping keeps
        // state per-request; this additionally prevents an SSR-rendered toast +
        // hydration mismatch on misuse). Toasts are client-side gestures.
        if (typeof window === 'undefined') {
            return entry.id ?? '';
        }
        // Caller-provided `entry.id` is a hint, not a guarantee — if it's
        // absent or collides with an existing entry we generate a fresh one,
        // and keep regenerating until it's unique (a custom id in the
        // `vc-toast-N` format could otherwise clash with the counter). Caller
        // receives the actual id back so `dismiss(id)` / `update(id)` stay
        // deterministic.
        const isTaken = (candidate: string) => entries.value.some((e) => e.id === candidate);
        const suggested = entry.id;
        let id: string;
        if (suggested !== undefined && !isTaken(suggested)) {
            id = suggested;
        } else {
            do {
                id = manager.generateId();
            } while (isTaken(id));
        }
        entries.value = [...entries.value, { ...entry, id }];
        return id;
    }

    function dismiss(id: string): void {
        const idx = entries.value.findIndex((e) => e.id === id);
        if (idx === -1) return;
        const removed = entries.value[idx];
        entries.value = entries.value.filter((e) => e.id !== id);
        removed?.onDismiss?.(id, toastApi);
    }

    function update(id: string, patch: Partial<Omit<ToastEntry, 'id'>>): void {
        const idx = entries.value.findIndex((e) => e.id === id);
        if (idx === -1) return;
        const next = [...entries.value];
        next[idx] = { ...next[idx], ...patch };
        entries.value = next;
    }

    function clear(): void {
        const toFire = entries.value;
        entries.value = [];
        for (const e of toFire) e.onDismiss?.(e.id, toastApi);
    }

    const toastApi: UseToastReturn = {
        entries: readonly(entries) as Readonly<Ref<ReadonlyArray<ToastEntry>>>,
        add,
        dismiss,
        update,
        clear,
    };
    return toastApi;
}
