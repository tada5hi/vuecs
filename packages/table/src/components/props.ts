import type { PropType } from 'vue';
import { themableProps } from '@vuecs/core';
import type { PlaceholderAnimation } from '@vuecs/placeholder';
import type { TablePlaceholderThemeClasses } from '../types';

export const tablePlaceholderProps = {
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
