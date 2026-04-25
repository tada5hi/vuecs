# Font Awesome theme

`@vuecs/theme-font-awesome` provides icons for components that have icon slots (form-submit, list-controls, navigation, pagination). It's purely additive — stack it on top of any other theme.

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

The theme contributes class strings like `fa fa-plus` to the icon slots that real components actually expose. The slot names per component:

| Component | Slot keys |
|-----------|-----------|
| `formSubmit` | `createIcon`, `updateIcon` |
| `listItem` | `icon` |
| `pagination` | `prevIcon`, `nextIcon`, `firstIcon`, `lastIcon` |

If you add icons for a component the theme doesn't ship defaults for, add them yourself via `overrides`.

## Customizing icons per component

Override individual icon classes via the `overrides` layer. The slot key must match the component's actual icon slot — e.g. `createIcon` / `updateIcon` for `formSubmit`:

```ts
import vuecs, { extend } from '@vuecs/core';

app.use(vuecs, {
    themes: [tailwindTheme(), fontAwesome()],
    overrides: {
        elements: {
            formSubmit: {
                classes: {
                    createIcon: extend('fa-rocket'),
                    updateIcon: extend('fa-pen'),
                },
            },
        },
    },
});
```

(`extend()` keeps the `fa` base from the theme and appends the extra glyph class.)

## Alternative: drop the icons

If you'd rather render no icons at all, omit the theme. Most components have an `icon` boolean prop (or behavioral default) you can toggle off too — see each component's API.

## See also

- [Tailwind theme](/themes/tailwind)
- [Theme System](/guide/theme-system) — layered resolution
