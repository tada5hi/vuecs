<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { Comment, Text, defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType, VNode } from 'vue';
import { injectListContextOrThrow } from './context';
import type { ListBodyThemeClasses } from './types';

const listBodyProps = {
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListBodyThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListBodyProps = ExtractPublicPropTypes<typeof listBodyProps>;

/**
 * `<VCListBody>` has two modes (Q4):
 *  - **Auto-iterate** when only an `#item` slot is given (and no
 *    default-slot vnodes). Body iterates `data` from context, renders
 *    `#item` per row with `{ data, index }` slot props.
 *  - **Manual** when default-slot vnodes are present. Body renders the
 *    children as-written; iteration is the consumer's job (used for
 *    virtual scrolling and other escape-hatch scenarios). The default
 *    slot receives the full `useList()` return as slot props (Q9).
 */
function hasMeaningfulVNodes(nodes: VNode[] | undefined): boolean {
    if (!nodes) return false;
    return nodes.some((vnode) => {
        if (vnode.type === Comment) return false;
        if (vnode.type === Text) {
            const text = vnode.children;
            return typeof text === 'string' && text.trim().length > 0;
        }
        return true;
    });
}

export default defineComponent({
    name: 'VCListBody',
    props: listBodyProps,
    setup(props) {
        const theme = useComponentTheme('listBody', props, { classes: { root: 'vc-list-body' } });
        const ctx = injectListContextOrThrow('VCListBody');
        return {
            theme, 
            ctx, 
            hasMeaningfulVNodes, 
        };
    },
});
</script>

<template>
    <component
        :is="tag"
        :class="theme.root || undefined"
    >
        <template v-if="hasMeaningfulVNodes($slots.default?.(ctx as Record<string, unknown>))">
            <slot v-bind="ctx" />
        </template>
        <template v-else-if="$slots.item">
            <slot
                v-for="(item, index) in ctx.data.value"
                :key="(item as { id?: string | number })?.id ?? index"
                name="item"
                :data="item"
                :index="index"
            />
        </template>
    </component>
</template>
