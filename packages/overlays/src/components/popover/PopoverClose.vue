<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { PopoverClose } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { popoverThemeDefaults } from './theme';
import type { PopoverThemeClasses } from './types';

export default defineComponent({
    name: 'VCPopoverClose',
    props: {
        as: { type: String, default: 'button' },
        asChild: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<PopoverThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots }) {
        const theme = useComponentTheme('popover', props, popoverThemeDefaults);
        return () => h(
            PopoverClose,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.close || undefined,
            },
            { default: () => slots.default?.() ?? '×' },
        );
    },
});
</script>
