<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNodeChild,
} from 'vue';
import { defineComponent, h, mergeProps } from 'vue';
import { ValidationSeverity } from '../constants';
import type { ValidationMessages } from '../type';
import {
    VCValidationGroup,
    type ValidationGroupDefaultSlotProps,
    type ValidationGroupItemSlotProps,
} from '../validation-group';

export type FormGroupThemeClasses = {
    root: string;
    label: string;
    hint: string;
    validationError: string;
    validationWarning: string;
};

export type FormGroupDefaults = {
    validation: boolean;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formGroup?: ThemeElementDefinition<FormGroupThemeClasses>;
    }
    interface ComponentDefaults {
        formGroup?: ComponentDefaultValues<FormGroupDefaults>;
    }
}

export const formGroupThemeDefaults: ComponentThemeDefinition<FormGroupThemeClasses> = {
    classes: {
        root: '',
        label: '',
        hint: '',
        validationError: '',
        validationWarning: '',
    },
};

const behavioralDefaults: FormGroupDefaults = { validation: true };

const formGroupProps = {
    /** When `true`/`false`, force-render or hide the label. When `undefined`, label visibility follows slot/content presence. */
    label: { type: Boolean, default: undefined },
    /** HTML tag used for the label element. */
    labelTag: { type: String, default: 'label' },
    /** Default text rendered when no `label` slot is provided. */
    labelContent: { type: String, default: undefined },

    /** When `true`/`false`, force-render or hide the hint. When `undefined`, hint visibility follows slot/content presence. */
    hint: { type: Boolean, default: undefined },
    /** HTML tag used for the hint element. */
    hintTag: { type: String, default: 'div' },
    /** Default text rendered when no `hint` slot is provided. */
    hintContent: { type: String, default: undefined },

    /** When `true`, render the validation messages section. Falls back to the global `formGroup.validation` default. */
    validation: { type: Boolean, default: undefined },
    /** Severity used to colour the validation messages (`error` / `warning`). */
    validationSeverity: { type: String as PropType<`${ValidationSeverity}` | undefined>, default: undefined },
    /** Validation messages — keyed object or ordered array of `{ key, value }`. */
    validationMessages: { type: [Object, Array] as PropType<ValidationMessages>, default: undefined },

    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormGroupThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormGroupProps = ExtractPublicPropTypes<typeof formGroupProps>;

export default defineComponent({
    name: 'VCFormGroup',
    inheritAttrs: false,
    props: formGroupProps,
    slots: Object as SlotsType<{
        default: Record<string, never>;
        label: Record<string, never>;
        hint: Record<string, never>;
        validationGroup: ValidationGroupDefaultSlotProps;
        validationItem: ValidationGroupItemSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('formGroup', props, formGroupThemeDefaults);
        const defaults = useComponentDefaults('formGroup', props, behavioralDefaults);

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const children: VNodeChild[] = [];

            // Label
            const showLabel = typeof props.label === 'boolean' ?
                props.label :
                (!!props.labelContent || !!slots.label);

            if (showLabel) {
                if (slots.label) {
                    children.push(h(props.labelTag, { class: resolved.label || undefined }, slots.label({})));
                } else if (props.labelContent) {
                    children.push(h(props.labelTag, { class: resolved.label || undefined }, [props.labelContent]));
                }
            }

            // Default slot content
            if (slots.default) {
                children.push(slots.default({}));
            }

            // Validation
            if (resolvedDefaults.validation) {
                children.push(h(VCValidationGroup, {
                    severity: props.validationSeverity,
                    messages: props.validationMessages || {},
                }, {
                    ...(slots.validationGroup ? { default: slots.validationGroup } : {}),
                    ...(slots.validationItem ? { item: slots.validationItem } : {}),
                }));
            }

            // Hint
            const showHint = typeof props.hint === 'boolean' ?
                props.hint :
                (!!props.hintContent || !!slots.hint);

            if (showHint) {
                if (slots.hint) {
                    children.push(h(props.hintTag, { class: resolved.hint || undefined }, slots.hint({})));
                } else if (props.hintContent) {
                    children.push(h(props.hintTag, { class: resolved.hint || undefined }, [props.hintContent]));
                }
            }

            // Determine validation class
            let validationClass: string | undefined;
            if (resolvedDefaults.validation && props.validationMessages) {
                const hasMessages = Array.isArray(props.validationMessages) ?
                    props.validationMessages.length > 0 :
                    Object.keys(props.validationMessages).length > 0;

                if (hasMessages) {
                    validationClass = props.validationSeverity === ValidationSeverity.WARNING ?
                        resolved.validationWarning :
                        resolved.validationError;
                }
            }

            return h(
                'div',
                mergeProps(attrs, { class: [resolved.root || undefined, validationClass || undefined] }),
                children,
            );
        };
    },
});
</script>
