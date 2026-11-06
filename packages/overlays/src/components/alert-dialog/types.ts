import type { ThemeElementDefinition } from '@vuecs/core';

import type { Component } from 'vue';

/**
 * Theme slots for the `<VCAlertDialog*>` compound. A single key (`alertDialog`)
 * backs every part — each component reads only the slot it needs.
 *
 * Slot names map onto the Reka `AlertDialog` parts they wrap, plus `header` /
 * `body` / `footer` layout regions and the `cancel` / `action` button slots
 * (the two distinct confirm actions an alert dialog forces a choice between).
 *
 * Unlike `modal`, there is deliberately no `close` / `closeIcon` slot — an
 * alert dialog has no dismissable corner-X; the user must pick Cancel or
 * Action.
 */
export type AlertDialogThemeClasses = {
    /** Backdrop / overlay layer behind the dialog content. */
    overlay: string;
    /** Dialog content container (the focused panel; `role="alertdialog"`). */
    content: string;
    /** Header region (default-slot composition). */
    header: string;
    /** Title element (`AlertDialogTitle`). */
    title: string;
    /** Description element (`AlertDialogDescription`). */
    description: string;
    /** Body region (default-slot composition). */
    body: string;
    /** Footer region holding the Cancel + Action buttons. */
    footer: string;
    /** Trigger button element. */
    trigger: string;
    /** Cancel button — the safe / least-destructive action. Neutral baseline. */
    cancel: string;
    /** Action button — the confirm action. Colored by the `tone` variant. */
    action: string;
};

/**
 * Default-slot props for `<VCAlertDialogAction>`. `confirm()` closes the
 * dialog. Mainly useful in `manual` mode (where the click's auto-close is
 * suppressed) so the consumer can close after validation / an async action;
 * in the default mode the button already closes on click.
 */
export type AlertDialogActionSlotProps = {
    /** Invoke to confirm and close the dialog. */
    confirm: () => void;
};

/**
 * Default-slot props for `<VCAlertDialogCancel>`. `cancel()` closes the dialog.
 * Mainly useful in `manual` mode (auto-close suppressed).
 */
export type AlertDialogCancelSlotProps = {
    /** Invoke to cancel and close the dialog. */
    cancel: () => void;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        alertDialog?: ThemeElementDefinition<AlertDialogThemeClasses>;
    }
}

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

export type UseAlertDialogReturn = (options?: AlertDialogOptions) => Promise<boolean>;
