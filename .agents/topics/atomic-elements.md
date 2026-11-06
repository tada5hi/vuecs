# Atomic Elements

Atomic, presentation-only UI elements. Each component is small (≤150
LOC), wraps zero or one Reka primitive, ships its own theme key, and
has no relationships with other vuecs packages beyond `@vuecs/core` for
the theme system.

```text
@vuecs/elements/
  src/
    components/
      separator/        <- VCSeparator (Reka Separator) — horizontal/vertical, `decorative`
      tag/              <- VCTag (pure CSS) + VCTags (renders chips per items array)
      avatar/           <- VCAvatar (Reka AvatarRoot+Image+Fallback) — `src` + #fallback slot
      aspect-ratio/     <- VCAspectRatio (Reka AspectRatio) — `ratio` prop
      visually-hidden/  <- VCVisuallyHidden (Reka VisuallyHidden) — a11y label slot
      badge/            <- VCBadge (pure CSS) — solid/soft/outline × semantic-color matrix
      card/             <- VCCard + VCCardHeader / Title / Description / Body / Footer
                           Compound surface with provideCardContext() for padding inheritance
      alert/            <- VCAlert + VCAlertTitle / Description / Close
                           Pure-CSS persistent banner with provideAlertContext() for close dispatch
      collapse/         <- VCCollapse + VCCollapseTrigger / VCCollapseContent
                           Reka Collapsible wrapper with auto-chevron + height animation
    vue.ts              <- GlobalComponents augmentation
    index.ts            <- install() (themes, defaults; registers all VC* components)
  assets/
    separator.css       <- structural defaults per element (sizing, layout)
    tag.css
    avatar.css
    aspect-ratio.css
    badge.css
    card.css            <- structural defaults for card + bands + title / description
    alert.css           <- alert flex layout + absolute corner-close positioning
    collapse.css        <- chevron rotation tied to [data-state="open"]
```

### Card compound

A six-part compound for grouping related content into a bounded
panel: `<VCCard>` outer + optional `<VCCardHeader>` /
`<VCCardTitle>` / `<VCCardDescription>` / `<VCCardBody>` /
`<VCCardFooter>`. Pure-CSS, no Reka primitive needed — each part
is a thin themed wrapper over `reka-ui`'s `Primitive` (so the
`asChild` pattern works on every part for render-as-link cases).

Padding is set ONCE on `<VCCard padding="compact|normal|spacious">`
and propagates to every band via `provideCardContext()`. Children
read context via `useCardContext()` and merge it with their
per-instance `themeVariant` (per-instance wins). Per-band padding
overrides are still possible by passing `:theme-variant="{ padding:
'spacious' }"` on the specific band. The context bridge is
optional — children render bare when mounted outside `<VCCard>`
for unit tests / ad-hoc composition.

Theme entries ship in **all three** shipping themes
(`tailwind` / `bootstrap` / `bulma`). Variant axes:

- `card.variant`: `outline` / `soft` / `elevated` — border vs
  tinted bg vs shadow.
- `card.interactive`: hover + focus-within ring; pairs with
  `:as-child` + `<NuxtLink>` for whole-card link rows.
- `cardHeader.padding` / `cardBody.padding` / `cardFooter.padding`:
  `compact` / `normal` / `spacious`.

theme-bulma uses Bulma's `.box` as the host since Bulma's native
`.card` has a different structural ladder; gap-fill helpers in
`themes/bulma/assets/index.css` (`vc-card-outline`,
`vc-card-interactive`, header / body / footer separator borders)
paint the bands. theme-bootstrap maps directly onto `.card` /
`.card-header` / `.card-body` / `.card-footer`. theme-tailwind
emits design-token utilities (`bg-bg`, `border-border`, `text-fg`).

`<VCTag>` and `<VCBadge>` look similar but have distinct semantics:
**Tag** is a removable, value-bound chip (paired with `<VCFormTags>`
for read-only summaries); **Badge** is a static status indicator. They
deliberately stay separate components even though theme strings could
overlap.

`<VCFormTags>` does NOT compose `<VCTag>` internally — it's built on
Reka's `TagsInputItem` / `ItemText` / `ItemDelete` compound (which
provides keyboard handling + per-chip focus ring). Sharing visual style
between the two happens at the *theme* level (`formTags.item` and
`tag.root` in each theme entry), not via cross-package imports.

`TagItem` (the shape `<VCTags :items>` accepts) is structurally
compatible with `@vuecs/forms`' `FormOption` — same `value` / `label` /
`icon` / `disabled` keys — so the same array can drive a select and a
chip summary. The type is duplicated locally rather than imported to
keep `@vuecs/elements` free of cross-package deps.

Theme entries ship in **both** `@vuecs/theme-tailwind` and
`@vuecs/theme-bootstrap`. `badge.root` uses the variant system —
`size: 'sm'|'md'|'lg'` × `variant: 'solid'|'soft'|'outline'` ×
`color: <semantic>`. `compoundVariants` cover every cell of the
3 × 6 matrix in each theme so a `<VCBadge variant="soft" color="error">`
renders correctly in either ecosystem.
