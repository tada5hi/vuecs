import type { MaybeRefOrGetter } from 'vue';

/**
 * Color set the submit-button composable resolves through DefaultsManager.
 * Mirrors `@vuecs/button`'s `ButtonColor` — duplicated locally so
 * `@vuecs/forms` doesn't pull `@vuecs/button` into its dependency
 * graph for consumers who don't use the submit-button sugar.
 */
export type SubmitButtonColor = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

export type SubmitButtonDefaults = {
    createText: string;
    updateText: string;
    createIcon: string;
    updateIcon: string;
    createColor: SubmitButtonColor;
    updateColor: SubmitButtonColor;
};

export type UseSubmitButtonOptions = {
    /** When true the composable returns the update-mode bindings; defaults to `false`. */
    isEditing?: MaybeRefOrGetter<boolean>;
    /** Forwarded to the returned `loading` field; defaults to `false`. */
    loading?: MaybeRefOrGetter<boolean>;
    /** Forwarded to the returned `disabled` field; defaults to `false`. */
    disabled?: MaybeRefOrGetter<boolean>;
};

export type SubmitButtonBindings = {
    type: 'submit';
    label: string;
    iconLeft: string | undefined;
    color: SubmitButtonColor;
    loading: boolean;
    disabled: boolean;
};
