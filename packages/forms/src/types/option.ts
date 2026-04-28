import type { AcceptableValue } from 'reka-ui';

/**
 * A single selectable option in a form control (Select, SelectSearch, …).
 *
 * `value` is the bound value (what flows through `v-model`); `label` is the
 * display string. This matches HTML `<option value="...">label</option>`,
 * Reka UI, and every mainstream form-library convention.
 */
export type FormOption<T extends AcceptableValue = AcceptableValue> = {
    /** Bound value — flows through `v-model`. */
    value: T;
    /** Display string the user sees. */
    label: string;
    /** When `true`, the option is rendered but not selectable. */
    disabled?: boolean;
    /** Optional secondary line shown below or beside the label. */
    description?: string;
    /** Optional icon — class string, URL, or any token a consumer slot can render. */
    icon?: string;
    /** Free-form metadata for custom rendering / filtering / consumer-side logic. */
    meta?: Record<string, unknown>;
};

/**
 * A group of options rendered under a shared label (HTML `<optgroup>`).
 */
export type FormOptionGroup<T extends AcceptableValue = AcceptableValue> = {
    /** Group heading text. */
    label: string;
    /** Options inside this group. */
    options: FormOption<T>[];
    /** When `true`, every option in the group is non-selectable. */
    disabled?: boolean;
};

/**
 * What `<VCFormSelect>` and friends accept — flat options, groups, or a mix.
 */
export type FormOptionItems<T extends AcceptableValue = AcceptableValue> =    (FormOption<T> | FormOptionGroup<T>)[];

/** Type guard for narrowing in render code. */
export const isFormOptionGroup = <T extends AcceptableValue>(
    item: FormOption<T> | FormOptionGroup<T>,
): item is FormOptionGroup<T> => Array.isArray((item as FormOptionGroup<T>).options);
