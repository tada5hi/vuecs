# Font Awesome theme

`@vuecs/theme-font-awesome` provides icons for components that have icon slots (list-controls, pagination). It's purely additive — stack it on top of any other theme.

```bash
npm install @vuecs/theme-font-awesome @fortawesome/fontawesome-free
```

## Wire it up

```ts
// main.ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import fontAwesome from '@vuecs/theme-font-awesome';

app.use(vuecs, {
    themes: [tailwindTheme(), fontAwesome()],
});
```

```css
@import "@fortawesome/fontawesome-free/css/all.css";
```

## What it does

The theme contributes class strings like `fa fa-bars` to the icon slots that real components actually expose. The slot names per component:

| Component | Slot keys |
|-----------|-----------|
| `listItem` | `icon` |
| `pagination` | `prevIcon`, `nextIcon`, `firstIcon`, `lastIcon` |

If you add icons for a component the theme doesn't ship defaults for, add them yourself via `overrides`.

## Customizing icons per component

Override individual icon classes via the `overrides` layer. The slot key must match the component's actual icon slot:

```ts
import vuecs, { extend } from '@vuecs/core';

app.use(vuecs, {
    themes: [tailwindTheme(), fontAwesome()],
    overrides: {
        elements: {
            pagination: {
                classes: {
                    prevIcon: extend('fa-arrow-left'),
                    nextIcon: extend('fa-arrow-right'),
                },
            },
        },
    },
});
```

(`extend()` keeps the `fa` base from the theme and appends the extra glyph class.)

## Submit-button icons

`VCButton` has no per-action icon slots — pass `iconLeft` / `iconRight` at the call site. For the `useSubmitButton()` create / update sugar, register icon classes via the `submitButton` defaults instead of through the theme system:

```ts
app.use(vuecs, {
    themes: [tailwindTheme(), fontAwesome()],
    defaults: {
        submitButton: {
            createIcon: 'fa fa-plus',
            updateIcon: 'fa fa-save',
        },
    },
});
```

## Alternative: drop the icons

If you'd rather render no icons at all, omit the theme.

## See also

- [Tailwind theme](/themes/tailwind)
- [Theme System](/guide/theme-system) — layered resolution
