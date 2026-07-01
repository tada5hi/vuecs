import type { ThemeElementDefinition } from '@vuecs/core';

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
    interface ThemeElements {
        alertDialog?: ThemeElementDefinition<AlertDialogThemeClasses>;
    }
}
