<script lang="ts">
import { useComponentTheme, useThemeProps } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNodeArrayChildren,
    VNodeChild,
} from 'vue';
import { defineComponent, h } from 'vue';
import { ValidationSeverity } from '../constants';
import type { ValidationMessages, ValidationMessagesArrayStyle } from '../type';

export type ValidationGroupThemeClasses = {
    item: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        validationGroup?: ThemeElementDefinition<ValidationGroupThemeClasses>;
    }
}

export const validationGroupThemeDefaults: ComponentThemeDefinition<ValidationGroupThemeClasses> = { classes: { item: 'form-group-hint group-required' } };

/**
 * Severity union the slot props expose. Wider than `ValidationSeverity`
 * (`error` / `warning`) so a `<VCFormGroup :validation>` bundle whose
 * `severity` is `'success'` or `undefined` flows through to slot
 * consumers as-is — instead of being collapsed back to `'error'` by
 * the prop default, which would mislead the slot rendering on
 * pristine / valid fields.
 */
export type ValidationGroupSeverity = `${ValidationSeverity}` | 'success' | undefined;

export type ValidationGroupDefaultSlotProps = {
    data: ValidationMessagesArrayStyle;
    severity: ValidationGroupSeverity;
    itemClass: string;
    itemTag: string;
};

export type ValidationGroupItemSlotProps = {
    key: string;
    value: string;
    class: string;
    tag: string;
    severity: ValidationGroupSeverity;
};

const validationGroupProps = {
    /**
     * Severity used to colour the rendered messages. Accepts
     * `'error' | 'warning'` (the vuecs-native vocabulary) plus
     * `'success'` for forward-compat with validation bridges that
     * surface a "passed" state (see `<VCFormGroup>`'s `:validation`
     * bundle).
     *
     * Default is `undefined` — slot consumers receive the actual
     * value passed by the host. The previous default of
     * `ValidationSeverity.ERROR` is gone; if a slot template needs an
     * error fallback when none is supplied, do it at the call site
     * (`severity ?? 'error'`).
     */
    severity: { type: String as PropType<ValidationGroupSeverity>, default: undefined },
    /** Validation messages — keyed object or ordered array of `{ key, value }`. */
    messages: { type: [Object, Array] as PropType<ValidationMessages>, default: () => ({}) },
    /** HTML tag used for each rendered message. */
    itemTag: { type: String, default: 'div' },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ValidationGroupThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ValidationGroupProps = ExtractPublicPropTypes<typeof validationGroupProps>;

export default defineComponent({
    name: 'VCValidationGroup',
    props: validationGroupProps,
    slots: Object as SlotsType<{
        default: ValidationGroupDefaultSlotProps;
        item: ValidationGroupItemSlotProps;
    }>,
    setup(props, { slots }) {
        // Fold the `severity` prop into `themeVariant.severity` so the
        // theme's `severity` variant axis paints each message in the
        // matching colour (amber on warning, red on error, green on
        // success). Without this every message took `validationGroup.item`'s
        // base colour regardless of state — the FormGroup root's
        // `validationWarning`/`validationError` class set the inherited
        // text-color but each message's explicit `text-*-600` class won
        // CSS specificity.
        const theme = useComponentTheme(
            'validationGroup',
            useThemeProps(props, 'severity'),
            validationGroupThemeDefaults,
        );

        return () => {
            const resolved = theme.value;

            let errors: ValidationMessagesArrayStyle;
            if (Array.isArray(props.messages)) {
                errors = props.messages;
            } else {
                errors = [];
                const keys = Object.keys(props.messages);
                for (const key of keys) {
                    errors.push({ key, value: props.messages[key] });
                }
            }

            if (slots.default) {
                return slots.default({
                    data: errors,
                    severity: props.severity,
                    itemClass: resolved.item,
                    itemTag: props.itemTag,
                });
            }

            const children: VNodeArrayChildren = [];

            for (const error of errors) {
                if (slots.item) {
                    children.push(slots.item({
                        key: error.key,
                        value: error.value,
                        class: resolved.item,
                        tag: props.itemTag,
                        severity: props.severity,
                    }));
                } else {
                    children.push(h(props.itemTag, { class: resolved.item || undefined }, [error.value]));
                }
            }

            return children as VNodeChild;
        };
    },
});
</script>
