# Placeholder skeletons (@vuecs/placeholder, issue #1476)

Skeleton / placeholder loading components — the "Twitter / Facebook
shimmer" pattern. The package ships **primitives only**; composite
skeletons that mirror real components live next to those components
(modern Vue/React library pattern, matches MUI / Chakra / Naive UI):

```text
@vuecs/placeholder/
  src/
    components/
      Placeholder.ts         <- VCPlaceholder (single animated bar)
      PlaceholderWrapper.ts  <- VCPlaceholderWrapper (conditional loading↔default)
    theme.ts                 <- placeholder + placeholderWrapper theme defaults
    types.ts                 <- ThemeElements augmentation + animation/size/shape unions
    index.ts                 <- install() + barrel re-exports
  assets/
    index.css                <- minimal shimmer (wave + glow), reduced-motion respected
```

Composite skeletons live next to the real components they mirror:

- **`<VCCardPlaceholder>`** → `@vuecs/elements` (next to `<VCCard>`).
  Theme key `cardPlaceholder`; CSS class prefix `vc-card-placeholder-*`.
- **`<VCTablePlaceholder>`** → `@vuecs/table` (next to `<VCTable>`).
  Theme key `tablePlaceholder`; CSS class prefix `vc-table-placeholder-*`.
  Supports `#thead` / `#tfoot` slot overrides.

Both composites import `<VCPlaceholder>` from `@vuecs/placeholder`
(declared as peer dep on both `@vuecs/elements` and `@vuecs/table`).
They mirror the visual STRUCTURE of `<VCCard>` / `<VCTable>` but
don't actually compose those components — just `<table>` /
`<div>` markup with `<VCPlaceholder>` bars inside.

**`<VCPlaceholder>` shape variants** — `rect` (default rectangle),
`pill` (fully-rounded ends — button / badge skeletons), `circle`
(1:1 aspect — avatar skeletons; pair with a fixed `:width`). Single
prop covers what MUI does with `variant: 'rectangular' | 'rounded' |
'circular'` and bvnext does with multiple separate components.

**Three animation modes**: `wave` (moving-gradient sweep — default),
`glow` (opacity pulse — Bootstrap 5 default), `none` (animation
disabled). `prefers-reduced-motion: reduce` disables both wave + glow
automatically. Per-instance `:duration` override (CSS length) flows
to `animation-duration` inline.

**Self-contained**: ships its own structural CSS so the primitive bar
renders visibly even without a theme installed. Themes layer their
visual styling (colors, radii, fine-tuned animation) via the
`placeholder` / `placeholderWrapper` theme keys (and
`cardPlaceholder` / `tablePlaceholder` declared on the destination
packages).

**`<VCPlaceholderWrapper>`** is a conditional wrapper: renders
`#loading` when `:loading` is true, `#default` otherwise. Mirrors
`aria-busy` + `role="status"` + `aria-live="polite"` to the wrapper
for assistive-tech loading announcements (W3C "Loading content"
pattern). Built to swap a skeleton in / out without `v-if` plumbing
on the consumer side.

Layer 1 — `@vuecs/core` peer dep only; no Reka primitive (the
shimmer animations are pure CSS).
