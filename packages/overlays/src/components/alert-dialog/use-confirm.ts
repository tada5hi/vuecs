import { readonly, ref } from 'vue';
import type { Component, Ref } from 'vue';
import type { ComponentDefaultValues } from '@vuecs/core';

// ──────────────────────────────────────────────────────────────────────────
// Public option / default shapes
// ──────────────────────────────────────────────────────────────────────────

/**
 * Semantic tone driving the Action button's color (and nothing else). Mirrors
 * the canonical six-color set used across `@vuecs/button` / `@vuecs/elements`
 * — no `danger` alias. Destructive confirms use `tone: 'error'`.
 */
export type ConfirmTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';

export type ConfirmOptions = {
    /** Heading text. Falls through to `useComponentDefaults('confirm').title`. */
    title?: string;
    /** Optional body text. */
    description?: string;
    /** Action (confirm) button label. Falls through to the `confirmLabel` default. */
    confirmLabel?: string;
    /** Cancel button label. Falls through to the `cancelLabel` default. */
    cancelLabel?: string;
    /** Tone for the Action button. Default `'primary'`. */
    tone?: ConfirmTone;
    /** When `true`, Escape no longer cancels — the user must pick a button. */
    noEscape?: boolean;
    /**
     * Escape hatch: render a fully custom body component instead of the
     * default title/description/buttons layout. The component receives
     * `confirm()` + `cancel()` callbacks (plus `componentProps`) and owns its
     * own action buttons.
     */
    component?: Component;
    /** Extra props passed to `component`. Merged with `{ confirm, cancel }`. */
    componentProps?: Record<string, unknown>;
};

/** Behavioral-default keys resolved via `useComponentDefaults('confirm', …)`. */
export type ConfirmDefaults = {
    title: string;
    confirmLabel: string;
    cancelLabel: string;
};

declare module '@vuecs/core' {
    interface ComponentDefaults {
        confirm?: ComponentDefaultValues<ConfirmDefaults>;
    }
}

/** Lowest-priority fallback layer — overridable per-call or app-wide. */
export const confirmHardcodedDefaults: ConfirmDefaults = {
    title: 'Are you sure?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
};

// ──────────────────────────────────────────────────────────────────────────
// Singleton FIFO queue (module-level — shared across every caller + the host)
// ──────────────────────────────────────────────────────────────────────────

export type ConfirmRequest = {
    id: string;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
};

const queue = ref<ConfirmRequest[]>([]);
let nextId = 0;

export type UseConfirmReturn = (options?: ConfirmOptions) => Promise<boolean>;

/**
 * Imperative confirmation dialog. Returns a callable that opens an alert
 * dialog and resolves `true` (Action) / `false` (Cancel / Escape). Concurrent
 * calls queue FIFO and are shown one at a time by `<VCConfirmDialog>` (placed
 * once near the app root, like `<VCToaster>`).
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ title: 'Delete project?', tone: 'error' })) {
 *       await api.deleteProject(id);
 *   }
 *
 * SSR note: the queue is a *process-wide* singleton (same caveat as
 * `useToast()`). A confirm is always a client gesture, so only call it from
 * client-side handlers — never from SSR setup.
 */
export function useConfirm(): UseConfirmReturn {
    return (options: ConfirmOptions = {}) => new Promise<boolean>((resolve) => {
        nextId += 1;
        queue.value = [...queue.value, {
            id: `vc-confirm-${nextId}`, 
            options, 
            resolve, 
        }];
    });
}

/**
 * @internal — consumed by `<VCConfirmDialog>` (and tests). Exposes the queue
 * plus the resolution primitives. `settle()` resolves the head request and
 * dequeues it; `clear()` cancels every pending request (resolves `false`),
 * useful on route change.
 */
export type ConfirmController = {
    queue: Readonly<Ref<ReadonlyArray<ConfirmRequest>>>;
    settle: (value: boolean) => void;
    clear: () => void;
};

export function useConfirmController(): ConfirmController {
    function settle(value: boolean): void {
        const head = queue.value[0];
        if (!head) return;
        queue.value = queue.value.slice(1);
        head.resolve(value);
    }

    function clear(): void {
        const pending = queue.value;
        queue.value = [];
        for (const req of pending) req.resolve(false);
    }

    return {
        queue: readonly(queue) as Readonly<Ref<ReadonlyArray<ConfirmRequest>>>,
        settle,
        clear,
    };
}
