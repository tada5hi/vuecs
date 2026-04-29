<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { injectListContextOrThrow } from './context';
import type { ListFooterThemeClasses } from './types';

const listFooterProps = {
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListFooterThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListFooterProps = ExtractPublicPropTypes<typeof listFooterProps>;

export default defineComponent({
    name: 'VCListFooter',
    props: listFooterProps,
    setup(props) {
        const theme = useComponentTheme('listFooter', props, { classes: { root: 'vc-list-footer' } });
        const ctx = injectListContextOrThrow('VCListFooter');
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
