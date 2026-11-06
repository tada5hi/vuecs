# Overlays

The first compound-component package. Wraps Reka's Dialog / Popover /
Tooltip / DropdownMenu / ContextMenu primitives. Each part is a thin
SFC that renders the matching Reka component and threads our
`useComponentTheme(<family>, props, <familyThemeDefaults>)` over it for
theme class resolution. Content components (`*Content`) bundle the
matching `*Portal` so consumers don't have to compose them manually
(an `inline` prop bypasses the portal for testing or custom mounting).

```
@vuecs/overlays/
  src/
    components/
      modal/
        Modal.vue           <- DialogRoot wrapper (v-model:open)
        ModalTrigger.vue    <- DialogTrigger
        ModalContent.vue    <- DialogPortal + DialogOverlay + DialogContent
                               + `closePolicy` prop ('always' | 'no-escape' | 'no-outside' | 'never', #1630):
                               prevents Reka's escapeKeyDown / interactOutside per policy; raw events
                               keep firing for per-site conditional guards
        ModalTitle.vue
        ModalDescription.vue
        ModalClose.vue        <- close trigger; slotless OR `icon` prop → theme `closeIcon` (corner-X); otherwise neutral `close`
        theme.ts            <- shared modalThemeDefaults (single source for all parts)
        types.ts            <- ModalClosePolicy + ModalThemeClasses + ThemeElements augmentation
        use-modal.ts        <- useModal() view-stack composable (issue #1480)
        index.ts
      alert-dialog/           <- AlertDialog / Trigger / Content / Title / Description / Cancel / Action
                                 (Reka AlertDialog — role="alertdialog", outside-click always off,
                                 `noEscape` boolean instead of Modal's 4-value closePolicy)
                                 + AlertDialogProvider.vue (single host) + use-alert-dialog.ts
                                 (useAlertDialog() singleton FIFO queue → Promise<boolean>)
      popover/                <- Popover / Trigger / Content / Arrow / Close (with `icon` prop)
      hover-card/             <- HoverCard / Trigger / Content / Arrow — hover-with-grace-area; trigger defaults to `as="a"`
      tooltip/                <- TooltipProvider / Tooltip / Trigger / Content / Arrow
      dropdown-menu/          <- DropdownMenu / Trigger / Content / Item / Label / Separator / Group / Arrow
      context-menu/           <- ContextMenu / Trigger / Content / Item / Label / Separator / Group
      toast/                  <- ToastProvider / Toaster / Toast / Title / Description / Action / Close
                                   + useToast() shared queue composable
    vue.ts                  <- GlobalComponents augmentation (every VC* part)
    index.ts                <- install() (themes, defaults, config; registers all VC* components)
```

Every overlay family follows the same per-folder layout: each component is a
small SFC, plus `theme.ts` (single shared defaults), `types.ts`
(`<Family>ThemeClasses` + `ThemeElements` augmentation), and `index.ts`
re-export barrel. Tooltip and Toast additionally expose
`<VCTooltipProvider>` / `<VCToastProvider>` for app-level config
(delays, default duration, swipe direction); the other families read
state from their own root (`v-model:open` on Modal/Popover/Dropdown,
right-click on ContextMenu).

