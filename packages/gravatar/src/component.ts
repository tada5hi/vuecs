import { extend, useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import { VCAvatar } from '@vuecs/elements';
import md5 from 'md5';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import {
    computed,
    defineComponent,
    h,
} from 'vue';

export type GravatarThemeClasses = {
    /** Outer wrapper — composed onto `<VCAvatar>`'s `root` slot. */
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        gravatar?: ThemeElementDefinition<GravatarThemeClasses>;
    }
}

const themeDefaults = { classes: { root: '' } };

export type GravatarFallbackSlotProps = {
    class: string;
};

const gravatarProps = {
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<GravatarThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    /** Email address used to derive the Gravatar hash (md5 of trimmed/lowercased value). */
    email: { type: String, default: '' },
    /** Pre-computed Gravatar hash. When set, takes precedence over `email`. */
    hash: { type: String, default: '' },
    /** Image size in pixels (also drives the inline width/height). */
    size: { type: Number, default: 80 },
    /** Gravatar `d=` parameter — fallback image style or URL (e.g. `retro`, `mp`, `identicon`). */
    defaultImg: { type: String, default: 'retro' },
    /** Gravatar `r=` parameter — content rating filter (`g`, `pg`, `r`, `x`). */
    rating: { type: String, default: 'g' },
    /** `alt` text forwarded to the underlying image. */
    alt: { type: String, default: 'Avatar' },
    /** URL protocol prefix (e.g. `'https'`). Empty means protocol-relative. */
    protocol: { type: String, default: '' },
    /** Gravatar service host (override for self-hosted alternatives). */
    hostname: { type: String, default: 'www.gravatar.com' },
    /**
     * Delay (ms) before the fallback appears if the Gravatar image hasn't
     * loaded yet. Forwarded to `<VCAvatar>` (Reka's `AvatarFallback`).
     * Useful to avoid a flicker on fast connections — Gravatar's
     * `defaultImg` already returns a deterministic placeholder, so the
     * fallback only fires on network failure. Omit (default) to render
     * the fallback immediately on failure (see `<VCAvatar>` for the Reka
     * `delayMs: 0` quirk handled there).
     */
    delayMs: { type: Number, default: undefined },
};

export type GravatarProps = ExtractPublicPropTypes<typeof gravatarProps>;

export const VCGravatar = defineComponent({
    name: 'VCGravatar',
    inheritAttrs: false,
    props: gravatarProps,
    slots: Object as SlotsType<{
        fallback: GravatarFallbackSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('gravatar', props, themeDefaults);

        const url = computed(() => {
            const protocol = props.protocol.slice(-1) === ':' ?
                props.protocol :
                `${props.protocol}:`;
            const img = [
                `${protocol === ':' ? '' : protocol}//${props.hostname}/avatar/`,
                props.hash || md5(props.email.trim().toLowerCase()),
                `?s=${props.size}`,
                `&d=${props.defaultImg}`,
                `&r=${props.rating}`,
            ];
            return img.join('');
        });

        return () => h(
            VCAvatar,
            {
                ...attrs,
                src: url.value,
                alt: props.alt,
                delayMs: props.delayMs,
                // Compose the `gravatar.root` slot onto VCAvatar's root via
                // the per-instance theme override. `extend()` merges with
                // the avatar layer instead of replacing it — consumers who
                // style the `gravatar` theme key see their classes layered
                // on top of avatar's structural defaults.
                themeClass: theme.value.root ? { root: extend(theme.value.root) } : undefined,
                // Inline width/height honors the `size` prop. VCAvatar's
                // structural CSS sets a default 2.5rem circle; this lets
                // consumers keep the previous "size in pixels" knob.
                style: `width: ${props.size}px; height: ${props.size}px;`,
            },
            { fallback: (slotProps: { class: string }) => slots.fallback?.(slotProps) ?? '' },
        );
    },
});
