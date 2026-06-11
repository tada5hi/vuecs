# @vuecs/elements

[![npm version](https://img.shields.io/npm/v/@vuecs/elements)](https://www.npmjs.com/package/@vuecs/elements)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The atomic building blocks of [vuecs](https://github.com/tada5hi/vuecs).** Small, presentation-only elements — each one ≤150 lines, pure CSS or a thin [Reka UI](https://reka-ui.com) wrapper, owning its own theme key.

## ✨ What's inside

**Atoms**

- 🏷️ **`<VCBadge>`** — status indicator with the full `variant` (`solid` / `soft` / `outline`) × semantic-color × size matrix.
- 💊 **`<VCTag>` / `<VCTags>`** — removable, value-bound chips (single or array-driven).
- 👤 **`<VCAvatar>`** — image avatar with `#fallback` slot (Reka Avatar).
- ➖ **`<VCSeparator>`** — horizontal/vertical rule, `decorative` ARIA handling.
- 🖼️ **`<VCAspectRatio>`** — fixed-ratio container.
- 🙈 **`<VCVisuallyHidden>`** — screen-reader-only content.

**Compounds**

- 🗂️ **Card** — `<VCCard>` + Header / Title / Description / Body / Footer. `variant` (`outline` / `soft` / `elevated`), `interactive` hover/focus ring for whole-card links (`as-child` + `<NuxtLink>`), and `padding` set once on the root and inherited by every band. Plus `<VCCardPlaceholder>`, the matching skeleton.
- 🚨 **Alert** — `<VCAlert>` + Title / Description / Close. Persistent banner with a 15-cell `variant` × `color` matrix.
- 📂 **Collapse** — `<VCCollapse>` + Trigger / Content (Reka Collapsible) with auto-chevron and height animation.

## 📦 Installation

```bash
npm install @vuecs/elements
```

## ⚡ Usage

```vue
<VCBadge color="success" variant="soft">Active</VCBadge>

<VCCard variant="elevated" padding="compact">
    <VCCardHeader>
        <VCCardTitle>Monthly revenue</VCCardTitle>
        <VCCardDescription>Compared to last month</VCCardDescription>
    </VCCardHeader>
    <VCCardBody>…</VCCardBody>
</VCCard>
```

## 📚 Documentation

One page per element on **[vuecs.dev](https://vuecs.dev/components/)**:

[Badge](https://vuecs.dev/components/badge) · [Tag & Tags](https://vuecs.dev/components/tag) · [Avatar](https://vuecs.dev/components/avatar) · [Separator](https://vuecs.dev/components/separator) · [AspectRatio](https://vuecs.dev/components/aspect-ratio) · [VisuallyHidden](https://vuecs.dev/components/visually-hidden) · [Card](https://vuecs.dev/components/card) · [Alert](https://vuecs.dev/components/alert) · [Collapse](https://vuecs.dev/components/collapse)

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
