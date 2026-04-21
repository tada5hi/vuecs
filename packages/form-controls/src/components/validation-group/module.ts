import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues } from '@vuecs/core';
import type {
    PropType,
    SlotsType,
    VNodeArrayChildren,
    VNodeChild,
} from 'vue';
import { defineComponent, h, toRef } from 'vue';
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

export const VCValidationGroup = defineComponent({
    name: 'VCValidationGroup',
    props: {
        severity: { type: String as PropType<`${ValidationSeverity}`>, default: ValidationSeverity.ERROR },
        messages: { type: [Object, Array] as PropType<ValidationMessages>, default: () => ({}) },
        itemTag: { type: String, default: 'div' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ValidationGroupThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    slots: Object as SlotsType<{
        default: any;
        item: any;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('validationGroup', toRef(props, 'themeClass'), themeDefaults, toRef(props, 'themeVariant'));

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
