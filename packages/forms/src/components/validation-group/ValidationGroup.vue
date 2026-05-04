<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues } from '@vuecs/core';
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

const themeDefaults = { classes: { item: 'form-group-hint group-required' } };

export type ValidationGroupDefaultSlotProps = {
    data: ValidationMessagesArrayStyle;
    severity: `${ValidationSeverity}`;
    itemClass: string;
    itemTag: string;
};

export type ValidationGroupItemSlotProps = {
    key: string;
    value: string;
    class: string;
    tag: string;
    severity: `${ValidationSeverity}`;
};

const validationGroupProps = {
    /** Severity used to colour the rendered messages (`error` / `warning`). */
    severity: { type: String as PropType<`${ValidationSeverity}`>, default: ValidationSeverity.ERROR },
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
        const theme = useComponentTheme('validationGroup', props, themeDefaults);

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
