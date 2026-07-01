import type { ComponentThemeDefinition } from '@vuecs/core';
import type { AlertDialogThemeClasses } from './types';

/**
 * Single theme-defaults source for every `<VCAlertDialog*>` part (and the
 * `<VCAlertDialogProvider>` host). Each component reads only the slot it needs —
 * sharing the source keeps the augmentation, types, and consumer overrides
 * in one place.
 *
 * Structural-only `vc-alert-dialog-*` markers; all visual styling (centering,
 * shadow, animation, button colors) is supplied by the theme packages, same
 * as the `modal` family.
 */
export const alertDialogThemeDefaults: ComponentThemeDefinition<AlertDialogThemeClasses> = {
    classes: {
        overlay: 'vc-alert-dialog-overlay',
        content: 'vc-alert-dialog-content',
        header: 'vc-alert-dialog-header',
        title: 'vc-alert-dialog-title',
        description: 'vc-alert-dialog-description',
        body: 'vc-alert-dialog-body',
        footer: 'vc-alert-dialog-footer',
        trigger: 'vc-alert-dialog-trigger',
        cancel: 'vc-alert-dialog-cancel',
        action: 'vc-alert-dialog-action',
    },
};