The `useModal()` composable is the vuecs-specific value-add on top of
Reka's Dialog. It exposes a **view stack** (`pushView` / `popView` /
`replaceView`) and an `onClose` hook so consumers can build flows like
"list view → push detail view → pop back" without stacking modals or
fighting z-index. Originally proposed in
[issue #1480](https://github.com/tada5hi/vuecs/issues/1480); the
roadmap-scoped Reka-wrapped compound API is layered on top of it (the
composable owns the state, `<VCModal>` v-binds to it).

The `useToast()` composable plays the same role for the Toast
family: an **app-scoped queue** with `add` / `dismiss` / `update` /
`clear` methods. The queue lives on a per-app
`ToastManager` (provided by the plugin under `Symbol.for('VCToastManager')`),
**not** a module singleton — so concurrent SSR requests never share state
and multiple apps on one page stay isolated (same app-aware
`provide`/`inject` bridge as the navigation registry / breadcrumb
manager). Consequence: `useToast()` **injects**, so it must be called from
a component setup / inject context; capture the returned API once and
reuse it in handlers (for a store action / interceptor, capture at app
init via `app.runWithContext`). Every call site in the same app shares the
one `entries` ref, so a notification fired from a store or a deep
component lands in the same `<VCToaster>` viewport. `add()` is a client
gesture — it no-ops (returns without enqueuing) when there is no `window`,
so an SSR misuse can't render a toast into the server output. The
`<VCToaster>` component reads the queue and renders one `<VCToast>` per
entry, with the canonical title/description/action/close layout as the
default slot fallback and a `{ entry, dismiss }` slot prop for per-toast
customization. (Exported: `ToastManager`, `provideToastManager`,
`injectToastManager` / `tryInjectToastManager`.)

Equivalent composables for the other families haven't shipped — most of
those don't need stateful flows, and consumers can wire `:open` /
`@update:open` manually when they do.

### AlertDialog + `useAlertDialog

The confirmation feature ships as **two layers on one primitive**:

- **`<VCAlertDialog>` declarative compound** (7 parts: `Trigger` /
  `Content` / `Title` / `Description` / `Cancel` / `Action`) wraps Reka's
  `AlertDialog` family. This is the *semantically correct* confirm
  primitive — Reka's `AlertDialogContent` hardcodes `role="alertdialog"`
  (the WAI-ARIA *Alert and Message Dialogs* pattern, more assertive than
  `<VCModal>`'s `role="dialog"`), disables outside-click dismissal, and
  auto-focuses the registered Cancel element on open. Because outside-click
  is always off, `<VCAlertDialogContent>` carries a single **`noEscape`**
  boolean (Escape cancels by default) rather than Modal's 4-value
  `closePolicy`. `Cancel` / `Action` render as themed `<button>`s but
  support `as-child` so a consumer composes `<VCButton color="error">` for
  the full variant matrix. Both also take a **`manual`** prop that suppresses
  Reka's auto-close and exposes a `confirm()` / `cancel()` trigger via the
  default slot (typed `AlertDialogActionSlotProps` /
  `AlertDialogCancelSlotProps`) — the opt-in for validate-then-confirm and
  async spinner-then-close flows. Manual mode renders via `VCPrimitive` (not
  `DialogClose`) and closes through Reka's public
  `injectDialogRootContext().onOpenChange(false)`, so it works controlled +
  uncontrolled. (An async `onConfirm` for the imperative `useAlertDialog` host is a
  planned follow-up.)
- **`useAlertDialog()` imperative composable** returns a callable
  `(options?) => Promise<boolean>` and mirrors the `useToast()` idiom: a
  app-scoped **FIFO queue** drained one-at-a-time by a single
  `<VCAlertDialogProvider>` host placed once near the app root (like
  `<VCToaster>`). Like toast, the queue lives on a per-app `AlertDialogManager`
  (`Symbol.for('VCAlertDialogManager')`), so `useAlertDialog()` **injects** and
  must be called from a setup / inject context (capture the callable and
  reuse it in handlers). `Action` → resolves `true`; `Cancel` / Escape →
  resolves `false`. The host renders the head request through the Layer-1
  parts (default title + description + Cancel/Action buttons, with a
  `component` / `componentProps` escape hatch for a fully custom body).
  `injectAlertDialogManager()` exposes `{ queue, settle, clear }` — the host
  drives it, and consumers call `.clear()` to cancel all pending (e.g. on
  route change). `confirm()` resolves `false` without enqueuing when there
  is no `window` (client-only gesture; no SSR-rendered dialog / hydration
  mismatch). (Exported: `AlertDialogManager`, `provideAlertDialogManager`,
  `injectAlertDialogManager` / `tryInjectAlertDialogManager`.)

`tone` (canonical six colors — no `danger` alias) drives the Action
button color via a `tone` variant on the `alertDialog` theme key.
Behavioral strings (`title` / `confirmLabel` / `cancelLabel`) resolve
through `useComponentDefaults('alertDialog', …)` for i18n. There is
deliberately no corner-X close (an alert dialog forces a Cancel/Action
choice), so the theme key has no `close` / `closeIcon` slot. Known v1
limitation: when the queue drains to empty the host content unmounts
without an exit animation (the enter animation still plays).

Theme entries for all eight families (`modal`, `alertDialog`, `popover`,
`hoverCard`, `tooltip`, `dropdownMenu`, `contextMenu`, `toast` + the four
`toast*` sub-keys) ship across `@vuecs/theme-tailwind`,
`@vuecs/theme-bootstrap`, and `@vuecs/theme-bulma` with `data-state`
animation hooks (`open|closed` for modal/popover/hover-card/menu/toast,
`delayed-open|closed` for tooltip). Toast additionally exposes
`data-swipe="move|cancel|end"` for swipe gestures, gated via the
`vc-toast-anim` dual-state helper in `animations.css`. Menu items also
expose `data-highlighted` (hover/focus) and `data-disabled`. Animation
classes (`animate-in`, `fade-in-0`, `zoom-in-95`, etc.) come from
`@vuecs/design`'s `animations.css` (vanilla-CSS port of `tw-animate-css`)
— see "Motion primitives" under the Design System section above.
- Tailwind theme references the per-state classes via the `data-[state=open]:`
  / `data-[state=closed]:` variant prefix (Tailwind compiles each variant
  into a selector that scopes the class to the matching state).
- Bootstrap-v5 theme uses vuecs's dual-state helper classes
  (`vc-overlay-anim`, `vc-overlay-fade-anim`, `vc-tooltip-anim` from
  `animations.css`) which package `data-state`-gated enter+exit
  animations into a single class. Required because BS5 theme strings
  can't carry `data-[state=]:` attribute selectors.

**Both enter AND exit animations fire** today. Reka's `*Content`
primitives wrap themselves in `Presence` internally — when `data-state`
flips to `closed`, Presence reads the element's computed `animation-name`,
suspends unmount, and waits for `animationend` before removing the
element. So the theme's exit-state classes (the `data-[state=closed]:`
variants on theme-tailwind, the `[data-state="closed"]` rules in the
`vc-*-anim` helpers for BS5) actually play. No additional wiring on the
vuecs side is required.

Reka stays an internal dependency; consumers don't touch `reka-ui`
directly — the `<VC*>` parts are the vuecs contract.

DropdownMenu and ContextMenu ship the **full surface** including
`CheckboxItem`, `RadioGroup`, `RadioItem`, `ItemIndicator`, `Sub`,
`SubTrigger`, and `SubContent` parts.

### Close-trigger pattern: `close` + `closeIcon` slots

`<VCModalClose>` and `<VCPopoverClose>` each own two theme slots and pick
between them per render:

| Call shape | Slot read | Intent |
|---|---|---|
| `<VCModalClose />` (slotless) | `closeIcon` | Default `×` glyph in the corner |
| `<VCModalClose>Cancel</VCModalClose>` | `close` | Labelled close button — neutral baseline so consumer `class=` composes cleanly |
| `<VCModalClose icon>...</VCModalClose>` | `closeIcon` | Force corner-X even with custom slot content |

The `close` slot ships neutral (just focus ring) so consumer classes don't
fight absolute positioning; `closeIcon` carries the corner-X positioning
+ sizing (`absolute right-3 top-3 h-7 w-7` in theme-tailwind, `btn-close`
in theme-bootstrap). Slot-presence as the smart default means bare
slotless usages — the most common pattern — keep working without an
explicit prop. The same pattern applies to future overlay families (e.g.
HoverCard) when they ship.

`<VCHoverCard>` doesn't carry a Close part — the panel auto-dismisses
when the pointer leaves the trigger + content (Reka manages the
grace-area travel via `closeDelay`). Click-triggered floating panels
that need an explicit close button use `<VCPopover>` instead.
