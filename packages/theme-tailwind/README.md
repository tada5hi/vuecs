# @vuecs/theme-tailwind 🌬️

[![npm version](https://badge.fury.io/js/@vuecs%2Ftheme-tailwind.svg)](https://badge.fury.io/js/@vuecs%2Ftheme-tailwind)

Tailwind CSS theme for the vuecs component library. Class strings
reference **semantic Tailwind colors** (`bg-primary-600`, `text-fg`,
`border-border`) that resolve via `@vuecs/design` design tokens
— so reskinning is a single-variable change and dark mode comes for free.

**Table of Contents**

- [Installation](#installation)
- [Setup](#setup)
- [How It Works](#how-it-works)
- [Reskinning](#reskinning)
- [Requirements](#requirements)
- [License](#license)

## Installation

```bash
npm install @vuecs/theme-tailwind @vuecs/design @vuecs/core
```

## Setup

```css
/* app.css */
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

```ts
// main.ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';

app.use(vuecs, {
    themes: [tailwindTheme()],
});
```

## How It Works

Every class string in this theme uses **semantic** Tailwind color names
— `primary`, `neutral`, `success`, `warning`, `error`, `info`, `bg`,
`fg`, `border`, `ring`, `on-*`. The `@vuecs/design` package wires those
names to `--vc-color-*` CSS variables via a Tailwind v4 `@theme` block.

```
bg-primary-600
  → var(--color-primary-600)          (Tailwind @theme)
  → var(--vc-color-primary-600)       (@vuecs/design semantic scale)
  → var(--color-blue-600)             (palette binding — default)
  → concrete hex
```

Because the chain is CSS-variable-based, `.dark` and `setPalette()`
flips propagate through without the theme package having to know
anything about them.

## Reskinning

Three options, from least to most intrusive:

1. **Swap the primary palette.** Call `setPalette({ primary: 'violet' })`
   from `@vuecs/design` (or set it via `@vuecs/nuxt`'s
   `vuecs.palette` config). Every `bg-primary-*` usage in every
   component updates — no re-resolution needed.
2. **Override individual tokens.** Redefine specific CSS variables in
   your own stylesheet:
   ```css
   :root {
       --vc-color-primary-600: oklch(0.5 0.25 250);
       --vc-radius-md: 0.25rem;
   }
   ```
3. **Override specific component slots** via `app.use(vuecs, { overrides: { elements: { ... } } })`. Reserved for one-off cases — 99% of visual tweaks can be done at the token level instead.

## Requirements

- **Tailwind CSS v4+.** This theme's class strings (`bg-primary-600`,
  `text-fg`, `rounded-md`) only resolve when `@vuecs/design`'s
  `@theme` block is loaded into a Tailwind v4 build. Tailwind v3 is not
  supported.
- **`@vuecs/design`.** Import `@vuecs/design` alongside Tailwind in
  your main stylesheet (short form resolves to `index.css`).
- **`@vuecs/core`.** The theme is consumed through the core theme
  resolver.

## License

Made with 💚

Published under [MIT License](./LICENSE).
