import { describe, expect, it } from 'vitest';
import { ThemeManager } from '@vuecs/core';
import { paginationThemeDefaults } from '@vuecs/pagination';
import bulmaTheme from '../../src';

// Bulma registers the `--bulma-pagination-*` custom properties (min-width,
// item padding, margin) on `.pagination`; `.pagination-link` reads them.
// Without `.pagination` on the root the links collapse to their text width.
describe('pagination', () => {
    it('should put `.pagination` on the root so Bulma registers its pagination vars', () => {
        const manager = new ThemeManager({ themes: [bulmaTheme()] });
        const root = manager.resolve('pagination', paginationThemeDefaults).root.split(' ');

        expect(root).toContain('pagination');
        expect(root).toContain('pagination-list');
    });
});
