<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DialogClose } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

export default defineComponent({
    name: 'VCModalClose',
    props: {
        as: { type: String, default: 'button' },
        asChild: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);
        return () => {
            // When the consumer doesn't supply slot content the rendered
            // button only contains the "×" glyph (U+00D7), which screen
            // readers announce as "multiplication sign". Provide a default
            // aria-label so the fallback is accessible out of the box;
            // consumers can still override via attrs.
            const hasSlot = !!slots.default;
            const ariaLabel = (attrs['aria-label'] as string | undefined) ??
                (hasSlot ? undefined : 'Close');
            return h(
                DialogClose,
                {
                    as: props.as,
                    asChild: props.asChild,
                    class: theme.value.close || undefined,
                    'aria-label': ariaLabel,
                },
                { default: () => slots.default?.() ?? '×' },
            );
        };
    },
});
</script>
