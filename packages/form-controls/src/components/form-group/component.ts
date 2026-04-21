import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import { defineComponent, h, toRef } from 'vue';
import { ValidationSeverity } from '../constants';
import type { ValidationMessages } from '../type';
import { VCValidationGroup } from '../validation-group/module';

export type FormGroupThemeClasses = {
    root: string;
    label: string;
    hint: string;
    validationError: string;
    validationWarning: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formGroup?: ThemeClassesOverride<FormGroupThemeClasses>;
    }
}

const themeDefaults: FormGroupThemeClasses = {
    root: '',
    label: '',
    hint: '',
    validationError: '',
    validationWarning: '',
};

export const VCFormGroup = defineComponent({
    name: 'VCFormGroup',
    props: {
        label: { type: Boolean, default: undefined },
        labelTag: { type: String, default: 'label' },
        labelContent: { type: String, default: undefined },

        hint: { type: Boolean, default: undefined },
        hintTag: { type: String, default: 'div' },
        hintContent: { type: String, default: undefined },

        validation: { type: Boolean, default: true },
        validationSeverity: { type: String as PropType<`${ValidationSeverity}` | undefined>, default: undefined },
        validationMessages: { type: [Object, Array] as PropType<ValidationMessages>, default: undefined },

        themeClass: { type: Object as PropType<ThemeClassesOverride<FormGroupThemeClasses>>, default: undefined },
    },
    slots: Object as SlotsType<{
        default: Record<string, never>;
        label: Record<string, never>;
        hint: Record<string, never>;
        validationGroup: any;
        validationItem: any;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('formGroup', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const resolved = theme.value;
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
            if (props.validation) {
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
            if (props.validation && props.validationMessages) {
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
                {
                    class: [resolved.root || undefined, validationClass || undefined],
                    ...attrs,
                },
                children,
            );
        };
    },
});
