import { describe, expect, it } from 'vitest';
import {
    auditTheme,
    formatAuditResult,
    isAuditClean,
} from '@vuecs/core';
import {
    aspectRatioThemeDefaults,
    avatarThemeDefaults,
    badgeThemeDefaults,
    separatorThemeDefaults,
    tagThemeDefaults,
    tagsThemeDefaults,
} from '@vuecs/elements';
import { stepperThemeDefaults } from '@vuecs/navigation';
import {
    contextMenuThemeDefaults,
    dropdownMenuThemeDefaults,
    hoverCardThemeDefaults,
    modalThemeDefaults,
    popoverThemeDefaults,
    tooltipThemeDefaults,
} from '@vuecs/overlays';
import tailwindTheme from '../../src';

/*
 * Per-theme `auditTheme` coverage probe (plan 015 P5 / plan 024 step 7b).
 *
 * The expected catalog covers component packages that export their
 * `*ThemeDefaults`: `@vuecs/elements`, `@vuecs/navigation` (stepper),
 * `@vuecs/overlays`. Packages that still hold their defaults internally
 * (button, countdown, forms, gravatar, list, navigation/{item,items},
 * pagination, timeago) are not yet in the catalog — those theme entries
 * surface as `unknownElements` and are suppressed via `skip` until each
 * package exports its defaults.
 */
const expectedCatalog = {
    aspectRatio: aspectRatioThemeDefaults,
    avatar: avatarThemeDefaults,
    badge: badgeThemeDefaults,
    separator: separatorThemeDefaults,
    tag: tagThemeDefaults,
    tags: tagsThemeDefaults,
    stepper: stepperThemeDefaults,
    modal: modalThemeDefaults,
    popover: popoverThemeDefaults,
    hoverCard: hoverCardThemeDefaults,
    tooltip: tooltipThemeDefaults,
    dropdownMenu: dropdownMenuThemeDefaults,
    contextMenu: contextMenuThemeDefaults,
};

const AUDIT_SKIP = ['unknownElements', 'unknownSlots'] as const;

describe('theme-tailwind — auditTheme()', () => {
    it('covers every expected component slot without drift', () => {
        const result = auditTheme(tailwindTheme(), expectedCatalog);
        const report = formatAuditResult(result, {
            title: 'theme-tailwind',
            skip: [...AUDIT_SKIP],
        });
        // formatAuditResult returns '' when all non-skipped categories are clean.
        expect(report).toBe('');
    });

    it('isAuditClean ignores the skip option and only reflects raw drift', () => {
        // Sanity check: every audited theme will currently fail the strict
        // `isAuditClean` predicate because `unknownElements` still lists
        // un-catalogued components. Pin this so the moment those packages
        // export their defaults, this test starts failing — prompting the
        // catalog above to be expanded.
        const result = auditTheme(tailwindTheme(), expectedCatalog);
        expect(isAuditClean(result)).toBe(false);
        expect(result.unknownElements.length).toBeGreaterThan(0);
    });
});
