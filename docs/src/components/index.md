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

## @vuecs/form-controls

| Component | Notes |
|-----------|-------|
| [FormInput](/components/form-input) | Text input with optional debounce |
| [FormTextarea](/components/form-textarea) | Multi-line text input |
| [FormSelect](/components/form-select) | Dropdown select |
| [FormSelectSearch](/components/form-select-search) | Searchable select for long option lists |
| [FormCheckbox](/components/form-checkbox) | Checkbox or switch (variant) |
| [FormRangeSlider](/components/form-range-slider) | Dual-handle range slider |

## @vuecs/gravatar

| Component | Notes |
|-----------|-------|
| [Gravatar](/components/gravatar) | Gravatar avatar from email address |

## @vuecs/link

| Component | Notes |
|-----------|-------|
| [Link](/components/link) | Router-aware anchor (vue-router / nuxt) |

## @vuecs/list-controls

| Component | Notes |
|-----------|-------|
| [ListControls](/components/list-controls) | List with header/body/footer/no-more states |

## @vuecs/navigation

| Component | Notes |
|-----------|-------|
| [Navigation](/components/navigation) | Multi-level nav with router integration |

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
