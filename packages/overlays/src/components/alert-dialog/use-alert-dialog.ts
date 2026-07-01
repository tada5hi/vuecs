import { inject, provide } from '@vuecs/core';
import { shallowRef } from 'vue';
import type { App, Component, Ref } from 'vue';
import type { ComponentDefaultValues } from '@vuecs/core';

// ──────────────────────────────────────────────────────────────────────────
// Public option / default shapes
// ──────────────────────────────────────────────────────────────────────────

/**
 * Semantic tone driving the Action button's color (and nothing else). Mirrors
 * the canonical six-color set used across `@vuecs/button` / `@vuecs/elements`
 * — no `danger` alias. Destructive confirms use `tone: 'error'`.
 */
export type AlertDialogTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';

export type AlertDialogOptions = {
    /** Heading text. Falls through to `useComponentDefaults('alertDialog').title`. */
    title?: string;
    /**
     * Optional body text. Omitting it is valid, but — like any Reka dialog
     * with no description — triggers Reka's "Missing Description" dev-only
     * console warning (never emitted in production). Pass a description to
     * silence it.
     */
    description?: string;
    /** Action (confirm) button label. Falls through to the `confirmLabel` default. */
    confirmLabel?: string;
    /** Cancel button label. Falls through to the `cancelLabel` default. */
    cancelLabel?: string;
    /** Tone for the Action button. Default `'primary'`. */
    tone?: AlertDialogTone;
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

/** Behavioral-default keys resolved via `useComponentDefaults('alertDialog', …)`. */
export type AlertDialogDefaults = {
    title: string;
    confirmLabel: string;
    cancelLabel: string;
};

declare module '@vuecs/core' {
    interface ComponentDefaults {
        alertDialog?: ComponentDefaultValues<AlertDialogDefaults>;
    }
}

/** Lowest-priority fallback layer — overridable per-call or app-wide. */
export const alertDialogHardcodedDefaults: AlertDialogDefaults = {
    title: 'Are you sure?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
};

export type AlertDialogRequest = {
    /**
     * Opaque per-request token, used only as the host's Vue `:key` (to remount
     * between sequential dialogs). Never a DOM id, never returned to the
     * caller — a fresh `Symbol` is the cleanest unique value.
     */
    id: symbol;
    options: AlertDialogOptions;
    resolve: (value: boolean) => void;
};

// ──────────────────────────────────────────────────────────────────────────
// App-scoped manager (one per app — provided by the @vuecs/overlays plugin)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Holds the per-app confirmation queue. Scoped to the app (not a module
 * singleton) so concurrent SSR requests never share state and multiple apps on
 * one page stay isolated. Drained one-at-a-time (FIFO) by `<VCAlertDialogProvider>`.
 */
export class AlertDialogManager {
    readonly queue: Ref<AlertDialogRequest[]> = shallowRef<AlertDialogRequest[]>([]);

    /**
     * Enqueue a confirmation; resolves `true` (Action) / `false`
     * (Cancel / Escape). On the server there's no dialog to render, so it
     * resolves `false` without enqueuing (avoids an SSR-rendered dialog +
     * hydration mismatch).
     */
    confirm(options: AlertDialogOptions = {}): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (typeof window === 'undefined') {
                resolve(false);
                return;
            }
            this.queue.value = [...this.queue.value, {
                id: Symbol('vc-confirm'), 
                options, 
                resolve, 
            }];
        });
    }

    /** Resolve + dequeue the head request. */
    settle(value: boolean): void {
        const head = this.queue.value[0];
        if (!head) return;
        this.queue.value = this.queue.value.slice(1);
        head.resolve(value);
    }

    /** Cancel every pending request (resolves `false`) — e.g. on route change. */
    clear(): void {
        const pending = this.queue.value;
        this.queue.value = [];
        for (const req of pending) req.resolve(false);
    }
}

const CONFIRM_MANAGER_KEY = Symbol.for('VCAlertDialogManager');

export function tryInjectAlertDialogManager(app?: App): AlertDialogManager | undefined {
    return inject<AlertDialogManager>(CONFIRM_MANAGER_KEY, app);
}

export function injectAlertDialogManager(app?: App): AlertDialogManager {
    const instance = tryInjectAlertDialogManager(app);
    if (!instance) {
        throw new Error('[vuecs] No AlertDialogManager available. Install @vuecs/overlays (app.use) and call useAlertDialog() from a component setup / inject context.');
    }
    return instance;
}

export function provideAlertDialogManager(manager: AlertDialogManager = new AlertDialogManager(), app?: App): AlertDialogManager {
    provide(CONFIRM_MANAGER_KEY, manager, app);
    return manager;
}

export type UseAlertDialogReturn = (options?: AlertDialogOptions) => Promise<boolean>;

/**
 * Imperative confirmation dialog. Injects the per-app `AlertDialogManager`, so it
 * MUST be called from a component setup / inject context — capture the returned
 * callable once and reuse it in handlers (including store actions). Resolves
 * `Promise<boolean>`. A single `<VCAlertDialogProvider>` host (placed once per app)
 * drains the queue.
 *
 *   const confirm = useAlertDialog();
 *   if (await confirm({ title: 'Delete project?', tone: 'error' })) { … }
 *
 * To cancel all pending confirms (e.g. on route change) inject the manager
 * directly: `injectAlertDialogManager().clear()`.
 */
export function useAlertDialog(): UseAlertDialogReturn {
    const manager = injectAlertDialogManager();
    return (options: AlertDialogOptions = {}) => manager.confirm(options);
}
