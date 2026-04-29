<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { injectListContextOrThrow } from './context';
import type { ListNoMoreDefaults, ListNoMoreThemeClasses } from './types';

const listNoMoreProps = {
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListNoMoreThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListNoMoreProps = ExtractPublicPropTypes<typeof listNoMoreProps>;

const behavioralDefaults: ListNoMoreDefaults = { content: 'No data available...' };

export default defineComponent({
    name: 'VCListNoMore',
    props: listNoMoreProps,
    setup(props) {
        const theme = useComponentTheme('listNoMore', props, { classes: { root: 'vc-list-no-more' } });
        const defaults = useComponentDefaults('listNoMore', props, behavioralDefaults);
        const ctx = injectListContextOrThrow('VCListNoMore');
        return {
            theme, 
            defaults, 
            ctx, 
        };
    },
});
</script>

<template>
    <component
        :is="tag"
        v-if="ctx.isEmpty.value"
        :class="theme.root || undefined"
    >
        <slot v-bind="ctx">
            {{ defaults.content }}
        </slot>
    </component>
</template>
