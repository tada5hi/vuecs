<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import VCTag from './Tag.vue';
import { tagsThemeDefaults } from './theme';
import type { TagItem, TagSize, TagsThemeClasses } from './types';

export type TagsItem = TagItem | string | number;

export type TagsSlotProps = {
    item: TagItem;
    index: number;
    /** Resolved per-item wrapper class. */
    class: string;
};

const tagsProps = {
    /**
     * Items to render. Strings/numbers are coerced to `{ value, label: String(value) }`.
     * Objects follow the `TagItem` shape (structurally compatible with `FormOption`).
     */
    items: { type: Array as PropType<TagsItem[]>, default: () => [] },
    /** When `true`, every chip renders its remove button (per-item `disabled` opts out). */
    removable: { type: Boolean, default: false },
    /** Default size forwarded to every chip; per-item `size` overrides. */
    size: { type: String as PropType<TagSize>, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<TagsThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type TagsProps = ExtractPublicPropTypes<typeof tagsProps>;

function normalize(item: TagsItem): TagItem {
    if (typeof item === 'string' || typeof item === 'number') {
        return { value: item, label: String(item) };
    }
    return item;
}

export default defineComponent({
    name: 'VCTags',
    inheritAttrs: false,
    props: tagsProps,
    emits: ['remove'],
    slots: Object as SlotsType<{
        item: TagsSlotProps;
    }>,
    setup(props, {
        attrs,
        slots,
        emit,
    }) {
        const theme = useComponentTheme('tags', props, tagsThemeDefaults);
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
                    key: item.value,
                    value: item.value,
                    label: item.label,
                    icon: item.icon,
                    size: item.size ?? props.size,
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
