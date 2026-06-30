<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { AlertDialogTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogThemeClasses } from './types';

const alertDialogTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogTriggerProps = ExtractPublicPropTypes<typeof alertDialogTriggerProps>;

export default defineComponent({
    name: 'VCAlertDialogTrigger',
    props: alertDialogTriggerProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        return () => h(
            AlertDialogTrigger,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.trigger || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
