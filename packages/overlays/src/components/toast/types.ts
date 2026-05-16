import type { ThemeElementDefinition } from '@vuecs/core';

// ──────────────────────────────────────────────────────────────────────────
// Queue entry shape — what consumers push via `useToast().add(...)`.
// ──────────────────────────────────────────────────────────────────────────

export type ToastColor = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';
export type ToastVariant = 'solid' | 'soft' | 'outline';

/**
 * Inline action button on a queued toast. Named `ToastEntryAction` (not
 * `ToastAction`) to avoid shadowing Reka's `ToastAction` primitive and
 * vuecs's `VCToastAction` SFC.
 */
export type ToastEntryAction = {
    label: string;
    onClick: () => void;
};

export interface ToastEntry {
    /** Stable id. Auto-generated as `vc-toast-<seq>` if not provided. */
    id: string;
    /** Optional heading text — rendered into `<VCToastTitle>` when present. */
    title?: string;
    /** Optional body text — rendered into `<VCToastDescription>` when present. */
    description?: string;
    /** Semantic color — drives the `color` theme variant. */
    color?: ToastColor;
    /** Style variant — `solid` / `soft` / `outline`. Defaults from the theme entry. */
    variant?: ToastVariant;
    /**
     * Auto-dismiss timeout in milliseconds.
     * - `undefined` (default): use the `<VCToastProvider>` duration.
     * - `0` or `Infinity`: persistent — never auto-dismiss (both are
     *   honored by Reka's timer, use whichever reads better at the call site).
     */
    duration?: number;
    /** Inline action button — rendered as `<VCToastAction>`. */
    action?: ToastEntryAction;
    /** When `false`, hides the dismiss button. Default: `true`. */
    closable?: boolean;
    /** Called when the toast is removed (auto-timeout, user dismiss, or `dismiss(id)`). */
    onDismiss?: () => void;
}

/** The subset of `ToastEntry` callers pass to `add()`. `id` is auto-generated when omitted. */
export type ToastEntryInput = Omit<ToastEntry, 'id'> & { id?: string };

// ──────────────────────────────────────────────────────────────────────────
// Theme class maps (one per shipping component — 5 total per plan 029)
// ──────────────────────────────────────────────────────────────────────────

export type ToastViewportPosition = 'top-left' | 'top-right' | 'top-center' |
    'bottom-left' | 'bottom-right' | 'bottom-center';

export type ToastViewportThemeClasses = {
    /** The fixed-position mount point. */
    root: string;
};

export type ToastThemeClasses = {
    /** The toast `<li>` root. */
    root: string;
    /** Canonical-layout body column wrapper holding title + description + action. */
    body: string;
    /** Default-layout close button neutral slot. */
    close: string;
    /** Default-layout close icon slot (slotless `<VCToastClose />`). */
    closeIcon: string;
};

export type ToastTitleThemeClasses = {
    /** The toast title element. */
    root: string;
};

export type ToastDescriptionThemeClasses = {
    /** The toast description element. */
    root: string;
};

export type ToastActionThemeClasses = {
    /** The toast inline action button. */
    root: string;
};

// ──────────────────────────────────────────────────────────────────────────
// Theme element registry augmentation
// ──────────────────────────────────────────────────────────────────────────

declare module '@vuecs/core' {
    interface ThemeElements {
        toast?: ThemeElementDefinition<ToastThemeClasses>;
        toastViewport?: ThemeElementDefinition<ToastViewportThemeClasses>;
        toastTitle?: ThemeElementDefinition<ToastTitleThemeClasses>;
        toastDescription?: ThemeElementDefinition<ToastDescriptionThemeClasses>;
        toastAction?: ThemeElementDefinition<ToastActionThemeClasses>;
    }
}
