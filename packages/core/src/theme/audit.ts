import { isExtendValue } from './extend';
import type {
    ComponentThemeDefinition,
    Theme,
    ThemeElementDefinition,
} from './types';

/**
 * Result of `auditTheme()` — a structured drift report. All four
 * record fields are keyed by component name; the value is the list of
 * slots that drifted. Top-level arrays cover element-level drift
 * (missing or unknown component names).
 */
export type AuditResult = {
    /** Component names present in `expected` but missing from `theme.elements`. */
    missingElements: string[];
    /** Component names present in `theme.elements` but absent from `expected` (typos / unsupported slots). */
    unknownElements: string[];
    /** Per-component slot keys present in `expected.classes` but missing from the theme entry. */
    missingSlots: Record<string, string[]>;
    /** Per-component slot keys present in the theme entry but absent from `expected.classes`. */
    unknownSlots: Record<string, string[]>;
    /**
     * Per-component slot keys whose theme value is identical to the
     * structural default (i.e. the theme adds nothing — likely a
     * copy-paste mistake; `defaults` are merged automatically). Slots
     * marked with `extend()` are never flagged here.
     */
    redundantStructural: Record<string, string[]>;
};

/**
 * The shape `auditTheme()` audits against. Maps component name →
 * `ComponentThemeDefinition` (the same `defaults` value each component
 * package exports for its `useComponentTheme` call). Pass the
 * defaults verbatim — the audit only reads `classes` keys + values.
 */
export type ExpectedThemeCatalog = Record<string, ComponentThemeDefinition>;

/**
 * Audit a theme against an expected catalog of component defaults.
 * Pure function — no Vue dependency, no DOM access.
 *
 * The catalog is typically built by importing each component package's
 * exported `*ThemeDefaults` and assembling them into a record:
 *
 * ```ts
 * import { auditTheme } from '@vuecs/core';
 * import { badgeThemeDefaults } from '@vuecs/elements';
 * import { buttonThemeDefaults } from '@vuecs/button';
 * import tailwindTheme from '@vuecs/theme-tailwind';
 *
 * const result = auditTheme(tailwindTheme(), {
 *     badge: badgeThemeDefaults,
 *     button: buttonThemeDefaults,
 *     // …
 * });
 * if (!isAuditClean(result)) {
 *     throw new Error(formatAuditResult(result));
 * }
 * ```
 *
 * Designed to run in CI per shipping theme so a future PR that drops
 * a slot fails loudly. Cheap protection against theme drift —
 * especially under plan 023's framing where multiple theme authors
 * (vuecs's own + third-party) target the same component catalog.
 */
export function auditTheme(theme: Theme, expected: ExpectedThemeCatalog): AuditResult {
    const themeElements = theme.elements as Record<string, ThemeElementDefinition | undefined>;
    const result: AuditResult = {
        missingElements: [],
        unknownElements: [],
        missingSlots: {},
        unknownSlots: {},
        redundantStructural: {},
    };

    const expectedNames = Object.keys(expected);
    const themeNames = Object.keys(themeElements).filter((name) => themeElements[name] !== undefined);

    for (const name of expectedNames) {
        if (!themeElements[name]) {
            result.missingElements.push(name);
        }
    }

    for (const name of themeNames) {
        if (!(name in expected)) {
            result.unknownElements.push(name);
        }
    }

    for (const name of expectedNames) {
        const expectedDef = expected[name];
        const themeDef = themeElements[name];
        if (!themeDef) continue;

        const expectedClasses = expectedDef.classes as Record<string, string>;
        const themeClasses = (themeDef.classes ?? {}) as Record<string, unknown>;

        const expectedSlots = Object.keys(expectedClasses);
        const themeSlots = Object.keys(themeClasses);

        for (const slot of expectedSlots) {
            const themeValue = themeClasses[slot];
            if (themeValue === undefined) {
                /*
                 * Theme didn't declare this slot. That's fine in the
                 * stacking model — defaults still apply at runtime.
                 * But for an audit-style coverage probe, flag it so
                 * the theme author knows they haven't styled it.
                 */
                if (!result.missingSlots[name]) result.missingSlots[name] = [];
                result.missingSlots[name].push(slot);
                continue;
            }

            /*
             * Skip extend()-marked values: the theme is explicitly
             * augmenting defaults, not redefining them. That's the
             * intended use of extend().
             */
            if (isExtendValue(themeValue)) continue;

            if (typeof themeValue === 'string' && themeValue === expectedClasses[slot]) {
                if (!result.redundantStructural[name]) result.redundantStructural[name] = [];
                result.redundantStructural[name].push(slot);
            }
        }

        for (const slot of themeSlots) {
            if (!(slot in expectedClasses)) {
                if (!result.unknownSlots[name]) result.unknownSlots[name] = [];
                result.unknownSlots[name].push(slot);
            }
        }
    }

    return result;
}

/**
 * Predicate — returns `true` when the audit found no drift across all
 * five categories. Use as the gate for CI-style assertions.
 */
export function isAuditClean(result: AuditResult): boolean {
    return result.missingElements.length === 0 &&
        result.unknownElements.length === 0 &&
        Object.keys(result.missingSlots).length === 0 &&
        Object.keys(result.unknownSlots).length === 0 &&
        Object.keys(result.redundantStructural).length === 0;
}

export type FormatAuditResultOptions = {
    /** Title for the rendered output. Default: `'Theme audit'`. */
    title?: string;
    /**
     * Categories to suppress in the output. Useful when the audit is
     * advisory (e.g. you accept `redundantStructural` warnings during
     * an in-progress migration).
     */
    skip?: ReadonlyArray<keyof AuditResult>;
};

/**
 * Format an `AuditResult` as a human-readable multi-line string for
 * test assertions, CI logs, or interactive output. Returns an empty
 * string when the result is clean.
 */
export function formatAuditResult(
    result: AuditResult,
    options: FormatAuditResultOptions = {},
): string {
    const { title = 'Theme audit', skip = [] } = options;
    const skipSet = new Set<keyof AuditResult>(skip);
    const lines: string[] = [];

    if (!skipSet.has('missingElements') && result.missingElements.length > 0) {
        lines.push(`  Missing elements (${result.missingElements.length}):`);
        for (const name of result.missingElements.sort()) {
            lines.push(`    - ${name}`);
        }
    }

    if (!skipSet.has('unknownElements') && result.unknownElements.length > 0) {
        lines.push(`  Unknown elements (${result.unknownElements.length}):`);
        for (const name of result.unknownElements.sort()) {
            lines.push(`    - ${name}`);
        }
    }

    if (!skipSet.has('missingSlots')) {
        const names = Object.keys(result.missingSlots).sort();
        if (names.length > 0) {
            lines.push('  Missing slots:');
            for (const name of names) {
                lines.push(`    - ${name}: ${result.missingSlots[name].sort().join(', ')}`);
            }
        }
    }

    if (!skipSet.has('unknownSlots')) {
        const names = Object.keys(result.unknownSlots).sort();
        if (names.length > 0) {
            lines.push('  Unknown slots:');
            for (const name of names) {
                lines.push(`    - ${name}: ${result.unknownSlots[name].sort().join(', ')}`);
            }
        }
    }

    if (!skipSet.has('redundantStructural')) {
        const names = Object.keys(result.redundantStructural).sort();
        if (names.length > 0) {
            lines.push('  Redundant structural (theme value === default):');
            for (const name of names) {
                lines.push(`    - ${name}: ${result.redundantStructural[name].sort().join(', ')}`);
            }
        }
    }

    if (lines.length === 0) return '';
    return `${title}:\n${lines.join('\n')}`;
}
