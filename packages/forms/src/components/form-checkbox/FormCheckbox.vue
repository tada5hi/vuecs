<script lang="ts">
import { 
    isMeaningfulSlotContent, 
    useComponentDefaults, 
    useComponentTheme, 
    useId, 
} from '@vuecs/core';
import { useFormInputThemeProps } from '../form-group/context';
import type {
    ComponentDefaultValues,
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import type { 
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
    VNode, 
} from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormCheckboxThemeClasses = {
    root: string;
    indicator: string;
    label: string;
    group: string;
};

export type FormCheckboxDefaults = {
    labelContent: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formCheckbox?: ThemeElementDefinition<FormCheckboxThemeClasses>;
    }
    interface ComponentDefaults {
        formCheckbox?: ComponentDefaultValues<FormCheckboxDefaults>;
    }
}

export const formCheckboxThemeDefaults: ComponentThemeDefinition<FormCheckboxThemeClasses> = {
    classes: {
        root: 'vc-form-checkbox',
        indicator: 'vc-form-checkbox-indicator',
        label: 'vc-form-checkbox-label',
        // See FormRadio.vue — collides with `vc-form-checkbox-group`
        // used by `<VCFormCheckboxGroup>` (column layout).
        group: 'vc-form-checkbox-wrapper',
    },
};

const behavioralDefaults: FormCheckboxDefaults = { labelContent: 'Input' };

export type FormCheckboxLabelSlotProps = {
    class: string;
    id: string;
};

export type FormCheckboxModelValue = boolean | 'indeterminate' | null;

/** Resolved state while the indicator is mounted — Reka only renders it when the box isn't unchecked. */
export type FormCheckboxState = Exclude<FormCheckboxModelValue, false | null>;

export type FormCheckboxIndicatorSlotProps = {
    class: string;
    /** `true` while checked, `'indeterminate'` for the tri-state. */
    state: FormCheckboxState;
};

/**
 * Built-in glyph for the checked / indeterminate states.
 *
 * Rendered here (rather than as a CSS mask in the structural stylesheet) so a
 * checked box shows a check mark with **no** prerequisites — no theme, no
 * `@import "@vuecs/forms"`, no icon package, no `#indicator` slot (#1694).
 * `stroke="currentColor"` picks up the colour every theme already puts on the
 * `indicator` slot class.
 *
 * Sized as a **percentage of the box**, not a fixed length. The box height is
 * not ours to predict — it is `1rem` by default, `vc-form-checkbox-{xs,sm,lg}`
 * under a size variant, and whatever a consumer writes when they line a
 * checkbox up beside an input / text box of a different height. A hard `12px`
 * (or `0.75em`, or `0.75rem`) would only be correct for one of those.
 *
 * `85%` is the previous `0.75rem` glyph in a `1rem` border-box box carrying a
 * `1px` border, expressed against the content box the percentage resolves
 * against (12 / 14). Holding the *ratio* instead of the length reproduces the
 * old rendering at every size tier and drops the need for per-size glyph rules
 * in the stylesheet entirely.
 *
 * The percentage resolves against the indicator, which `<VCFormCheckbox>`
 * stretches to fill the box inline — the structural stylesheet declares the
 * same `width/height: 100%`, but it is an opt-in import and the glyph has to
 * size correctly without it (that is the whole point of #1694).
 */
function renderCheckboxGlyph(state: FormCheckboxState): VNode {
    return h(
        'svg',
        {
            'class': 'vc-form-checkbox-glyph',
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 16 16',
            'width': '85%',
            'height': '85%',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': 'true',
            'focusable': 'false',
        },
        [h('path', { d: state === 'indeterminate' ? 'M4 8h8' : 'M3.5 8.5l3 3 6-7' })],
    );
}

const formCheckboxProps = {
    /** Controlled checked state. `null` is accepted as the documented "unset" value. */
    modelValue: {
        type: [Boolean, String, null] as PropType<FormCheckboxModelValue>,
        default: undefined,
    },
    /** Form-submission value when the checkbox is checked. */
    value: { type: [String, Number, Boolean, Object] as PropType<unknown>, default: 'on' },
    /** When `true`, prevents the user from interacting with the checkbox. */
    disabled: { type: Boolean, default: false },
    /** Marks the underlying form field as required. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Element id; falls back to an SSR-safe generated id. */
    id: { type: String, default: undefined },
    /** Vuecs convention: render the label by default. Internal control flow, not forwarded to Reka. */
    label: { type: Boolean, default: true },
    /** Default label text (resolved through DefaultsManager). */
    labelContent: { type: String, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormCheckboxThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormCheckboxProps = ExtractPublicPropTypes<typeof formCheckboxProps>;

export default defineComponent({
    name: 'VCFormCheckbox',
    inheritAttrs: false,
    props: formCheckboxProps,
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        label: FormCheckboxLabelSlotProps;
        indicator: FormCheckboxIndicatorSlotProps;
    }>,
    setup(props, {
        attrs,
        emit,
        slots,
    }) {
        const theme = useComponentTheme('formCheckbox', useFormInputThemeProps(props), formCheckboxThemeDefaults);
        const defaults = useComponentDefaults('formCheckbox', props, behavioralDefaults);
        // SSR-safe stable id (Vue 3.5's native `useId` under the hood).
        // Replaces a `Math.random()` fallback that caused hydration
        // mismatches and made IDs non-deterministic across renders.
        const fallbackId = useId(undefined, 'vc-form-checkbox');

        return () => {
            const resolved = theme.value;
            const resolvedDefaults = defaults.value;
            const id = props.id ?? fallbackId;

            const checkbox = h(
                CheckboxRoot,
                mergeProps(attrs, {
                    id,
                    value: props.value,
                    name: props.name,
                    modelValue: props.modelValue,
                    disabled: props.disabled,
                    required: props.required,
                    'onUpdate:modelValue': (value: FormCheckboxModelValue) => emit('update:modelValue', value),
                    class: resolved.root || undefined,
                }),
                {
                    default: ({ state }: { state: FormCheckboxState }) => h(
                        CheckboxIndicator,
                        {
                            class: resolved.indicator || undefined,
                            // Mirrors the structural `.vc-form-checkbox-indicator`
                            // rule inline so the glyph's percentage sizing has a
                            // definite box to resolve against even when the
                            // stylesheet isn't imported (#1694). No shipping theme
                            // sizes this slot — they contribute colour + centering.
                            style: { width: '100%', height: '100%' },
                        },
                        {
                            default: () => {
                                const content = slots.indicator?.({ class: resolved.indicator, state });
                                return isMeaningfulSlotContent(content) ?
                                    content :
                                    renderCheckboxGlyph(state);
                            },
                        },
                    ),
                },
            );

            if (!props.label) {
                return checkbox;
            }

            const labelNode = slots.label ?
                slots.label({ class: resolved.label, id }) :
                h('label', { class: resolved.label || undefined, for: id }, [resolvedDefaults.labelContent]);

            return h('div', { class: resolved.group || undefined }, [checkbox, labelNode]);
        };
    },
});
</script>
