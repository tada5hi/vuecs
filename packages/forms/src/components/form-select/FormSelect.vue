<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import { useFormInputThemeProps } from '../form-group/context';
import type {
    ComponentDefaultValues,
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import {
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectLabel,
    SelectPortal,
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectViewport,
} from 'reka-ui';
import type { AcceptableValue } from 'reka-ui';
import type {
    ExtractPublicPropTypes,
    PropType,
    VNode,
    VNodeChild,
} from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import {
    type FormOption,
    type FormOptionGroup,
    type FormOptionItems,
    isFormOptionGroup,
} from '../../types/option';

export type FormSelectThemeClasses = {
    trigger: string;
    value: string;
    icon: string;
    content: string;
    viewport: string;
    item: string;
    itemIndicator: string;
    group: string;
    groupLabel: string;
    separator: string;
};

export type FormSelectDefaults = {
    /**
     * Placeholder text rendered inside the trigger when no option is selected.
     */
    placeholder: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSelect?: ThemeElementDefinition<FormSelectThemeClasses>;
    }
    interface ComponentDefaults {
        formSelect?: ComponentDefaultValues<FormSelectDefaults>;
    }
}

export const formSelectThemeDefaults: ComponentThemeDefinition<FormSelectThemeClasses> = {
    classes: {
        trigger: 'vc-form-select-trigger',
        value: 'vc-form-select-value',
        icon: 'vc-form-select-icon',
        content: 'vc-form-select-content',
        viewport: 'vc-form-select-viewport',
        item: 'vc-form-select-item',
        itemIndicator: 'vc-form-select-item-indicator',
        group: 'vc-form-select-group',
        groupLabel: 'vc-form-select-group-label',
        separator: 'vc-form-select-separator',
    },
};

const behavioralDefaults: FormSelectDefaults = { placeholder: '' };

const renderItem = (
    option: FormOption,
    classes: FormSelectThemeClasses,
    groupDisabled = false,
): VNode => h(
    SelectItem,
    {
        key: String(option.value),
        value: option.value,
        disabled: groupDisabled || option.disabled,
        class: classes.item,
    },
    {
        default: () => [
            h(SelectItemText, null, () => [option.label]),
            h(SelectItemIndicator, { class: classes.itemIndicator }, () => '✓'),
        ],
    },
);

const renderGroup = (group: FormOptionGroup, classes: FormSelectThemeClasses): VNode => h(
    SelectGroup,
    { key: group.label, class: classes.group },
    {
        default: () => [
            h(SelectLabel, { class: classes.groupLabel }, () => [group.label]),
            ...group.options.map((option) => renderItem(option, classes, !!group.disabled)),
        ],
    },
);

const formSelectProps = {
    /** Controlled selected value. */
    modelValue: {
        type: [String, Number, Boolean, Object, null] as PropType<AcceptableValue | undefined>,
        default: undefined,
    },
    /** Options rendered inside the dropdown (flat list or grouped). */
    options: {
        type: Array as PropType<FormOptionItems>,
        required: true,
    },
    /** Placeholder text rendered inside the trigger when no option is selected. Falls back to the global `formSelect.placeholder` default. */
    placeholder: { type: String, default: undefined },
    /** When `true`, blocks user interaction with the trigger. */
    disabled: { type: Boolean, default: false },
    /** `name` attribute submitted with the owning form. */
    name: { type: String, default: undefined },
    /** When `true`, the field must be set before the owning form can submit. */
    required: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormSelectThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormSelectProps = ExtractPublicPropTypes<typeof formSelectProps>;

export default defineComponent({
    name: 'VCFormSelect',
    inheritAttrs: false,
    props: formSelectProps,
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSelect', useFormInputThemeProps(props), formSelectThemeDefaults);
        const defaults = useComponentDefaults('formSelect', props, behavioralDefaults);

        // Build the option VNodes fresh on every invocation. Reka's
        // SelectContent uses `unmountOnHide` — it unmounts on close and
        // remounts on reopen — and a VNode renders only once, so handing
        // SelectViewport a captured array would mount an EMPTY dropdown on the
        // second open. Calling this inside the viewport's slot thunk re-creates
        // the items on every mount. Same per-mount-thunk fix as VCNavItem's
        // flyout content (commit b08706d7) and VCDropdownMenuContent.
        const renderItems = (): VNodeChild[] => {
            const classes = theme.value;
            const items: VNodeChild[] = [];
            // `options` is `required: true`; the `!` counters the separate-const
            // props widening to `| undefined` under strict.
            for (const item of props.options!) {
                if (isFormOptionGroup(item)) {
                    items.push(renderGroup(item, classes));
                } else {
                    items.push(renderItem(item, classes));
                }
            }

            return items;
        };

        return () => {
            const resolved = theme.value;
            const { placeholder } = defaults.value;

            return h(SelectRoot, {
                name: props.name,
                modelValue: props.modelValue,
                disabled: props.disabled,
                required: props.required,
                'onUpdate:modelValue'(value: AcceptableValue) {
                    emit('update:modelValue', value);
                },
            }, {
                default: () => [
                    h(SelectTrigger, mergeProps({ class: resolved.trigger || undefined }, attrs), () => [
                        h(SelectValue, { class: resolved.value || undefined, placeholder }),
                        h(SelectIcon, { class: resolved.icon || undefined }, () => '▾'),
                    ]),
                    h(SelectPortal, null, () => [
                        h(SelectContent, { class: resolved.content || undefined, position: 'popper' }, () => [
                            h(SelectViewport, { class: resolved.viewport || undefined }, () => renderItems()),
                        ]),
                    ]),
                ],
            });
        };
    },
});
</script>
