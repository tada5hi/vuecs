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

The theme contributes class strings like `fa fa-solid fa-plus` to icon-related slots — slot keys ending in `Icon`, `iconLeft`, `iconRight`, etc. across all components.

## Customizing icons per component

Override individual icon classes via the `overrides` layer:

```ts
import vuecs, { extend } from '@vuecs/core';

app.use(vuecs, {
    themes: [tailwindTheme(), fontAwesome()],
    overrides: {
        elements: {
            formSubmit: {
                classes: { iconLeft: extend('fa-rocket') },
            },
        },
    },
});
```

(`extend()` keeps the `fa fa-solid` portion from the theme and appends `fa-rocket`.)

## Alternative: drop the icons

If you'd rather render no icons at all, omit the theme. Most components have an `icon` boolean prop (or behavioral default) you can toggle off too — see each component's API.

## See also

- [Tailwind theme](/themes/tailwind)
- [Theme System](/guide/theme-system) — layered resolution
