<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { provideHeadCellCountContext } from '../composables/context';
import type { TableFooterThemeClasses } from '../types';

const tableFooterThemeDefaults = { classes: { root: 'vc-table-footer' } };

const tableFooterProps = { ...themableProps<TableFooterThemeClasses>() };

export type TableFooterProps = ExtractPublicPropTypes<typeof tableFooterProps>;

export default defineComponent({
    name: 'VCTableFooter',
    inheritAttrs: false,
    props: tableFooterProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'tableFooter',
            useThemeProps(props),
            tableFooterThemeDefaults,
        );

        // Provide a no-op head-cell-count context so `<VCTableHeadCell>`s
        // inside `<tfoot>` don't double-register against the colspan auto-count
        // (which is meant to reflect the header band, not the footer band).
        provideHeadCellCountContext({ register: () => {}, unregister: () => {} });

        return () => h(
            'tfoot',
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
