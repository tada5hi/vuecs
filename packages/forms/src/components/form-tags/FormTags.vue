<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import {
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
    TagsInputRoot,
} from 'reka-ui';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormTagsThemeClasses = {
    root: string;
    item: string;
    itemText: string;
    itemDelete: string;
    input: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formTags?: ThemeElementDefinition<FormTagsThemeClasses>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-tags',
        item: 'vc-form-tags-item',
        itemText: 'vc-form-tags-item-text',
        itemDelete: 'vc-form-tags-item-delete',
        input: 'vc-form-tags-input',
    },
};

export type FormTagsModelValue = string[] | number[];

const formTagsProps = {
    modelValue: {
        // `null` in the runtime type alongside Array so consumers can
        // pass `null` (the documented "unset" value) without tripping
        // Vue's prop validation warnings.
        type: [Array, null] as PropType<FormTagsModelValue | null>,
        default: undefined,
    },
    placeholder: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    max: { type: Number, default: undefined },
    addOnPaste: { type: Boolean, default: false },
    addOnTab: { type: Boolean, default: false },
    addOnBlur: { type: Boolean, default: true },
    duplicate: { type: Boolean, default: false },
    delimiter: { type: [String, RegExp] as PropType<string | RegExp>, default: ',' },
    name: { type: String, default: undefined },
    id: { type: String, default: undefined },
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormTagsThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormTagsProps = ExtractPublicPropTypes<typeof formTagsProps>;

export default defineComponent({
    name: 'VCFormTags',
    inheritAttrs: false,
    props: formTagsProps,
    emits: ['update:modelValue', 'invalid'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formTags', props, themeDefaults);

        return () => h(
            TagsInputRoot,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                placeholder: props.placeholder,
                disabled: props.disabled,
                required: props.required,
                max: props.max,
                addOnPaste: props.addOnPaste,
                addOnTab: props.addOnTab,
                addOnBlur: props.addOnBlur,
                duplicate: props.duplicate,
                delimiter: props.delimiter,
                name: props.name,
                id: props.id,
                'onUpdate:modelValue': (value: FormTagsModelValue) => emit('update:modelValue', value),
                onInvalid: (value: string) => emit('invalid', value),
                class: theme.value.root || undefined,
            }),
            {
                default: ({ modelValue }: { modelValue: FormTagsModelValue }) => [
                    ...(modelValue ?? []).map((tag) => h(TagsInputItem, {
                        key: String(tag),
                        value: tag,
                        class: theme.value.item || undefined,
                    }, {
                        default: () => [
                            h(TagsInputItemText, { class: theme.value.itemText || undefined }),
                            h(TagsInputItemDelete, { class: theme.value.itemDelete || undefined }, { default: () => '×' }),
                        ],
                    })),
                    h(TagsInputInput, {
                        placeholder: props.placeholder,
                        class: theme.value.input || undefined,
                    }),
                ],
            },
        );
    },
});
</script>
