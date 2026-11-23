<script lang="ts">
import { useComponentDefaults, useComponentTheme, useId } from '@vuecs/core';
import type {
    ComponentDefaultValues,
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import type {
    ExtractPublicPropTypes,
    PropType,
    VNodeChild,
} from 'vue';
import {
    computed,
    defineComponent,
    h,
    onMounted,
    ref,
} from 'vue';
import { DATE_RANGE_PRESET_LABELS, createDateRangePresets, resolveDateRangePreset } from '../../utils/date-range';
import type { DateRangePreset, DateRangeValue } from '../../utils/date-range';
import FormInput from '../form-input/FormInput.vue';

export type FormDateRangeThemeClasses = {
    root: string;
    /** Wrapper around the two date fields. */
    fields: string;
    /** Wrapper around one label + input pair. */
    field: string;
    /** The `<label>` of a date field. */
    label: string;
    /** The `role="group"` wrapper around the preset buttons. */
    presets: string;
    /** Every preset button. */
    preset: string;
    /** Added to the preset button whose range equals the model. */
    presetActive: string;
};

export type FormDateRangeDefaults = {
    /** Label of the start-date field. */
    fromLabel: string;
    /** Label of the end-date field. */
    toLabel: string;
    /** Accessible name (`aria-label`) of the preset button group. */
    presetsLabel: string;
    /** Label of the built-in "Last 7 days" preset. */
    last7DaysLabel: string;
    /** Label of the built-in "This month" preset. */
    thisMonthLabel: string;
    /** Label of the built-in "This year" preset. */
    thisYearLabel: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public type name and declaration merging.
    interface ThemeElements {
        formDateRange?: ThemeElementDefinition<FormDateRangeThemeClasses>;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public type name and declaration merging.
    interface ComponentDefaults {
        formDateRange?: ComponentDefaultValues<FormDateRangeDefaults>;
    }
}

export const formDateRangeThemeDefaults: ComponentThemeDefinition<FormDateRangeThemeClasses> = {
    classes: {
        root: 'vc-form-date-range',
        fields: 'vc-form-date-range-fields',
        field: 'vc-form-date-range-field',
        label: 'vc-form-date-range-label',
        presets: 'vc-form-date-range-presets',
        preset: 'vc-form-date-range-preset',
        presetActive: 'vc-form-date-range-preset-active',
    },
};

const behavioralDefaults: FormDateRangeDefaults = {
    fromLabel: 'From',
    toLabel: 'To',
    presetsLabel: 'Presets',
    last7DaysLabel: DATE_RANGE_PRESET_LABELS.last7Days,
    thisMonthLabel: DATE_RANGE_PRESET_LABELS.thisMonth,
    thisYearLabel: DATE_RANGE_PRESET_LABELS.thisYear,
};

const formDateRangeProps = {
    /** Controlled range (v-model): local days as `YYYY-MM-DD`; a cleared side is an absent key. */
    modelValue: { type: Object as PropType<DateRangeValue>, default: () => ({}) },
    /** Preset shortcuts. Defaults to Last 7 days / This month / This year; `[]` hides the preset group. */
    presets: { type: Array as PropType<DateRangePreset[]>, default: undefined },
    /**
     * Reference instant presets resolve against (a `Date` or a getter). Defaults to the current time;
     * without it the active-preset highlight renders only after mount (SSR-safe).
     */
    now: { type: [Date, Function] as PropType<Date | (() => Date)>, default: undefined },
    /** Label of the start-date field. Falls back to the global `formDateRange.fromLabel` default. */
    fromLabel: { type: String, default: undefined },
    /** Label of the end-date field. Falls back to the global `formDateRange.toLabel` default. */
    toLabel: { type: String, default: undefined },
    /** Accessible name of the preset group. Falls back to the global `formDateRange.presetsLabel` default. */
    presetsLabel: { type: String, default: undefined },
    /** When `true`, disables both inputs and every preset button. */
    disabled: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<FormDateRangeThemeClasses>>, default: undefined },
    /** Theme variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type FormDateRangeProps = ExtractPublicPropTypes<typeof formDateRangeProps>;

type DateRangeField = keyof DateRangeValue;

export default defineComponent({
    name: 'VCFormDateRange',
    props: formDateRangeProps,
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const theme = useComponentTheme('formDateRange', props, formDateRangeThemeDefaults);
        const defaults = useComponentDefaults('formDateRange', props, behavioralDefaults);

        const id = useId(undefined, 'vc-form-date-range');
        const fromId = `${id}-from`;
        const toId = `${id}-to`;

        const presets = computed<DateRangePreset[]>(() => {
            if (props.presets) {
                return props.presets;
            }

            const labels = defaults.value;

            return createDateRangePresets({
                last7Days: labels.last7DaysLabel,
                thisMonth: labels.thisMonthLabel,
                thisYear: labels.thisYearLabel,
            });
        });

        const resolveNow = (): Date => {
            if (typeof props.now === 'function') {
                return props.now();
            }

            return props.now ?? new Date();
        };

        // SSR: without an explicit `now`, server and client clocks / time
        // zones can disagree on which preset matches, and hydration does
        // not patch mismatched attrs / classes. So the highlight is
        // computed only after mount; until then every preset renders
        // `aria-pressed="false"`. An explicit `now` is deterministic (the
        // consumer's responsibility to keep identical on both sides), so
        // it highlights immediately.
        const mounted = ref(false);

        onMounted(() => {
            mounted.value = true;
        });

        // `null` (e.g. a reset filter ref) reads as an empty range — Vue
        // applies the `{}` default only for `undefined`.
        const readModel = (): DateRangeValue => props.modelValue ?? {};

        // Built from `props.modelValue` at event time — never from a local
        // copy — so a parent update between two edits is never lost.
        const updateField = (field: DateRangeField, value: string | null | undefined) => {
            const next: DateRangeValue = { ...readModel() };

            if (value) {
                next[field] = value;
            } else {
                delete next[field];
            }

            emit('update:modelValue', next);
        };

        const applyPreset = (preset: DateRangePreset) => {
            if (props.disabled) {
                return;
            }

            emit('update:modelValue', resolveDateRangePreset(preset, resolveNow()));
        };

        const renderField = (
            field: DateRangeField,
            inputId: string,
            label: string,
            bound: Record<string, string | undefined>,
        ): VNodeChild => {
            const resolved = theme.value;

            return h('div', { class: resolved.field || undefined }, [
                h('label', { class: resolved.label || undefined, for: inputId }, label),
                h(FormInput, {
                    id: inputId,
                    type: 'date',
                    modelValue: readModel()[field] ?? '',
                    disabled: props.disabled,
                    ...bound,
                    'onUpdate:modelValue': (value: string) => updateField(field, value),
                }),
            ]);
        };

        return () => {
            const resolved = theme.value;
            const labels = defaults.value;
            const { from, to } = readModel();

            const children: VNodeChild[] = [
                h('div', { class: resolved.fields || undefined }, [
                    renderField('from', fromId, labels.fromLabel, { max: to || undefined }),
                    renderField('to', toId, labels.toLabel, { min: from || undefined }),
                ]),
            ];

            if (presets.value.length > 0) {
                const now = resolveNow();
                const canHighlight = mounted.value || props.now !== undefined;

                children.push(h('div', {
                    class: resolved.presets || undefined,
                    role: 'group',
                    'aria-label': labels.presetsLabel,
                }, presets.value.map((preset) => {
                    let active = false;

                    if (canHighlight) {
                        const range = resolveDateRangePreset(preset, now);

                        active = range.from === from && range.to === to;
                    }

                    return h('button', {
                        key: preset.key,
                        type: 'button',
                        class: [resolved.preset, active ? resolved.presetActive : undefined],
                        disabled: props.disabled,
                        'aria-pressed': active ? 'true' : 'false',
                        onClick: () => applyPreset(preset),
                    }, preset.label);
                })));
            }

            return h('div', { class: resolved.root || undefined }, children);
        };
    },
});
</script>
