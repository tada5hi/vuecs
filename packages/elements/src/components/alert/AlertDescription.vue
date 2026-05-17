<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { alertDescriptionThemeDefaults } from './theme';
import type { AlertDescriptionThemeClasses } from './types';

const alertDescriptionProps = {
    /** HTML tag to render. */
    as: { type: String, default: 'div' },
    ...themableProps<AlertDescriptionThemeClasses>(),
};

export type AlertDescriptionProps = ExtractPublicPropTypes<typeof alertDescriptionProps>;

export default defineComponent({
    name: 'VCAlertDescription',
    inheritAttrs: false,
    props: alertDescriptionProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'alertDescription',
            useThemeProps(props),
            alertDescriptionThemeDefaults,
        );
        return () => h(
            props.as,
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
