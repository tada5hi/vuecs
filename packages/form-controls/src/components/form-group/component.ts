import type { PropType, SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { SlotName, ValidationSeverity } from '../constants';
import type { ValidationMessages } from '../type';
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
        validationSeverity: {
            type: String as PropType<`${ValidationSeverity}` | undefined>,
            default: undefined,
        },
        validationMessages: {
            type: [Object, Array] as PropType<ValidationMessages>,
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

            validationSeverity: props.validationSeverity,

            validation: props.validation,
            validationMessages: props.validationMessages,

            slotItems: slots,

            props: attrs,
        });
    },
});
