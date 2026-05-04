<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import VCTag from './Tag.vue';
import { tagListThemeDefaults } from './theme';
import type { TagItem, TagListThemeClasses } from './types';

export type TagListItem = TagItem | string | number;

export type TagListSlotProps = {
    item: TagItem;
    index: number;
    /** Resolved per-item wrapper class. */
    class: string;
};

const tagListProps = {
    /**
     * Items to render. Strings/numbers are coerced to `{ value, label: String(value) }`.
     * Objects follow the `TagItem` shape (structurally compatible with `FormOption`).
     */
    items: { type: Array as PropType<TagListItem[]>, default: () => [] },
    /** When `true`, every chip renders its remove button (per-item `disabled` opts out). */
    removable: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<TagListThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type TagListProps = ExtractPublicPropTypes<typeof tagListProps>;

function normalize(item: TagListItem): TagItem {
    if (typeof item === 'string' || typeof item === 'number') {
        return { value: item, label: String(item) };
    }
    return item;
}

export default defineComponent({
    name: 'VCTagList',
    inheritAttrs: false,
    props: tagListProps,
    emits: ['remove'],
    slots: Object as SlotsType<{
        item: TagListSlotProps;
    }>,
    setup(props, {
        attrs, 
        slots, 
        emit, 
    }) {
        const theme = useComponentTheme('tagList', props, tagListThemeDefaults);
        return () => {
            const resolved = theme.value;
            const children = props.items.map((raw, index) => {
                const item = normalize(raw);
                if (slots.item) {
                    return slots.item({
                        item, 
                        index, 
                        class: resolved.item, 
                    });
                }
                return h(VCTag, {
                    key: String(item.value),
                    value: item.value,
                    label: item.label,
                    icon: item.icon,
                    removable: props.removable && !item.disabled,
                    class: resolved.item || undefined,
                    onRemove: (value: string | number | undefined) => emit('remove', value, item),
                });
            });
            return h('div', mergeProps(attrs, { class: resolved.root || undefined }), children);
        };
    },
});
</script>
