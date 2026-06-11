# Variants

Variants let components declare named, state-based or size-based class variations declaratively. Components default to a set of variants; themes and overrides can extend or replace them.

## Defining variants

```ts
{
    classes: { root: 'vc-list-item' },
    variants: {
        size: {
            sm: { root: 'py-1', icon: 'size-4' },
            md: { root: 'py-2', icon: 'size-5' },
            lg: { root: 'py-3', icon: 'size-6' },
        },
        busy: {
            true: { root: 'opacity-50' },
            false: { root: 'opacity-100' },
        },
    },
    defaultVariants: { size: 'md' },
}
```

The `variants` map is `{ [variantName]: { [variantValue]: { [slot]: classes } } }`. Boolean variants use string keys `'true'` / `'false'` — at resolution time, boolean values from `themeVariant` are coerced via `String(value)`.

## Setting variant values

From the consumer side:

```vue
<VCListItem :theme-variant="{ size: 'lg', busy: true }" />
```

Unset values fall back to `defaultVariants`, then to "no class for this variant".

## Compound variants

Compound variants apply when **all** conditions match:

```ts
compoundVariants: [
    {
        variants: { busy: true, size: 'lg' },
        class: { root: 'cursor-wait' },
    },
],
```

When a `<VCListItem>` has both `busy: true` and `size: 'lg'`, the `cursor-wait` class joins the resolved root classes.

## Merge rules across layers

When variants are defined in component defaults, themes, and overrides, they merge as follows:

| Field | Merge strategy |
|-------|----------------|
| `variants` | **deep merge** — later layer wins per `(variantName, variantValue)` pair |
| `compoundVariants` | **concatenate** — all layers' compound variants are evaluated |
| `defaultVariants` | **shallow merge** — later layer wins per key |

This means a theme can:

- Override `size.lg` to render with different padding
- Add a brand-new `outlined` variant that the component defaults didn't ship
- Append a new compound-variant rule without erasing the component's

## Resolution order

```
1. Extract variant definitions from defaults + all themes + overrides (merged)
2. Read variant values from themeVariant (instance) ∪ defaultVariants (merged)
3. For each (variantName, value): apply matching definition to slot classes
4. Evaluate compound variants: concatenate all whose conditions match
5. Merge variant classes into the resolved slot class strings
```

The order is: simple variants first, compound variants stacked on top. Compound-variant classes always win against simple-variant classes for the same slot.

## Pure resolution

Variant resolution is implemented as two pure functions in `@vuecs/core`:

- `extractVariantConfig(defaults, themes, overrides)` — returns the merged definitions
- `resolveVariantClasses(definitions, values)` — applies values to definitions

Same pattern as the theme resolver — zero Vue imports, fully unit-testable.

## Built-in variant axes

Most vuecs components ship with at least one variant axis defined by
the active theme package. The most common axes:

| Axis | Values | Components |
|---|---|---|
| `size` | `sm` / `md` / `lg` (modal also `xl`) | Button, Badge, Tag, Avatar, Alert, Pagination, FormInput, FormTextarea, FormSelect, FormSelectSearch, FormNumber, FormCheckbox, FormSwitch, FormRadio, FormTags, Modal, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Navigation, Stepper |
| `density` | `compact` / `normal` / `spacious` | List, ListItem, Table |
| `variant` | varies — usually `solid` / `outline` / `soft` / `ghost` (+ `link` on Button; `elevated` on Card) | Button, Badge, Alert, Card, Toast, Pagination |
| `color` | `primary` / `neutral` / `success` / `warning` / `error` / `info` | Button, Badge, Alert, Toast |
| `severity` | `error` / `warning` | Form inputs — folded in automatically from a surrounding `<VCFormGroup>`; see [Validation Feedback](/guide/validation-feedback) |

You can flip these live in the docs site demos via the toolbar above
each `<Playground>` block — open the [pagination
demo](/components/pagination) for a richer example with boolean and
number controls in addition to the variant axis.

## See also

- [Theme System](/guide/theme-system) — how variants integrate into the four-layer resolution chain
- [Components](/components/) — see variants in action on real components
