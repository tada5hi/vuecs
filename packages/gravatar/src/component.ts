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

import '../assets/gravatar.css';

export type GravatarThemeClasses = {
    /** Outer wrapper — composed onto `<VCAvatar>`'s `root` slot. */
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        gravatar?: ThemeElementDefinition<GravatarThemeClasses>;
    }
}

const themeDefaults = { classes: { root: 'vc-gravatar' } };

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
    /**
     * Image resolution served by Gravatar (drives the URL's `?s=` parameter,
     * range 1–2048). This controls **only** the served-image quality, not
     * the rendered size on the page — visual sizing is owned by the theme
     * system (`gravatar.root` / `avatar.root` theme classes, or per-instance
     * `themeClass`). Match `size` to your displayed pixel dimensions (or 2×
     * for retina) to avoid up-/down-scaling.
     */
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
     * Delay (ms) before the `<VCAvatar>` fallback becomes visible while
     * the Gravatar image is still loading (and persists if it ultimately
     * fails). Useful to avoid a flicker on fast connections by giving the
     * image a brief window to appear before the placeholder shows up.
     * Forwarded to `<VCAvatar>` (Reka's `AvatarFallback`); omit (default)
     * to render the fallback immediately. In practice the fallback most
     * often "sticks" on network failure, since Gravatar's `defaultImg`
     * usually returns a deterministic placeholder. Only strictly positive
     * values are forwarded — see `<VCAvatar>` for the Reka `delayMs: 0`
     * quirk handled there.
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
                // on top of avatar's structural defaults. Visual sizing
                // lives entirely in `gravatar.root` (themes ship a 5rem /
                // 80px default to preserve the historical visual default);
                // the `size` prop only feeds the Gravatar URL.
                themeClass: theme.value.root ? { root: extend(theme.value.root) } : undefined,
            },
            { fallback: (slotProps: { class: string }) => slots.fallback?.(slotProps) ?? '' },
        );
    },
});
