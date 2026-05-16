import { readonly, ref } from 'vue';
import type { Ref } from 'vue';
import type { ToastEntry, ToastEntryInput } from './types';

// ──────────────────────────────────────────────────────────────────────────
// Singleton queue (module-level — shared across every `useToast()` caller)
// ──────────────────────────────────────────────────────────────────────────

const entries = ref<ToastEntry[]>([]);
let nextId = 0;

function generateId(): string {
    nextId += 1;
    return `vc-toast-${nextId}`;
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
 * Module-level singleton — every `useToast()` call returns the same queue
 * ref and mutator set. Adding from a fetch handler and rendering inside
 * `<VCToaster>` reuse one source of truth (singleton queue per plan 029 Q2).
 *
 *   const toast = useToast();
 *   toast.add({ title: 'Saved', description: 'User updated.', color: 'success' });
 *   const id = toast.add({ title: 'Uploading…', duration: 0 });
 *   toast.update(id, { description: '50% complete…' });
 *   toast.dismiss(id);
 *
 * The composable owns NO timer logic — auto-dismiss + pause-on-hover are
 * driven by Reka's `ToastRoot` `duration` prop, which `<VCToast>` forwards
 * from `entry.duration ?? <VCToastProvider :duration>`.
 *
 * SSR note: The singleton is *process-wide*, not per-request. If a server
 * worker is reused across requests (Nuxt default), state could in theory
 * leak between renders — but toasts are user-action notifications fired
 * from client-side handlers (clicks, fetch callbacks), so the server-side
 * queue is almost always empty at render time. Don't call `add()` from
 * SSR setup paths; defer it to `onMounted` or post-hydration handlers.
 */
export function useToast(): UseToastReturn {
    function add(entry: ToastEntryInput): string {
        // Caller-provided `entry.id` is a hint, not a guarantee — if it
        // collides with an existing queue entry we regenerate so the
        // queue's id invariant stays unique. Caller receives the actual
        // id back. Keeps `dismiss(id)` / `update(id)` deterministic
        // without throwing on duplicate-id submissions.
        const suggested = entry.id;
        const id = (suggested === undefined || entries.value.some((e) => e.id === suggested)) ?
            generateId() :
            suggested;
        entries.value = [...entries.value, { ...entry, id }];
        return id;
    }

    function dismiss(id: string): void {
        const idx = entries.value.findIndex((e) => e.id === id);
        if (idx === -1) return;
        const removed = entries.value[idx];
        entries.value = entries.value.filter((e) => e.id !== id);
        // `toastApi` is initialised below; the closure resolves at call
        // time so by the time any user-triggered `dismiss` runs, it's
        // fully wired up.
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
