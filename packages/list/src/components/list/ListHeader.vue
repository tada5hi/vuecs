<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { injectListContextOrThrow } from './context';
import type { ListHeaderThemeClasses } from './types';

const listHeaderProps = {
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListHeaderThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListHeaderProps = ExtractPublicPropTypes<typeof listHeaderProps>;

export default defineComponent({
    name: 'VCListHeader',
    props: listHeaderProps,
    setup(props) {
        const theme = useComponentTheme('listHeader', props, { classes: { root: 'vc-list-header' } });
        const ctx = injectListContextOrThrow('VCListHeader');
        return { theme, ctx };
    },
});
</script>

<template>
    <component
        :is="tag"
        :class="theme.root || undefined"
    >
        <slot v-bind="ctx" />
    </component>
</template>
