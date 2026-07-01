# @vuecs/overlays

[![npm version](https://img.shields.io/npm/v/@vuecs/overlays)](https://www.npmjs.com/package/@vuecs/overlays)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**Eight overlay families for [vuecs](https://github.com/tada5hi/vuecs)** — Modal, AlertDialog, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Toast — as thin themed wrappers over [Reka UI](https://reka-ui.com) primitives. Reka handles focus traps, dismiss layers, and positioning; vuecs handles the look, through whichever theme you install.

## ✨ What's inside

- 🪟 **Modal** — with **`useModal()`**, a view-stack composable (`pushView` / `popView` / `replaceView`) for "list → detail → back" flows inside one modal instance. No stacked dialogs, no z-index fights.
- ⚠️ **AlertDialog** — the `role="alertdialog"` confirmation primitive (outside-click off, distinct Cancel/Action buttons) **plus `useConfirm()`** — `const ok = await confirm({ title, description, tone: 'error' })`. A single `<VCConfirmDialog>` host drains a shared FIFO queue, the same way `<VCToaster>` drains `useToast()`.
- 🔔 **Toast** — with **`useToast()`**, an **app-scoped** queue (`add` / `dismiss` / `update` / `clear`), provided per-app so SSR requests stay isolated. Capture it from a component `setup()` and reuse the returned API anywhere (store, interceptor); every entry lands in the same `<VCToaster>` viewport.
- 💬 **Popover · HoverCard · Tooltip** — positioned floating panels with arrows, grace-area hover (HoverCard), and provider-level config (Tooltip).
- 📋 **DropdownMenu · ContextMenu** — the full menu surface: items, labels, separators, groups, checkbox items, radio groups, submenus.
- 🎞️ **Enter *and* exit animations** — `data-state`-driven, with Reka's internal `Presence` delaying unmount until the exit animation completes. Works in every shipping theme.
- 📦 **Portals included** — every `*Content` part bundles its portal; an `inline` prop bypasses it for tests or custom mounting.

## 📦 Installation

```bash
npm install @vuecs/overlays
```

## ⚡ Usage

```vue
<VCModal v-model:open="open">
    <VCModalTrigger as-child><VCButton>Open</VCButton></VCModalTrigger>
    <VCModalContent>
        <VCModalTitle>Confirm action</VCModalTitle>
        <VCModalDescription>This cannot be undone.</VCModalDescription>
        <VCModalClose>Cancel</VCModalClose>
    </VCModalContent>
</VCModal>
```

```ts
import { useToast } from '@vuecs/overlays';

const toast = useToast();
toast.add({ title: 'Saved', description: 'Your changes are live.', color: 'success' });
```

```ts
import { useConfirm } from '@vuecs/overlays';

const confirm = useConfirm();
// Place a single <VCConfirmDialog /> near your app root, then:
if (await confirm({ title: 'Delete project?', description: 'This cannot be undone.', tone: 'error' })) {
    await api.deleteProject(id);
}
```

## ⚖️ Bundle size

Wrapper-only deltas, measured from tree-shaken single-family builds:

| Family | Raw | Gzipped |
|---|---|---|
| Tooltip | 0.88 kB | 0.55 kB |
| Popover | 1.03 kB | 0.62 kB |
| ContextMenu | 1.42 kB | 0.69 kB |
| DropdownMenu | 1.54 kB | 0.71 kB |
| Modal | 3.38 kB | 1.28 kB |

The shared Reka + `@vuecs/core` infrastructure is a one-time cost amortised across every family you use; the full package (all 8 families + composables) is ~46 kB raw / ~5 kB gzipped before tree-shaking.

## 📚 Documentation

One page per family on **[vuecs.dev](https://vuecs.dev/components/)**:

[Modal](https://vuecs.dev/components/modal) · [AlertDialog](https://vuecs.dev/components/alert-dialog) · [Popover](https://vuecs.dev/components/popover) · [HoverCard](https://vuecs.dev/components/hover-card) · [Tooltip](https://vuecs.dev/components/tooltip) · [DropdownMenu](https://vuecs.dev/components/dropdown-menu) · [ContextMenu](https://vuecs.dev/components/context-menu) · [Toast](https://vuecs.dev/components/toast)

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
