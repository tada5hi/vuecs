import type {
    AlertDialogDefaults,
    AlertDialogOptions,
    AlertDialogRequest,
    UseAlertDialogReturn,
} from './types';
import { inject, provide } from '@vuecs/core';
import { shallowRef } from 'vue';
import type { App, Ref } from 'vue';
import type { ComponentDefaultValues } from '@vuecs/core';

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
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
                id: Symbol('vc-alert-dialog'),
                options,
                resolve,
            }];
        });
    }

    /** Resolve + dequeue the head request. */
    settle(value: boolean): void {
        const head = this.queue.value[0];

        if (!head) {
            return;
        }

        this.queue.value = this.queue.value.slice(1);
        head.resolve(value);
    }

    /** Cancel every pending request (resolves `false`) — e.g. on route change. */
    clear(): void {
        const pending = this.queue.value;

        this.queue.value = [];

        for (const req of pending) {
            req.resolve(false);
        }
    }
}

const ALERT_DIALOG_MANAGER_KEY = Symbol.for('VCAlertDialogManager');

export function tryInjectAlertDialogManager(app?: App): AlertDialogManager | undefined {
    return inject<AlertDialogManager>(ALERT_DIALOG_MANAGER_KEY, app);
}

export function injectAlertDialogManager(app?: App): AlertDialogManager {
    const instance = tryInjectAlertDialogManager(app);

    if (!instance) {
        throw new Error('[vuecs] No AlertDialogManager available. Install @vuecs/overlays (app.use) and call useAlertDialog() from a component setup / inject context.');
    }

    return instance;
}

export function provideAlertDialogManager(manager: AlertDialogManager = new AlertDialogManager(), app?: App): AlertDialogManager {
    // `provide()` is a no-op when the key is already present (install-order
    // safety). Return the *provided* manager so callers never get an orphan
    // instance that `useAlertDialog()` / `<VCAlertDialogProvider>` won't inject.
    const existing = tryInjectAlertDialogManager(app);

    if (existing) {
        return existing;
    }

    provide(ALERT_DIALOG_MANAGER_KEY, manager, app);

    return manager;
}

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
