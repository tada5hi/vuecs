import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    ToastActionThemeClasses,
    ToastDescriptionThemeClasses,
    ToastThemeClasses,
    ToastTitleThemeClasses,
    ToastViewportThemeClasses,
} from './types';

export const toastViewportThemeDefaults: ComponentThemeDefinition<ToastViewportThemeClasses> = { classes: { root: 'vc-toast-viewport' } };

export const toastThemeDefaults: ComponentThemeDefinition<ToastThemeClasses> = {
    classes: {
        root: 'vc-toast',
        body: 'vc-toast-body',
        close: 'vc-toast-close',
        closeIcon: 'vc-toast-close-icon',
    },
};

export const toastTitleThemeDefaults: ComponentThemeDefinition<ToastTitleThemeClasses> = { classes: { root: 'vc-toast-title' } };

export const toastDescriptionThemeDefaults: ComponentThemeDefinition<ToastDescriptionThemeClasses> = { classes: { root: 'vc-toast-description' } };

export const toastActionThemeDefaults: ComponentThemeDefinition<ToastActionThemeClasses> = { classes: { root: 'vc-toast-action' } };
