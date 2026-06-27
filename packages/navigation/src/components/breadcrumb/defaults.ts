import type { BreadcrumbDefaults } from './types';

/**
 * Lowest-priority behavioral defaults for the breadcrumb (i18n layer).
 * `separatorIcon` is empty by default so the `separatorGlyph` renders
 * standalone; an installed icon preset (`icons: [lucide()]`) sets a
 * chevron name here, which then wins over the glyph.
 */
export const breadcrumbBehavioralDefaults: BreadcrumbDefaults = {
    label: 'Breadcrumb',
    separatorIcon: '',
    separatorGlyph: '/',
    ellipsisLabel: 'Show more',
    ellipsisGlyph: '…',
};
