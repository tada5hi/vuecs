import {
    defineComponent, 
    h,
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    themableProps, 
    useComponentTheme, 
    useThemeProps,
} from '@vuecs/core';
import { placeholderCardThemeDefaults } from '../theme';
import type {
    PlaceholderAnimation, 
    PlaceholderCardThemeClasses,
} from '../types';
import { VCPlaceholder } from './Placeholder';

const placeholderCardProps = {
    /** Skip the header line. */
    noHeader: { type: Boolean, default: false },
    /** Skip the footer block. */
    noFooter: { type: Boolean, default: false },
    /** Skip the cover-image placeholder. */
    noImg: { type: Boolean, default: false },
    /**
     * Cover-image placeholder height. CSS length (`'180px'`, `'12rem'`).
     */
    imgHeight: { type: String, default: '180px' },
    /** Number of body lines below the header. */
    bodyLines: { type: Number, default: 3 },
    /** Animation pattern. Forwarded to every inner `<VCPlaceholder>`. */
    animation: { type: String as PropType<PlaceholderAnimation>, default: 'wave' },
    ...themableProps<PlaceholderCardThemeClasses>(),
};

export type PlaceholderCardProps = ExtractPublicPropTypes<typeof placeholderCardProps>;

/**
 * Card-shaped skeleton — cover image + header line + body lines +
 * footer block. Each section is independently togglable via the
 * `:no-*` props.
 */
export const VCPlaceholderCard = defineComponent({
    name: 'VCPlaceholderCard',
    props: placeholderCardProps,
    setup(props) {
        const theme = useComponentTheme(
            'placeholderCard',
            useThemeProps(props),
            placeholderCardThemeDefaults,
        );
        return () => {
            const t = theme.value;
            const children: unknown[] = [];

            if (!props.noImg) {
                children.push(h(
                    'div',
                    {
                        class: t.image || undefined,
                        style: { height: props.imgHeight },
                    },
                    [h(VCPlaceholder, { animation: props.animation, width: '100%' })],
                ));
            }

            if (!props.noHeader) {
                children.push(h(
                    'div',
                    { class: t.header || undefined },
                    [h(VCPlaceholder, {
                        animation: props.animation, 
                        width: '70%', 
                        size: 'lg',
                    })],
                ));
            }

            const bodyLines = Math.max(0, props.bodyLines);
            if (bodyLines > 0) {
                // Deterministic widths so the same line has the same
                // width across renders. The last line is shorter to
                // mimic a final paragraph wrap.
                const widths = ['100%', '95%', '90%', '88%', '92%'];
                const bodyChildren = Array.from({ length: bodyLines }, (_, i) => {
                    const last = i === bodyLines - 1;
                    const width = last ? '60%' : widths[i % widths.length];
                    return h(VCPlaceholder, { animation: props.animation, width });
                });
                children.push(h(
                    'div',
                    { class: t.body || undefined },
                    bodyChildren,
                ));
            }

            if (!props.noFooter) {
                children.push(h(
                    'div',
                    { class: t.footer || undefined },
                    [
                        h(VCPlaceholder, { animation: props.animation, width: '35%' }),
                        h(VCPlaceholder, { animation: props.animation, width: '30%' }),
                    ],
                ));
            }

            return h(
                'div',
                {
                    class: t.root || undefined,
                    'aria-hidden': 'true',
                    role: 'presentation',
                },
                children as never,
            );
        };
    },
});
