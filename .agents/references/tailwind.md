# Tailwind CSS Reference

vuecs targets **Tailwind v4** as a first-class theme runtime (`@vuecs/theme-tailwind`) and as the CSS-variable substrate behind `@vuecs/design`'s tokens. Tailwind isn't an optional add-on — multiple components reference Tailwind's `--color-<palette>-<shade>` token chain by design, and `@vuecs/design`'s `@theme` block + `@source inline()` directive depend on Tailwind v4-specific behavior. Tailwind v3 is **not supported**.

## Version Snapshot (as of 2026-04-25)

| | Version | Date | Commit |
|---|---------|------|--------|
| **Latest stable** | v4.2.4 | 2026-04-21 | — |
| **Master HEAD** | — | 2026-04-24 | `3a890c3` |

Repo: <https://github.com/tailwindlabs/tailwindcss>

## Why v4 specifically

| Feature | v4 | v3 |
|---------|----|----|
| `@theme { … }` block (CSS-variable token registration) | ✅ | ❌ |
| `@source` directive (inline-string + glob safelist) | ✅ | ❌ |
| `@source inline("...")` cartesian-product expansion | ✅ | ❌ |
| `@import "tailwindcss"` single-line setup | ✅ | ❌ (separate `tailwind.config.js`) |
| `--color-<palette>-<shade>` shipped as CSS vars per palette | ✅ | ❌ (Sass-compiled hex) |
| Config-as-CSS (`@theme`) instead of JS config | ✅ | ❌ |

Every one of these is load-bearing in `@vuecs/design`. Replacing v4 with v3 would require shipping a Sass build pipeline and abandoning runtime palette switching.

## Code Mapping (Tailwind v4 → vuecs)

| Concept | Tailwind v4 | vuecs |
|---------|-------------|-------|
| **Token registration** | `@theme { --color-X: …; }` | `packages/design/assets/index.css` `@theme` block — exposes `--vc-color-*` aliases as `--color-*` so utilities resolve |
| **Class scanning** | `@source "<path>"` | `packages/theme-tailwind/src` is scanned by every consumer (theme classes are baked into source); `@vuecs/design` ships `@source inline(…)` for the 22-palette safelist |
| **Inline safelist** | `@source inline("classname1 classname2")` (supports `{a,b,c}` cartesian product) | Used in `@vuecs/design/assets/index.css` to force-emit `bg-{22 palettes}-{50…950}` — without it, `setPalette({ primary: 'emerald' })` fails because emerald gets tree-shaken |
| **Default palettes** | `--color-blue-*`, `--color-emerald-*`, …, 22 palettes × 11 shades | Referenced as the **lower layer** in the design-token chain: `--vc-color-primary-* → var(--color-blue-*)` by default |
| **Dark variant** | `@custom-variant dark (&:where(.dark, .dark *))` (manual config in v4) | Recommended docs setup — pairs with `@vuecs/design`'s `.dark` token flips |
| **Class merging** | `tailwind-merge` (third-party) | `@vuecs/theme-tailwind` exports `merge: ClassesMergeFn` (twMerge-backed) and pre-wires it as the theme's `classesMergeFn` — used for `extend()` overrides |

## The full token chain

```
1. bg-primary-600          ← Tailwind v4 utility class emitted by theme-tailwind
2. --color-primary-600     ← @theme mapping in @vuecs/design/assets/index.css
3. --vc-color-primary-600  ← semantic-scale var (overridden by setPalette)
4. --color-blue-600        ← Tailwind's built-in palette (default binding)
5. concrete hex            ← shipped by Tailwind
```

`setPalette({ primary: 'green' })` rewrites layer 3 to point at `var(--color-green-600)`. Layers 1, 2, 4, 5 are untouched — that's why palette switching is atomic and doesn't require theme re-resolution.

## JIT internals we depend on

The `@source inline("bg-<palette>-<shade>")` safelist forces Tailwind v4 to emit the `--color-<palette>-<shade>` token in the output. This is a documented side effect: any palette/shade combo referenced by **any** utility class (`bg-`, `text-`, `border-`, `ring-`, `outline-`, etc.) keeps its underlying CSS variable in the bundle.

We use `bg-` because it's the most universally used family and covers the full shade range. **If a future Tailwind major changes how palette emission works, the directive in `packages/design/assets/index.css` needs to update too.** This is currently the most upgrade-fragile part of the codebase.

## Areas to Watch

When Tailwind v4 updates, review for:
- Changes to `@theme` directive semantics (token aliasing rules, scope, layer ordering)
- Changes to `@source inline()` parsing / cartesian-expansion behavior
- Default palette token names or shade ranges (e.g. dropping `-50` or adding `-1000`)
- Changes to `@custom-variant` syntax (we register `dark` via this)
- New first-class palette-switching primitives (would let us drop the safelist hack)
- Changes to how `.dark` variant compiles (we depend on `:where(.dark, .dark *)` matching)
- Changes to `padding-inline` / `padding-block` longhand emission (we use these in docs to defeat unlayered resets)
