import type { ThemeElementDefinition } from '@vuecs/core';

import type { Component, ComputedRef, Ref } from 'vue';

/**
 * Dismissal policy for `<VCModalContent>` — which built-in close
 * interactions are honored. Explicit triggers (`<VCModalClose>`, the
 * corner-X, programmatic `v-model:open` writes) always work.
 *
 * - `always` — Escape and outside interaction both close (Reka default).
 * - `no-escape` — Escape is ignored; outside interaction still closes.
 * - `no-outside` — outside interaction is ignored; Escape still closes.
 * - `never` — neither closes (busy overlays, modals holding in-progress
 *   form input).
 */
export type ModalClosePolicy = 'always' | 'no-escape' | 'no-outside' | 'never';

export type ModalThemeClasses = {
    /** Backdrop / overlay layer behind the dialog content. */
    overlay: string;
    /** Dialog content container (the actual focused panel). */
    content: string;
    /** Header region (default slot composition). */
    header: string;
    /** Title element (`DialogTitle`). */
    title: string;
    /** Description element (`DialogDescription`). */
    description: string;
    /** Body region (default slot composition). */
    body: string;
    /** Footer region (default slot composition). */
    footer: string;
    /** Trigger button element. */
    trigger: string;
    /**
     * Generic close-trigger button. Neutral by design (just focus-ring +
     * button affordances) so consumer classes layered via `class=` compose
     * cleanly. Used by `<VCModalClose>`.
     */
    close: string;
    /**
     * Corner-X close button. Carries absolute positioning + sizing so it
     * docks into the dialog's top-right corner. Used by the corner-X
     * presentation of `<VCModalClose>` (slotless or with the `icon` prop).
     */
    closeIcon: string;
    /** "Back" button shown when the view stack has history. */
    back: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        modal?: ThemeElementDefinition<ModalThemeClasses>;
    }
}

export type ModalView = {
    /**
     * Distinguishing key. Used as the Vue render `key` so swapping views
     * remounts the content (state inside the previous view is discarded).
     */
    key?: string | number | symbol;
    /** Component to render in the modal body. */
    component: Component;
    /** Props passed to the rendered component. */
    props?: Record<string, unknown>;
    /** Optional title to render in `<VCModalTitle>` when no slot is provided. */
    title?: string;
};

export type UseModalOptions = {
    /** Initial view to push when the modal opens. Optional — open() can be called without a starting view. */
    initialView?: ModalView;
    /**
     * Called after the modal closes (after the view stack is cleared).
     * Use this for cleanup (resetting form state, refetching parent data, etc.).
     */
    onClose?: () => void;
};

export type UseModalReturn = {
    /** Reactive open/closed state. Bind to `<VCModal v-model:open>`. */
    isOpen: Ref<boolean>;
    /** Current top-of-stack view, or `undefined` when the stack is empty. */
    currentView: ComputedRef<ModalView | undefined>;
    /** True when `popView()` would do something (i.e. stack depth > 1). */
    hasHistory: ComputedRef<boolean>;
    /** Current stack depth. */
    depth: ComputedRef<number>;

    /** Open the modal. If `view` is supplied, it becomes the initial entry on the stack. */
    open: (view?: ModalView) => void;
    /** Close the modal and clear the stack. Fires `onClose`. */
    close: () => void;
    /** Push a view onto the stack. Opens the modal if it isn't open already. */
    pushView: (view: ModalView) => void;
    /** Pop the top view. If the stack would become empty, closes the modal instead. */
    popView: () => void;
    /** Replace the entire stack with a single view. Opens the modal if needed. */
    replaceView: (view: ModalView) => void;
    /** Programmatic update for v-model:open. */
    setOpen: (next: boolean) => void;
};
