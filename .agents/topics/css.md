# CSS Strategy

Components emit minimal structural CSS via co-located `vc-*` default classes. Visual styling is delegated to theme packages. CSS is extracted into separate `dist/style.css` files during build, so consumers can import styles independently.

### Form glyphs are rendered, not CSS masks (#1694)

A glyph that carries **meaning** (the checkbox's check mark / indeterminate
dash) is *content*, not styling — so it is rendered by the component, never
painted from the structural stylesheet.

Structural CSS is optional, and themes may be self-sufficient. A CSS-mask state glyph would disappear for consumers that omit the structural stylesheet. Repeating the glyph SVG in every theme would duplicate content and leave theme-less consumers without the indicator.

`<VCFormCheckbox>` renders an inline `<svg class="vc-form-checkbox-glyph">`
stroked in `currentColor`, gated behind `isMeaningfulSlotContent(#indicator)`.
Layer responsibilities after the split:

| Layer | Owns |
|---|---|
| Component | the glyph's *shape* (check path vs. dash path, chosen from Reka's `state`) and its *size* — `width`/`height` are `85%`, so it scales with whatever sets the box |
| Theme `indicator` class | its *colour* (`text-current` over the root's `text-on-primary`, `text-white`, …) |
| Structural CSS | the box: `.vc-form-checkbox` sizing + the `vc-form-checkbox-{xs,sm,lg}` size-variant helpers. No glyph rules at all |

**Size the glyph by ratio, not by length.** The box height is not the
component's to predict — `1rem` by default, a size-variant helper under
`themeVariant.size`, or a bespoke value when a consumer lines a checkbox up
beside a taller input. Any fixed length (`12px`, `0.75em`, `0.75rem`) is
correct for only one box size. The glyph uses `85%` to preserve its proportion across size variants and custom box dimensions.

The percentage needs a definite containing block, so the component also sets
`style="width:100%;height:100%"` on the `CheckboxIndicator` inline — the
structural rule declares exactly the same thing, but it is an opt-in import
and the glyph has to size correctly without it. Presentation attributes lose
to CSS, so a theme or consumer rule still wins over the `85%`.

The indicator slot replaces the rendered default glyph; structural CSS must not add a second mask underneath that slot.

Purely decorative shapes stay in CSS — the radio's dot (`formRadio.indicator`
is a self-sufficient theme class) and the switch's thumb are presentation, not
content, and a theme is free to redraw them.

Contrast with the icon-name path (`collapseTrigger.chevronIcon`,
`tableExpandTrigger.chevronIcon`): those resolve through `ComponentDefaults`
and render via `<VCIcon>`, degrading to *nothing* when no icon preset is
installed. That trade is fine for affordance chrome; it is not fine for a
checkbox's state indicator, which is the only thing distinguishing checked
from indeterminate.

### Disabled state on polymorphic (`as`) targets (#1699)

`disabled` is a `<button>` / form-control concept. A component that renders
polymorphically (`<VCButton :as>`) can't rely on it: an `<a>`, a
`RouterLink` / `NuxtLink`, or an arbitrary component keeps its own
activation behaviour, and CSS's `:disabled` pseudo-class never matches
them. Marking the element `aria-disabled="true"` *announces* the state
without *enforcing* it — a permission-guarded row action then looks
clickable, is clickable, and only gets rejected by the target page.

The split, mirroring the form-glyph rule above:

| Layer | Owns |
|---|---|
| Component | *enforcement* — `aria-disabled="true"`, `tabindex="-1"` (parity with what native `disabled` does to the tab order), and a **capture-phase** `onClickCapture` guard that `preventDefault()` + `stopPropagation()` + `stopImmediatePropagation()`s |
| Theme | the *visual* cue, keyed off `[aria-disabled="true"]` — exactly as the native path's cue comes from the theme's `disabled:` utilities |
| Structural CSS | nothing. A theme-less consumer gets no disabled cue on either path, so the two stay consistent |

**The capture phase is load-bearing, not stylistic.** At the event target
the DOM invokes capture-phase listeners before bubble-phase ones (dispatch
walks the path twice and skips listeners whose capture flag doesn't match
the current phase), so the guard wins regardless of registration order.
That matters because Vue merges fallthrough attrs *after* a component's own
props — a bubble-phase guard on `<VCButton :as="RouterLink">` would be
registered second and run only after RouterLink had already navigated.
`stopPropagation()` additionally suppresses the target's own bubble
listeners, since the stop-propagation flag is checked once per element per
phase. `packages/button/test/unit/disabled.spec.ts` pins this with a
component target that navigates from a plain `onClick`; flipping the guard
to `onClick` fails that spec.

Themes carry the cue as: `aria-disabled:cursor-not-allowed
aria-disabled:opacity-60` (theme-tailwind, alongside its existing
`disabled:` pair — same shape as `pagination.link`), and a
`.vc-button[aria-disabled="true"]` bridge rule in theme-bootstrap /
theme-bulma, since neither framework's class strings can carry attribute
selectors. Both bridges reuse the framework's own disabled-opacity
variable (`--bs-btn-disabled-opacity` / `--bulma-button-disabled-opacity`)
rather than hard-coding a value, and deliberately omit `pointer-events:
none` (it would suppress `cursor: not-allowed`, and activation is already
blocked JS-side).
