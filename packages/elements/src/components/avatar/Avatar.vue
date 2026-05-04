<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { avatarThemeDefaults } from './theme';
import type { AvatarThemeClasses } from './types';

export type AvatarFallbackSlotProps = {
    /** Resolved theme class for the fallback wrapper. */
    class: string;
};

const avatarProps = {
    /** Image source. When omitted, the fallback renders immediately. */
    src: { type: String, default: undefined },
    /**
     * Image alt text. Defaults to `''` so the rendered `<img>` always
     * carries the attribute (decorative-image semantics) — pass a
     * meaningful string when the avatar conveys identity.
     */
    alt: { type: String, default: '' },
    /**
     * Delay (ms) before the fallback appears. Useful to avoid a flicker
     * on fast connections — gives the image a brief window to load before
     * the placeholder shows. Forwarded to Reka's `AvatarFallback`.
     *
     * Vuecs convention: keep this at `undefined` rather than mirroring a
     * concrete Reka default. Reka's `AvatarFallback` treats `delayMs: 0`
     * as "wait forever" instead of "render immediately"; the spread-guard
     * in `setup()` works around that quirk so omitting the prop renders
     * the fallback right away. This is the ONE place where the
     * Reka-wrapping convention's natural-forwarding rule is bent.
     */
    delayMs: { type: Number, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AvatarThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AvatarProps = ExtractPublicPropTypes<typeof avatarProps>;

export default defineComponent({
    name: 'VCAvatar',
    inheritAttrs: false,
    props: avatarProps,
    slots: Object as SlotsType<{
        fallback: AvatarFallbackSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('avatar', props, avatarThemeDefaults);
        return () => {
            const resolved = theme.value;
            const children = [];
            if (props.src) {
                children.push(h(AvatarImage, {
                    src: props.src,
                    alt: props.alt,
                    class: resolved.image || undefined,
                }));
            }
            children.push(h(AvatarFallback, {
                // Reka's AvatarFallback treats `delayMs: 0` as "wait
                // forever" — only forward when the consumer set a strictly
                // positive value. Omitted (or 0/negative) → fallback
                // renders immediately.
                ...(typeof props.delayMs === 'number' && props.delayMs > 0 ?
                    { delayMs: props.delayMs } :
                    {}),
                class: resolved.fallback || undefined,
            }, { default: () => slots.fallback?.({ class: resolved.fallback }) ?? '' }));
            return h(AvatarRoot, mergeProps(attrs, { class: resolved.root || undefined }), { default: () => children });
        };
    },
});
</script>
