import { placeholderProps } from './props';
import { defineComponent, h, mergeProps } from 'vue';

import { useComponentTheme, useThemeProps } from '@vuecs/core';
import { placeholderThemeDefaults } from '../theme';


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
            useThemeProps(props, 'size', 'shape'),
            placeholderThemeDefaults,
        );

        return () => {
            const t = theme.value;
            const rawWidth = props.width;
            // Clamp negative numeric widths to 0 — `width: -50%` is
            // dropped by the browser anyway, leaving the bar at zero
            // width. Returning `'0%'` makes the contract explicit
            // (the browser still collapses, but the rendered HTML
            // matches what a consumer would expect from the input).
            // String widths pass through verbatim — consumers
            // passing invalid CSS get the same browser behavior they
            // would with any inline `style.width`.
            const widthStyle = typeof rawWidth === 'number' ?
                `${Math.max(0, rawWidth)}%` :
                rawWidth;
            let animationClass: string | undefined;

            if (props.animation === 'wave') {
                animationClass = t.wave;
            } else if (props.animation === 'glow') {
                animationClass = t.glow;
            }

            const style: Record<string, string> = { width: widthStyle };

            if (props.duration !== undefined) {
                style.animationDuration = props.duration;
            }

            return h(
                props.tag ?? props.as,
                mergeProps(attrs, {
                    class: [t.root || undefined, animationClass || undefined],
                    style,
                    'aria-hidden': 'true',
                    'data-animation': props.animation,
                }),
            );
        };
    },
});
