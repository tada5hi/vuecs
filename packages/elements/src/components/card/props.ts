import type { PropType } from 'vue';
import { themableProps } from '@vuecs/core';
import type { PlaceholderAnimation } from '@vuecs/placeholder';
import type { CardPlaceholderThemeClasses } from './types';

export const cardPlaceholderProps = {
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
