import {
    defineComponent, 
    h, 
    mergeProps,
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    themableProps, 
    useComponentTheme, 
    useThemeProps,
} from '@vuecs/core';
import { placeholderThemeDefaults } from '../theme';
import type {
    PlaceholderAnimation, 
    PlaceholderSize, 
    PlaceholderThemeClasses,
} from '../types';

const placeholderProps = {
    /**
     * Width of the bar — either a CSS length (`'100%'`, `'12rem'`)
     * or a number interpreted as a percentage (`50` → `'50%'`).
     * Mirrors `bootstrap-vue-next`'s convention.
     */
    width: { type: [String, Number], default: '100%' },
    /** Size tier — drives bar height via the `size` theme variant. */
    size: { type: String as PropType<PlaceholderSize>, default: undefined },
    /**
     * Shimmer animation. `wave` and `glow` are the two canonical
     * patterns; `none` disables the animation entirely (e.g. for
     * `prefers-reduced-motion` callers).
     */
    animation: { type: String as PropType<PlaceholderAnimation>, default: 'wave' },
    /** Render-as tag. Defaults to `'span'` (inline-block placeholder bar). */
    tag: { type: String, default: 'span' },
    ...themableProps<PlaceholderThemeClasses>(),
};

export type PlaceholderProps = ExtractPublicPropTypes<typeof placeholderProps>;

/**
 * Single animated placeholder bar — the building block. Use directly
 * for ad-hoc skeletons (`<VCPlaceholder width="60%" size="lg" />`) or
 * compose into `<VCPlaceholderTable>` / `<VCPlaceholderCard>`.
 *
 * `:width` accepts either a CSS length (`'100%'`, `'12rem'`) or a
 * number (interpreted as a percentage — `50` → `'50%'`). `:size`
 * drives the bar height via the `size` theme variant. The animation
 * wrapper (`vc-placeholder-wave` / `vc-placeholder-glow`) lives on
 * the SAME element as the bar by default — themes can override the
 * `wave` / `glow` slot keys to lift the animation to a parent wrapper
 * when their CSS strategy requires it (Bootstrap's `.placeholder-wave`
 * traditionally sits on a parent, but the per-bar form works there
 * too).
 */
export const VCPlaceholder = defineComponent({
    name: 'VCPlaceholder',
    inheritAttrs: false,
    props: placeholderProps,
    setup(props, { attrs }) {
        const theme = useComponentTheme(
            'placeholder',
            useThemeProps(props, 'size'),
            placeholderThemeDefaults,
        );
        return () => {
            const t = theme.value;
            const rawWidth = props.width;
            const widthStyle = typeof rawWidth === 'number' ?
                `${rawWidth}%` :
                rawWidth;
            let animationClass: string | undefined;
            if (props.animation === 'wave') animationClass = t.wave;
            else if (props.animation === 'glow') animationClass = t.glow;
            return h(
                props.tag,
                mergeProps(attrs, {
                    class: [t.root || undefined, animationClass || undefined],
                    style: { width: widthStyle },
                    'aria-hidden': 'true',
                    'data-animation': props.animation,
                }),
            );
        };
    },
});
