import type { ComponentThemeDefinition } from '@vuecs/core';
import type { ModalThemeClasses } from './types';

/**
 * Single theme-defaults source for every `<VCModal*>` part. Each component
 * reads only the slot it needs from the resolved theme — sharing the source
 * keeps the augmentation, types, and consumer overrides in one place.
 *
 * Slot names map 1:1 onto the Reka Dialog parts they wrap, plus `header` /
 * `body` / `footer` regions exposed for layout composition and `back` for
 * the optional view-stack back button.
 */
export const modalThemeDefaults: ComponentThemeDefinition<ModalThemeClasses> = {
    classes: {
        overlay: 'vc-modal-overlay',
        content: 'vc-modal-content',
        header: 'vc-modal-header',
        title: 'vc-modal-title',
        description: 'vc-modal-description',
        body: 'vc-modal-body',
        footer: 'vc-modal-footer',
        trigger: 'vc-modal-trigger',
        close: 'vc-modal-close',
        back: 'vc-modal-back',
    },
};
