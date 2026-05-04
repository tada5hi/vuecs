<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
import { tagThemeDefaults } from './theme';
import type { TagSize, TagThemeClasses } from './types';

export type TagSlotProps = {
    /** Resolved theme class for the matching slot. */
    class: string;
};

export type TagRemoveSlotProps = TagSlotProps & {
    /** Invoke to fire the chip's `remove` event with its bound value. */
    remove: () => void;
};

export type TagDefaultSlotProps = {
    /** Resolved label string (`label ?? String(value) ?? ''`). */
    label: string;
};

const tagProps = {
    /** Bound value — emitted on remove, also used by `<VCTags>` as the chip key. */
    value: { type: [String, Number] as PropType<string | number>, default: undefined },
    /** Display label. Default slot wins if both are passed. */
    label: { type: String, default: undefined },
    /** Iconify-style icon name forwarded to the leading `icon` slot. */
    icon: { type: String, default: undefined },
    /** When `true`, renders the trailing remove button. */
    removable: { type: Boolean, default: false },
    /** Size variant key — resolved by the active theme. */
    size: { type: String as PropType<TagSize>, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<TagThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type TagProps = ExtractPublicPropTypes<typeof tagProps>;

export default defineComponent({
    name: 'VCTag',
    inheritAttrs: false,
    props: tagProps,
    emits: ['remove'],
    slots: Object as SlotsType<{
        default: TagDefaultSlotProps;
        icon: TagSlotProps;
        remove: TagRemoveSlotProps;
    }>,
    setup(props, {
        attrs,
        slots,
        emit,
    }) {
        const themeProps: UseComponentThemeProps<TagThemeClasses> = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return {
                    ...(props.themeVariant ?? {}),
                    ...(props.size !== undefined ? { size: props.size } : {}),
                };
            },
        };
        const theme = useComponentTheme('tag', themeProps, tagThemeDefaults);
        return () => {
            const resolved = theme.value;
            const label = props.label ?? (props.value !== undefined ? String(props.value) : '');
            const children = [];

            if (props.icon || slots.icon) {
                const iconSlot = slots.icon;
                children.push(h('span', { class: resolved.icon || undefined }, iconSlot ?
                    iconSlot({ class: resolved.icon }) :
                    [props.icon]));
            }

            children.push(slots.default ?
                slots.default({ label }) :
                [label]);

            if (props.removable) {
                const remove = () => emit('remove', props.value);
                children.push(slots.remove ?
                    slots.remove({ class: resolved.remove, remove }) :
                    h('button', {
                        type: 'button',
                        'aria-label': label ? `Remove ${label}` : 'Remove',
                        class: resolved.remove || undefined,
                        onClick: (event: Event) => {
                            event.stopPropagation();
                            remove();
                        },
                    }, '×'));
            }

            return h('span', mergeProps(attrs, { class: resolved.root || undefined }), children);
        };
    },
});
</script>
