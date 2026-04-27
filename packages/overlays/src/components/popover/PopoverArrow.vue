<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { PopoverArrow } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { popoverThemeDefaults } from './theme';
import type { PopoverThemeClasses } from './types';

export default defineComponent({
    name: 'VCPopoverArrow',
    props: {
        width: { type: Number, default: 10 },
        height: { type: Number, default: 5 },
        themeClass: { type: Object as PropType<ThemeClassesOverride<PopoverThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props) {
        const theme = useComponentTheme('popover', props, popoverThemeDefaults);
        return () => h(PopoverArrow, {
            width: props.width,
            height: props.height,
            class: theme.value.arrow || undefined,
        });
    },
});
</script>
