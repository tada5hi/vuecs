# @vuecs/overlays

Overlay components for vuecs — Modal, Popover, Tooltip, DropdownMenu, ContextMenu — built as thin wrappers over [Reka UI](https://reka-ui.com/) primitives. Includes a `useModal()` view-stack composable for "list → push detail → pop back" flows in one modal instance.

## Installation

```bash
npm install @vuecs/overlays
```

## Usage

See the [vuecs.dev documentation](https://vuecs.dev) — one page per family:

- [Modal](https://vuecs.dev/components/modal)
- [Popover](https://vuecs.dev/components/popover)
- [Tooltip](https://vuecs.dev/components/tooltip)
- [DropdownMenu](https://vuecs.dev/components/dropdown-menu)
- [ContextMenu](https://vuecs.dev/components/context-menu)

## Bundle size

Wrapper-only deltas, measured from the docs demos build (each demo is a tree-shaken Vue app importing only one family):

| Family | Raw | Gzipped |
|---|---|---|
| Tooltip | 0.88 kB | 0.55 kB |
| Popover | 1.03 kB | 0.62 kB |
| ContextMenu | 1.42 kB | 0.69 kB |
| DropdownMenu | 1.54 kB | 0.71 kB |
| Modal | 3.38 kB | 1.28 kB |

These numbers cover the vuecs SFCs only (per-component theme wiring + prop forwarding). The shared infrastructure — Reka primitives (`Primitive`, `Slot`, focus / scroll / dismiss layers, floating-ui for popover/tooltip/menu) plus `@vuecs/core` — adds a one-time cost amortised across every overlay family the consumer uses.

The full `@vuecs/overlays` bundle (all 5 families + `useModal` + `VCPresence` + DropdownMenu/ContextMenu extras) is 43 kB raw / 4.6 kB gzipped before tree-shaking.
