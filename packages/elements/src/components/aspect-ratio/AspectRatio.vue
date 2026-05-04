<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { AspectRatio } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { aspectRatioThemeDefaults } from './theme';
import type { AspectRatioThemeClasses } from './types';

const aspectRatioProps = {
    /** Desired ratio — width / height (e.g. `16/9`, `4/3`, `1`). */
    ratio: { type: Number, default: 1 },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AspectRatioThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AspectRatioProps = ExtractPublicPropTypes<typeof aspectRatioProps>;

export default defineComponent({
    name: 'VCAspectRatio',
    inheritAttrs: false,
    props: aspectRatioProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('aspectRatio', props, aspectRatioThemeDefaults);
        return () => h(AspectRatio, mergeProps(attrs, {
            ratio: props.ratio,
            class: theme.value.root || undefined,
        }), { default: () => slots.default?.() });
    },
});
</script>
