<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import { useFormInputThemeProps } from '../form-group/context';
import type {
    ComponentThemeDefinition,
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

export const formTagsThemeDefaults: ComponentThemeDefinition<FormTagsThemeClasses> = {
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
    /** Controlled list of tag values. `null` is the documented "unset" value. */
    modelValue: {
        type: [Array, null] as PropType<FormTagsModelValue | null>,
        default: undefined,
    },
    /** Placeholder shown in the empty input field. */
    placeholder: { type: String, default: undefined },
    /** When `true`, prevents the user from interacting with the input. */
    disabled: { type: Boolean, default: false },
    /** Marks the underlying form field as required. */
    required: { type: Boolean, default: false },
    /** Maximum number of tags (0 = unlimited). */
    max: { type: Number, default: 0 },
    /** When `true`, paste events split on the delimiter and commit the parts. */
    addOnPaste: { type: Boolean, default: false },
    /** When `true`, pressing Tab commits the pending tag. */
    addOnTab: { type: Boolean, default: false },
    /** Vuecs convention: commit a pending tag when the input loses focus (Reka has no default; vuecs opts in so blur-to-commit "just works"). */
    addOnBlur: { type: Boolean, default: true },
    /** When `true`, allow duplicate tag values. */
    duplicate: { type: Boolean, default: false },
    /** Character or regular expression that triggers a new tag (and splits pasted text). */
    delimiter: { type: [String, RegExp] as PropType<string | RegExp>, default: ',' },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Element id for the root tags input. */
    id: { type: String, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormTagsThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormTagsProps = ExtractPublicPropTypes<typeof formTagsProps>;

export default defineComponent({
    name: 'VCFormTags',
    inheritAttrs: false,
    props: formTagsProps,
    emits: ['update:modelValue', 'invalid'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formTags', useFormInputThemeProps(props), formTagsThemeDefaults);

        return () => h(
            TagsInputRoot,
            mergeProps(attrs, {
                placeholder: props.placeholder,
                addOnBlur: props.addOnBlur,
                name: props.name,
                id: props.id,
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                max: props.max,
                addOnPaste: props.addOnPaste,
                addOnTab: props.addOnTab,
                duplicate: props.duplicate,
                delimiter: props.delimiter,
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
