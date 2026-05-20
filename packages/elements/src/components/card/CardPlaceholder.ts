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
import { VCPlaceholder } from '@vuecs/placeholder';
import type { PlaceholderAnimation } from '@vuecs/placeholder';
import { cardPlaceholderThemeDefaults } from './theme';
import type { CardPlaceholderThemeClasses } from './types';

const cardPlaceholderProps = {
    /** Skip the header line. */
    noHeader: { type: Boolean, default: false },
    /** Skip the footer block. */
    noFooter: { type: Boolean, default: false },
    /** Skip the cover-image placeholder. */
    noImg: { type: Boolean, default: false },
    /** Cover-image placeholder height. CSS length (`'180px'`, `'12rem'`). */
    imgHeight: { type: String, default: '180px' },
    /** Number of body lines below the header. */
    bodyLines: { type: Number, default: 3 },
    /** Animation pattern. Forwarded to every inner `<VCPlaceholder>`. */
    animation: { type: String as PropType<PlaceholderAnimation>, default: 'wave' },
    ...themableProps<CardPlaceholderThemeClasses>(),
};

export type CardPlaceholderProps = ExtractPublicPropTypes<typeof cardPlaceholderProps>;

/**
 * Card-shaped skeleton — cover image + header line + body lines +
 * footer block. Each section independently togglable via `:no-*` props.
 *
 * Lives in `@vuecs/elements` next to `<VCCard>` (the real component
 * it mimics structurally) for discoverability. Composes
 * `<VCPlaceholder>` per section — the `:animation` prop flows
 * through, so the reduced-motion handling at the bar level applies
 * here too.
 */
export const VCCardPlaceholder = defineComponent({
    name: 'VCCardPlaceholder',
    props: cardPlaceholderProps,
    setup(props) {
        const theme = useComponentTheme(
            'cardPlaceholder',
            useThemeProps(props),
            cardPlaceholderThemeDefaults,
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

            // Clamp + integer-ize bodyLines. Without an upper cap a
            // pathological value (`:body-lines="100000"`) would
            // generate tens of thousands of bar vnodes and freeze
            // the render. Skeletons are visual indicators, not data
            // payloads — `20` lines covers every realistic use.
            const MAX_BODY_LINES = 20;
            const bodyLines = Number.isFinite(props.bodyLines) ?
                Math.min(MAX_BODY_LINES, Math.max(0, Math.floor(props.bodyLines))) :
                0;
            if (bodyLines > 0) {
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
