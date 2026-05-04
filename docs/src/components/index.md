# Components

vuecs ships its components across separate packages — install only what you use. Each package is also a Vue plugin (`app.use(formControls)`) for global registration.

## @vuecs/button

| Component | Notes |
|-----------|-------|
| [Button](/components/button) | General-purpose button with color/variant/size and a `useSubmitButton()` create-update helper |

## @vuecs/countdown

| Component | Notes |
|-----------|-------|
| [Countdown](/components/countdown) | Timer countdown with typed slot props |

## @vuecs/elements

| Component | Notes |
|-----------|-------|
| [AspectRatio](/components/aspect-ratio) | Responsive media container that maintains a width / height ratio (Reka primitive) |
| [Avatar](/components/avatar) | Image with graceful fallback (initials, icon, slot) — Reka primitive |
| [Badge](/components/badge) | Status pill — `solid` / `soft` / `outline` × semantic color matrix |
| [Separator](/components/separator) | Horizontal / vertical divider with proper ARIA (Reka primitive) |
| [Tag](/components/tag) | Removable, value-bound chip + `<VCTagList>` helper |
| [VisuallyHidden](/components/visually-hidden) | Screen-reader-only content (Reka primitive) |

## @vuecs/forms

| Component | Notes |
|-----------|-------|
| [FormInput](/components/form-input) | Text input with optional debounce |
| [FormNumber](/components/form-number) | Typed numeric input with steppers (Reka primitive) |
| [FormPin](/components/form-pin) | PIN / OTP input (Reka primitive) |
| [FormTextarea](/components/form-textarea) | Multi-line text input |
| [FormSelect](/components/form-select) | Dropdown select with `FormOption` shape + grouping |
| [FormSelectSearch](/components/form-select-search) | Searchable select for long option lists |
| [FormCheckbox](/components/form-checkbox) | Checkbox + group (Reka primitive); supports tri-state |
| [FormSwitch](/components/form-switch) | Toggle switch (Reka primitive) |
| [FormRadio](/components/form-radio) | Radio + group with single v-model (Reka primitive) |
| [FormSlider](/components/form-slider) | Single-thumb or range slider; thumb count derives from v-model shape |
| [FormTags](/components/form-tags) | Multi-value chip input (Reka primitive) |

## @vuecs/gravatar

| Component | Notes |
|-----------|-------|
| [Gravatar](/components/gravatar) | Gravatar avatar from email address |

## @vuecs/icon

| Component | Notes |
|-----------|-------|
| [Icon](/components/icon) | Iconify-backed icon component used by `VCButton`, `VCPagination`, … |

## @vuecs/link

| Component | Notes |
|-----------|-------|
| [Link](/components/link) | Router-aware anchor (vue-router / nuxt) |

## @vuecs/list

| Component | Notes |
|-----------|-------|
| [List](/components/list) | Compound list (List/Header/Body/Item/Footer/Loading/NoMore) + `useList()` |

## @vuecs/navigation

| Component | Notes |
|-----------|-------|
| [Navigation](/components/navigation) | Multi-level nav with router integration |
| [Stepper](/components/stepper) | Multi-step wizard / checkout / onboarding navigator (Reka primitive) |

## @vuecs/overlays

| Component | Notes |
|-----------|-------|
| [Modal](/components/modal) | Compound dialog (`VCModal*` parts) + `useModal()` view-stack composable |
| [Popover](/components/popover) | Floating panel anchored to a trigger (floating-ui positioning) |
| [HoverCard](/components/hover-card) | Hover-triggered floating panel with grace-area handling |
| [Tooltip](/components/tooltip) | Hover/focus text bubble; app-level `<VCTooltipProvider>` for delays |
| [DropdownMenu](/components/dropdown-menu) | Click-triggered action menu with arrow/typeahead navigation |
| [ContextMenu](/components/context-menu) | Right-click menu (same shape as DropdownMenu, cursor-anchored) |

## @vuecs/pagination

| Component | Notes |
|-----------|-------|
| [Pagination](/components/pagination) | Offset/limit page navigation |

## @vuecs/timeago

| Component | Notes |
|-----------|-------|
| [Timeago](/components/timeago) | Relative time display |

## Conventions across components

- Every component takes `themeClass` (slot class overrides) and `themeVariant` (variant values) — see [Theme System](/guide/theme-system).
- Components use TypeScript render functions (`defineComponent` + `h()`) — there are no `.vue` SFCs to compile in most packages, except `form-controls`.
- Slot props are typed and exported per component — `ListItemSlotProps`, `NavItemLinkSlotProps`, `CountdownSlotProps`, etc.
