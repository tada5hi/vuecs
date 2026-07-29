/**
 * Stylelint — CSS *validity* gate for the hand-authored token / theme /
 * structural CSS (design tokens, the three theme bridges, per-package
 * structural rules; ~5k lines, 300+ OKLCH literals).
 *
 * Deliberately does NOT extend `stylelint-config-standard`: that bundles
 * ~dozens of stylistic rules (empty-line-before, keyword casing, vendor-
 * prefix bans — which would flag the `-webkit-mask-*` the placeholder
 * shimmer legitimately needs) that would reformat hand-tuned CSS without
 * catching a single real bug. Instead we enable only "possible error"
 * rules: invalid hex/units/properties/functions, duplicate declarations,
 * malformed comments/imports. A broken `var(`, a `#12g` hex, or a
 * mistyped property fails CI; hand-authored notation is left alone.
 *
 * @type {import('stylelint').Config}
 */
export default {
    rules: {
        // Tailwind v4 (`@theme` / `@source` used today; the rest future-proof)
        // plus bridge at-rules — everything else flagged, so `@improt` is caught.
        'at-rule-no-unknown': [
            true,
            { ignoreAtRules: ['theme', 'source', 'layer', 'apply', 'custom-variant', 'utility', 'variant'] },
        ],
        'color-no-invalid-hex': true,
        'unit-no-unknown': true,
        'property-no-unknown': true,
        'function-no-unknown': [true, { ignoreFunctions: ['theme'] }],
        // Allow the deliberate fallback pattern `prop: <literal>; prop: var(--x);`
        // but catch true accidental duplicates.
        'declaration-block-no-duplicate-properties': [
            true,
            { ignore: ['consecutive-duplicates-with-different-values'] },
        ],
        'declaration-block-no-duplicate-custom-properties': true,
        'no-duplicate-at-import-rules': true,
        'no-invalid-position-at-import-rule': true,
        'no-invalid-double-slash-comments': true,
        'no-irregular-whitespace': true,
        'no-empty-source': true,
        'block-no-empty': true,
        'comment-no-empty': true,
        'string-no-newline': true,
        'named-grid-areas-no-invalid': true,
    },
};
