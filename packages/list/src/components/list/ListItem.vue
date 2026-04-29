<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import type { ListItemThemeClasses } from './types';

const listItemProps = {
    /** The item record this row represents. Forwarded as a slot prop. */
    data: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Index of this row in the source list. Forwarded as a slot prop. */
    index: { type: Number, default: undefined },
    tag: { type: String, default: 'div' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListItemThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListItemProps = ExtractPublicPropTypes<typeof listItemProps>;

export type ListItemSlotProps<T = unknown> = {
    data: T;
    index: number | undefined;
};

export default defineComponent({
    name: 'VCListItem',
    props: listItemProps,
    slots: Object as SlotsType<{
        default: ListItemSlotProps;
        text: ListItemSlotProps;
        actions: ListItemSlotProps;
        actionsExtra: ListItemSlotProps;
    }>,
    setup(props) {
        const theme = useComponentTheme('listItem', props, {
            classes: {
                root: 'vc-list-item',
                textWrapper: 'vc-list-item-text',
                actionsWrapper: 'vc-list-item-actions',
                actionsExtraWrapper: 'vc-list-item-actions-extra',
            },
        });
        return { theme };
    },
});
</script>

<template>
    <component
        :is="tag"
        :class="theme.root || undefined"
    >
        <template v-if="$slots.default">
            <slot
                :data="data"
                :index="index"
            />
        </template>
        <template v-else>
            <div
                v-if="$slots.text"
                :class="theme.textWrapper || undefined"
            >
                <slot
                    name="text"
                    :data="data"
                    :index="index"
                />
            </div>
            <div
                v-if="$slots.actions"
                :class="theme.actionsWrapper || undefined"
            >
                <slot
                    name="actions"
                    :data="data"
                    :index="index"
                />
            </div>
            <div
                v-if="$slots.actionsExtra"
                :class="theme.actionsExtraWrapper || undefined"
            >
                <slot
                    name="actionsExtra"
                    :data="data"
                    :index="index"
                />
            </div>
        </template>
    </component>
</template>
