<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import type { TableHeaderThemeClasses } from '../types';

const tableHeaderThemeDefaults = { classes: { root: 'vc-table-header' } };

const tableHeaderProps = { ...themableProps<TableHeaderThemeClasses>() };

export type TableHeaderProps = ExtractPublicPropTypes<typeof tableHeaderProps>;

export default defineComponent({
    name: 'VCTableHeader',
    inheritAttrs: false,
    props: tableHeaderProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'tableHeader',
            useThemeProps(props),
            tableHeaderThemeDefaults,
        );
        return () => h(
            'thead',
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
