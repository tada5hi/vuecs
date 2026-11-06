import type { SubmitButtonBindings, SubmitButtonDefaults, UseSubmitButtonOptions } from './types';
import { useComponentDefaults } from '@vuecs/core';
import type { ComponentDefaultValues } from '@vuecs/core';
import type { ComputedRef } from 'vue';
import { computed, toValue } from 'vue';

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ComponentDefaults {
        submitButton?: ComponentDefaultValues<SubmitButtonDefaults>;
    }
}

const hardcodedDefaults: SubmitButtonDefaults = {
    createText: 'Create',
    updateText: 'Update',
    createIcon: '',
    updateIcon: '',
    createColor: 'success',
    updateColor: 'primary',
};

/**
 * @experimental
 *
 * Reactive `v-bind` source for `<VCButton>` that swaps label / icon /
 * color between create and update modes based on `isEditing`. All four
 * customization knobs (`createText`, `updateText`, `createIcon`,
 * `updateIcon`, `createColor`, `updateColor`) resolve through the
 * `DefaultsManager` under the `submitButton` key, so consumers can wire
 * i18n labels and per-app color/icon choices once at `app.use()` time.
 *
 * The API surface (option names, return shape, defaults key) may change
 * in a future minor release while this stays experimental — pin a
 * version if you depend on the exact shape.
 *
 * @example
 * ```ts
 * const submit = useSubmitButton({ isEditing: () => isEditing.value, loading });
 * ```
 *
 * ```vue
 * <VCButton v-bind="submit" />
 * ```
 */
export function useSubmitButton(
    options: UseSubmitButtonOptions = {},
): ComputedRef<SubmitButtonBindings> {
    // useComponentDefaults reads `props[key]` per hardcoded key. We don't
    // pass per-instance overrides through this composable today (consumers
    // wanting one-off overrides set them on the spread call site), so the
    // "props" object is empty — every key falls through to the global
    // defaults layer or the hardcoded fallback.
    const defaults = useComponentDefaults('submitButton', {}, hardcodedDefaults);

    return computed<SubmitButtonBindings>(() => {
        const editing = toValue(options.isEditing) ?? false;
        const resolved = defaults.value;

        const label = editing ? resolved.updateText : resolved.createText;
        const iconClass = editing ? resolved.updateIcon : resolved.createIcon;
        const color = editing ? resolved.updateColor : resolved.createColor;

        return {
            type: 'submit',
            label,
            // Empty icon class would render an unwanted phantom <i> in
            // VCButton — coerce to undefined so the leading slot is skipped.
            iconLeft: iconClass || undefined,
            color,
            loading: toValue(options.loading) ?? false,
            disabled: toValue(options.disabled) ?? false,
        };
    });
}
