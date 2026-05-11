<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import {
    SliderRange,
    SliderRoot,
    SliderThumb,
    SliderTrack,
} from 'reka-ui';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    computed,
    defineComponent,
    h,
    mergeProps,
} from 'vue';

export type FormSliderThemeClasses = {
    root: string;
    track: string;
    range: string;
    thumb: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSlider?: ThemeElementDefinition<FormSliderThemeClasses>;
    }
}

export const formSliderThemeDefaults: ComponentThemeDefinition<FormSliderThemeClasses> = {
    classes: {
        root: 'vc-form-slider',
        track: 'vc-form-slider-track',
        range: 'vc-form-slider-range',
        thumb: 'vc-form-slider-thumb',
    },
};

export type FormSliderOrientation = 'horizontal' | 'vertical';
/**
 * `modelValue` accepts a single number (one thumb) or an array (one thumb per
 * entry — the "range" case for length 2, multi-thumb for longer arrays).
 */
export type FormSliderModelValue = number | number[];

const formSliderProps = {
    /** Controlled value — number for single-thumb, array for range / multi-thumb. `null` is the documented "unset" value. */
    modelValue: {
        type: [Number, Array, null] as PropType<FormSliderModelValue | null>,
        default: undefined,
    },
    /** Minimum value for the range. */
    min: { type: Number, default: 0 },
    /** Maximum value for the range. */
    max: { type: Number, default: 100 },
    /** Stepping interval between values. */
    step: { type: Number, default: 1 },
    /** Slider axis. */
    orientation: {
        type: String as PropType<FormSliderOrientation>,
        default: 'horizontal',
    },
    /** When `true`, the slider is visually inverted. */
    inverted: { type: Boolean, default: false },
    /** When `true`, prevents the user from interacting with the slider. */
    disabled: { type: Boolean, default: false },
    /** Marks the underlying form field as required. */
    required: { type: Boolean, default: false },
    /** Form-field name for HTML form submission. */
    name: { type: String, default: undefined },
    /** Minimum permitted steps between adjacent thumbs (multi-thumb mode). */
    minStepsBetweenThumbs: { type: Number, default: 0 },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormSliderThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormSliderProps = ExtractPublicPropTypes<typeof formSliderProps>;

export default defineComponent({
    name: 'VCFormSlider',
    inheritAttrs: false,
    props: formSliderProps,
    emits: ['update:modelValue', 'valueCommit'],
    setup(props, { attrs, emit }) {
        const theme = useComponentTheme('formSlider', props, formSliderThemeDefaults);

        // Reka's SliderRoot only accepts number[]; we support a scalar for the
        // common single-thumb case and bridge here. The shape we emit on
        // update mirrors the shape we received so v-model round-trips cleanly.
        const isScalar = computed(() => typeof props.modelValue === 'number');

        const internalValue = computed<number[]>(() => {
            if (props.modelValue === undefined || props.modelValue === null) {
                return [props.min];
            }
            return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
        });

        const handleUpdate = (next: number[]) => {
            if (isScalar.value) {
                emit('update:modelValue', next[0]);
            } else {
                emit('update:modelValue', next);
            }
        };

        const handleCommit = (next: number[]) => {
            if (isScalar.value) {
                emit('valueCommit', next[0]);
            } else {
                emit('valueCommit', next);
            }
        };

        return () => h(
            SliderRoot,
            mergeProps(attrs, {
                modelValue: internalValue.value,
                name: props.name,
                min: props.min,
                max: props.max,
                step: props.step,
                orientation: props.orientation,
                inverted: props.inverted,
                disabled: props.disabled,
                required: props.required,
                minStepsBetweenThumbs: props.minStepsBetweenThumbs,
                'onUpdate:modelValue': handleUpdate,
                onValueCommit: handleCommit,
                class: theme.value.root || undefined,
            }),
            {
                default: () => [
                    h(
                        SliderTrack,
                        { class: theme.value.track || undefined },
                        { default: () => h(SliderRange, { class: theme.value.range || undefined }) },
                    ),
                    ...internalValue.value.map((_, index) => h(SliderThumb, {
                        key: index,
                        class: theme.value.thumb || undefined,
                    })),
                ],
            },
        );
    },
});
</script>
