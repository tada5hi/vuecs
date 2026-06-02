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
import type { FieldValidation, ValidationMessages } from '../type';
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
    /**
     * Visibility toggle for the `<VCValidationGroup>` section. Renamed
     * from `validation` in 3.x — `validation` now names the bundle prop
     * (`FieldValidation`) consumed via `:validation`. Both ship on the
     * defaults manager, so app-wide overrides continue to work.
     */
    renderValidation: boolean;
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

const behavioralDefaults: FormGroupDefaults = { renderValidation: true };

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

    /**
     * Bundle prop accepting a `FieldValidation` (`{ severity, messages }`)
     * — wins over `validationSeverity` + `validationMessages` when set.
     *
     * Canonical use is with `@ilingo/validup-vue`'s `useFieldValidation`:
     * `<VCFormGroup :validation="useFieldValidation($v.fields.email)">`.
     * Structural typing — vuecs and `@ilingo/validup-vue` declare matching
     * shapes without either importing the other.
     *
     * Pass `null` / `undefined` to fall through to the legacy props.
     */
    validation: { type: Object as PropType<FieldValidation | null>, default: undefined },

    /**
     * Visibility toggle for the validation messages section. When
     * `false`, the `<VCValidationGroup>` is suppressed regardless of
     * whether `:validation` or `:validation-messages` carry content.
     * Falls back to the global `formGroup.renderValidation` default
     * (`true`).
     *
     * Renamed from `:validation` in 3.x — the unqualified name now
     * carries the `FieldValidation` bundle (severity + messages).
     */
    renderValidation: { type: Boolean, default: undefined },

    /**
     * @deprecated Pass a `FieldValidation` via `:validation` instead.
     * Severity used to colour the validation messages (`error` /
     * `warning`). Ignored when `:validation` is set.
     */
    validationSeverity: { type: String as PropType<`${ValidationSeverity}` | undefined>, default: undefined },

    /**
     * @deprecated Pass a `FieldValidation` via `:validation` instead.
     * Validation messages — keyed object or ordered array of
     * `{ key, value }`. Ignored when `:validation` is set.
     */
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

            // Bundle precedence — `:validation` (the FieldValidation bundle) wins
            // over the legacy `:validation-severity` + `:validation-messages` props
            // when set. `null` or `undefined` falls through to the legacy props so
            // a consumer can clear the bundle programmatically without juggling
            // both shapes.
            const usingBundle = props.validation != null;
            const bundleSeverity = usingBundle ? props.validation!.severity : undefined;
            const effectiveSeverity = usingBundle ? bundleSeverity : props.validationSeverity;
            const effectiveMessages: ValidationMessages | undefined = usingBundle ?
                props.validation!.messages :
                props.validationMessages;

            // Validation
            if (resolvedDefaults.renderValidation) {
                children.push(h(VCValidationGroup, {
                    // `<VCValidationGroup>`'s `:severity` only knows `error` /
                    // `warning`. The bundle's wider union (`success`, `undefined`)
                    // collapses to `undefined` here so the inner component falls
                    // back to its own default (`error`) for the slot-prop value —
                    // class application on the root branches separately below.
                    severity: (effectiveSeverity === ValidationSeverity.WARNING || effectiveSeverity === ValidationSeverity.ERROR) ?
                        effectiveSeverity :
                        undefined,
                    messages: effectiveMessages || {},
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

            // Root validation class
            //
            // Asymmetric on purpose: when `effectiveSeverity` is `undefined`, the
            // legacy path defaults to the error class (pre-bundle behaviour kept
            // for back-compat — consumers that don't pass severity expect a red
            // outline). The bundle path treats `undefined` as "field is OK /
            // pristine" and applies no class — that matches the semantic from
            // `@ilingo/validup-vue`'s `useFieldValidation`, where the severity
            // tracks `getSeverity()`'s `error | warning | success | undefined`
            // contract. `'success'` is reserved for forward-compat — vuecs has
            // no `validationSuccess` theme slot yet, so it also resolves to no
            // class today.
            let validationClass: string | undefined;
            if (resolvedDefaults.renderValidation && effectiveMessages) {
                const hasMessages = Array.isArray(effectiveMessages) ?
                    effectiveMessages.length > 0 :
                    Object.keys(effectiveMessages).length > 0;

                if (hasMessages) {
                    if (effectiveSeverity === ValidationSeverity.WARNING) {
                        validationClass = resolved.validationWarning;
                    } else if (effectiveSeverity === ValidationSeverity.ERROR) {
                        validationClass = resolved.validationError;
                    } else if (!usingBundle) {
                        validationClass = resolved.validationError;
                    }
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
