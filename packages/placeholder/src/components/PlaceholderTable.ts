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
import { placeholderTableThemeDefaults } from '../theme';
import type {
    PlaceholderAnimation, 
    PlaceholderTableThemeClasses,
} from '../types';
import { VCPlaceholder } from './Placeholder';

const placeholderTableProps = {
    /** Number of body rows to render. */
    rows: { type: Number, default: 5 },
    /** Number of columns per row. */
    columns: { type: Number, default: 4 },
    /** Render a `<thead>` band with header-bar placeholders. */
    showHeader: { type: Boolean, default: true },
    /** Render a `<tfoot>` band with footer-bar placeholders. */
    showFooter: { type: Boolean, default: false },
    /** Animation pattern. Forwarded to every inner `<VCPlaceholder>`. */
    animation: { type: String as PropType<PlaceholderAnimation>, default: 'wave' },
    ...themableProps<PlaceholderTableThemeClasses>(),
};

export type PlaceholderTableProps = ExtractPublicPropTypes<typeof placeholderTableProps>;

/**
 * Table-shaped skeleton — `rows × columns` placeholder bars laid out
 * in a real `<table>` element (so the surrounding layout reads as a
 * table). Optional header / footer bands. Bars vary in width per
 * cell so the skeleton looks more natural than a uniform grid.
 *
 * Composes `<VCPlaceholder>` per cell — the animation prop flows
 * through, so reduced-motion handling at the bar level applies here
 * too.
 */
export const VCPlaceholderTable = defineComponent({
    name: 'VCPlaceholderTable',
    props: placeholderTableProps,
    setup(props) {
        const theme = useComponentTheme(
            'placeholderTable',
            useThemeProps(props),
            placeholderTableThemeDefaults,
        );

        // Vary cell widths so the skeleton looks like real tabular
        // data rather than a uniform grid. Deterministic + index-keyed
        // so the same column stays the same width across renders.
        const widthFor = (rowIdx: number, colIdx: number): string => {
            const pattern = [60, 80, 45, 90, 55, 75, 65];
            return `${pattern[(rowIdx * 3 + colIdx) % pattern.length]}%`;
        };
        return () => {
            const t = theme.value;
            const cell = (rowIdx: number, colIdx: number, tag: 'td' | 'th') => h(
                tag,
                { class: t.cell || undefined },
                [
                    h(VCPlaceholder, {
                        animation: props.animation,
                        width: widthFor(rowIdx, colIdx),
                    }),
                ],
            );
            const cols = Math.max(0, props.columns);
            const rows = Math.max(0, props.rows);
            const colRange = Array.from({ length: cols }, (_, i) => i);
            const rowRange = Array.from({ length: rows }, (_, i) => i);
            return h(
                'table',
                {
                    class: t.root || undefined,
                    'aria-hidden': 'true',
                    role: 'presentation',
                },
                [
                    props.showHeader ? h(
                        'thead',
                        { class: t.header || undefined },
                        [h('tr', { class: t.row || undefined }, colRange.map((c) => cell(-1, c, 'th')))],
                    ) : null,
                    h(
                        'tbody',
                        { class: t.body || undefined },
                        rowRange.map((r) => h(
                            'tr',
                            { class: t.row || undefined },
                            colRange.map((c) => cell(r, c, 'td')),
                        )),
                    ),
                    props.showFooter ? h(
                        'tfoot',
                        { class: t.footer || undefined },
                        [h('tr', { class: t.row || undefined }, colRange.map((c) => cell(rows, c, 'td')))],
                    ) : null,
                ],
            );
        };
    },
});
