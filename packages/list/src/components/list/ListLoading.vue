<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { injectListContextOrThrow } from './context';
import type { ListLoadingThemeClasses } from './types';

const listLoadingProps = {
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListLoadingProps = ExtractPublicPropTypes<typeof listLoadingProps>;

export default defineComponent({
    name: 'VCListLoading',
    props: listLoadingProps,
    setup(props) {
        const theme = useComponentTheme('listLoading', props, { classes: { root: 'vc-list-loading' } });
        const ctx = injectListContextOrThrow('VCListLoading');
        return { theme, ctx };
    },
});
</script>

<template>
    <component
        :is="tag"
        v-if="ctx.busy.value"
        :class="theme.root || undefined"
    >
        <slot v-bind="ctx" />
    </component>
</template>
