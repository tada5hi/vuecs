import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';

export type AlertContext = {
    /** Toggle the alert's visibility — drives `v-model:open` on `<VCAlert>`. */
    setOpen: (open: boolean) => void;
};

const ALERT_CONTEXT_KEY: InjectionKey<AlertContext> = Symbol('VCAlertContext');

export function provideAlertContext(ctx: AlertContext): void {
    provide(ALERT_CONTEXT_KEY, ctx);
}

/**
 * Read the parent `<VCAlert>` context. Returns `null` when the caller is
 * not nested under a `<VCAlert>` (e.g. unit tests, ad-hoc composition) —
 * `<VCAlertClose>` falls back to firing its native click handler in that
 * case.
 */
export function useAlertContext(): AlertContext | null {
    return inject(ALERT_CONTEXT_KEY, null);
}
