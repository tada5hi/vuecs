# Tailwind theme

`@vuecs/theme-tailwind` is the native pairing for `@vuecs/design`. Components emit Tailwind utility classes that resolve through the design-token chain.

```bash
npm install @vuecs/theme-tailwind
npm install -D tailwindcss @tailwindcss/vite
```

## Wire it up

```ts
// main.ts
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';

app.use(vuecs, { themes: [tailwindTheme()] });
```

```css
/* styles.css */
@import "tailwindcss";
@import "@vuecs/design";

@source "../node_modules/@vuecs/theme-tailwind/dist";

@custom-variant dark (&:where(.dark, .dark *));
```

The `@source` directive ensures Tailwind v4's JIT picks up the class names baked into the theme's published `dist` files.

## Requirements

- **Tailwind v4 only.** v3 is not supported — the design tokens use `@theme` and CSS variables that v3 doesn't understand.
- **Class-based dark mode.** Toggle `.dark` on `<html>` (or any ancestor); semantic tokens flip automatically.

## Class merging

`tailwindTheme()` already pre-wires its own `classesMergeFn` (a `twMerge`-backed function), so when two layers contribute conflicting Tailwind utilities (e.g. `p-4` and `p-6`), `twMerge` keeps only the later one. You don't need to wire it yourself.

If you want to reuse the same merge function in your own overrides — e.g. for a custom theme stacked on top — import the exported `merge` and pass it via `overrides.classesMergeFn`:

```ts
import { merge } from '@vuecs/theme-tailwind';
import vuecs from '@vuecs/core';

app.use(vuecs, {
    themes: [tailwindTheme()],
    overrides: {
        classesMergeFn: merge,
        elements: { /* ... */ },
    },
});
```

Without a merge function, conflicting utilities both appear in the class string (Tailwind's last-rule-wins handles it at CSS level, but stricter linters complain). With `twMerge`, conflicts are resolved at class-string level.

## Recommended companion

`@vuecs/theme-font-awesome` — adds `fa fa-*` glyphs into icon slots. Both themes can stack:

```ts
app.use(vuecs, {
    themes: [tailwindTheme(), fontAwesome()],
});
```

## See also

- [Design Tokens](/guide/design-tokens) — the token chain Tailwind utilities resolve through
- [Theme System](/guide/theme-system) — layered class resolution
