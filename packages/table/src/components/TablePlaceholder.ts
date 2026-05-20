import {
    defineComponent,
    h,
} from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import {
    themableProps,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { VCPlaceholder } from '@vuecs/placeholder';
import type { PlaceholderAnimation } from '@vuecs/placeholder';
import { tablePlaceholderThemeDefaults } from '../theme';
import type { TablePlaceholderThemeClasses } from '../types';

const tablePlaceholderProps = {
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
    ...themableProps<TablePlaceholderThemeClasses>(),
};

export type TablePlaceholderProps = ExtractPublicPropTypes<typeof tablePlaceholderProps>;

/**
 * Table-shaped skeleton — `rows × columns` placeholder bars in a real
 * `<table>` element so the surrounding layout reads as a table. Bars
 * vary in width per index so the result looks more natural than a
 * uniform grid.
 *
 * Lives in `@vuecs/table` next to `<VCTable>` for discoverability;
 * composes `<VCPlaceholder>` (from `@vuecs/placeholder`) per cell —
 * the `:animation` prop flows through, so the reduced-motion handling
 * at the bar level applies here too.
 *
 * Slot overrides — `#thead` and `#tfoot` replace the default
 * header / footer rendering with consumer markup.
 */
export const VCTablePlaceholder = defineComponent({
    name: 'VCTablePlaceholder',
    props: tablePlaceholderProps,
    slots: Object as SlotsType<{
        thead(): unknown;
        tfoot(): unknown;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme(
            'tablePlaceholder',
            useThemeProps(props),
            tablePlaceholderThemeDefaults,
        );

        // Vary cell widths so the skeleton looks like real tabular
        // data rather than a uniform grid. The header band passes
        // `rowIdx = -1` — JS `%` returns negative remainders for
        // negative dividends, so normalize to `[0, len)` so header
        // cells get a real width string instead of `'undefined%'`.
        const widthFor = (rowIdx: number, colIdx: number): string => {
            const pattern = [60, 80, 45, 90, 55, 75, 65];
            const len = pattern.length;
            const idx = ((rowIdx * 3 + colIdx) % len + len) % len;
            return `${pattern[idx]}%`;
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
                ([
                    props.showHeader ? h(
                        'thead',
                        { class: t.header || undefined },
                        (slots.thead ?
                            slots.thead() :
                            [h('tr', { class: t.row || undefined }, colRange.map((c) => cell(-1, c, 'th')))]) as never,
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
                        (slots.tfoot ?
                            slots.tfoot() :
                            [h('tr', { class: t.row || undefined }, colRange.map((c) => cell(rows, c, 'td')))]) as never,
                    ) : null,
                ]) as never,
            );
        };
    },
});
