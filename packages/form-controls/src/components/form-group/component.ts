import type { PropType, SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { SlotName } from '../constants';
import type { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';
import { buildFormGroup } from './module';

export const VCFormGroup = defineComponent({
    slots: Object as SlotsType<{
        [SlotName.DEFAULT]: undefined,
        [SlotName.LABEL]: undefined,
        [SlotName.HINT]: undefined
    }>,
    props: {
        label: {
            type: Boolean,
            default: undefined,
        },
        labelClass: {
            type: String,
        },
        labelContent: {
            type: String,
        },

        hint: {
            type: Boolean,
            default: undefined,
        },
        hintClass: {
            type: String,
        },
        hintContent: {
            type: String,
        },

        validation: {
            type: Boolean,
            default: undefined,
        },
        validationResult: {
            type: Object as PropType<Partial<ValidationResult>>,
            default: undefined,
        },
        validationMessages: {
            type: Object as PropType<ValidationMessages>,
            default: undefined,
        },
        validationTranslator: {
            type: Function as PropType<ValidationTranslator>,
            default: undefined,
        },
    },
    setup(props, { attrs, slots }) {
        return () => buildFormGroup({
            label: props.label,
            labelClass: props.labelClass,
            labelContent: props.labelContent,

            hint: props.hint,
            hintClass: props.hintClass,
            hintContent: props.hintContent,

            validation: props.validation,
            validationResult: props.validationResult,
            validationMessages: props.validationMessages,
            validationTranslator: props.validationTranslator,

            slotItems: slots,

            props: attrs,
        });
    },
});
