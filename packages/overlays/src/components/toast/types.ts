import type { Component, VNode } from 'vue';
import type { ThemeElementDefinition } from '@vuecs/core';
import type { UseToastReturn } from './use-toast';

// ──────────────────────────────────────────────────────────────────────────
// Queue entry shape — what consumers push via `useToast().add(...)`.
// ──────────────────────────────────────────────────────────────────────────

export type ToastColor = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';
export type ToastVariant = 'solid' | 'soft' | 'outline';

/**
 * Inline action button on a queued toast. Named `ToastEntryAction` (not
 * `ToastAction`) to avoid shadowing Reka's `ToastAction` primitive and
 * vuecs's `VCToastAction` SFC.
 *
 * The click handler receives the toast's `id` plus the shared queue API,
 * so consumers can dismiss / update / chain from inside the handler
 * without capturing `id` via closure or re-calling `useToast()`.
 */
export type ToastEntryAction = {
    label: string;
    onClick: (id: string, toast: UseToastReturn) => void;
};

/**
 * Render-fn flavour of a text field (title / description) — lets
 * consumers pass `() => h(...)` for inline rich content (formatted
 * text, inline links, icons) without having to override the entire
 * toast layout. No args by convention — title/description are
 * presentational and shouldn't mutate the queue.
 */
export type ToastRenderFn = () => VNode | VNode[] | string;

/**
 * Render-fn flavour of an action slot. Receives `(id, toast)` so the
 * custom action UI can dismiss / update / chain through the shared
 * queue API — symmetric with `ToastEntryAction.onClick`'s signature.
 *
 *   action: (id, t) => h('div', [
 *       h('button', { onClick: () => t.dismiss(id) }, 'Dismiss'),
 *       h('button', { onClick: () => retry() }, 'Retry'),
 *   ]),
 */
export type ToastActionRenderFn = (id: string, toast: UseToastReturn) => VNode | VNode[] | string;

/**
 * Per-entry full custom render. When set, replaces the canonical
 * title/description/action/close layout for THIS toast only. The
 * component receives `entry` + `dismiss` as props; everything else
 * (including `<VCToastTitle>` / `<VCToastDescription>` composition)
 * is up to the consumer.
 */
export type ToastEntryComponent = Component;

export interface ToastEntry {
    /** Stable id. Auto-generated as `vc-toast-<seq>` if not provided. */
    id: string;
    /**
     * Optional heading text. Accepts either a plain string OR a render
     * function `() => h(...)` for inline rich content. Rendered into
     * `<VCToastTitle>`.
     */
    title?: string | ToastRenderFn;
    /**
     * Optional body text. Accepts either a plain string OR a render
     * function `() => h(...)` for inline rich content. Rendered into
     * `<VCToastDescription>`.
     */
    description?: string | ToastRenderFn;
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
    /**
     * Inline action(s) — accepts either the structured `{ label, onClick }`
     * shape (renders the single canonical `<VCToastAction>` button) OR a
     * render fn `(id, toast) => h(...)` for fully-custom action content
     * (multiple buttons, an inline link, a styled component). The render
     * fn receives the toast's id + shared queue API so custom buttons can
     * dismiss / update / chain without closure capture. Render fns are
     * responsible for their own click handlers + accessibility — see
     * `<VCToastAction>` for the required `altText` semantics if you
     * compose it manually.
     */
    action?: ToastEntryAction | ToastActionRenderFn;
    /** When `false`, hides the dismiss button. Default: `true`. */
    closable?: boolean;
    /**
     * Per-entry full custom render. Replaces the canonical layout for
     * THIS toast only (use the consumer-provided component's template /
     * render fn to lay out title / description / action / close yourself).
     * The component receives `entry: ToastEntry` and `dismiss: () => void`
     * as props, plus anything declared on `componentProps`.
     *
     * Use cases:
     * - One-off toasts that don't fit title+description (e.g. a progress
     *   toast with a `<VCProgress>` bar).
     * - Marketing toasts with custom illustrations.
     *
     * Prefer plain `title` / `description` (with `ToastRenderFn` for
     * rich inline content) when the canonical layout fits — `component`
     * is the escape hatch.
     */
    component?: ToastEntryComponent;
    /** Extra props passed to `component`. Merged with `{ entry, dismiss }`. */
    componentProps?: Record<string, unknown>;
    /** Called when the toast is removed (auto-timeout, user dismiss, or `dismiss(id)`). */
    onDismiss?: (id: string, toast: UseToastReturn) => void;
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
