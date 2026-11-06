# Building blocks (Reka UI)

Component packages use Reka primitives for focus management, keyboard interaction and edge-aware overlays. Reka is an internal runtime dependency of the packages that wrap it; the public props, emits, classes and slots remain the vuecs contract. See the [upstream mapping](../references/reka-ui.md).

The one unthemed Reka primitive vuecs exposes — `Primitive` (the `as` /
`asChild` building block) — is **ported in-tree** into `@vuecs/core` as
`VCPrimitive` so downstream component libraries that build on top of
vuecs don't have to take a direct `reka-ui` peer-dep just to render a
themed generic element. Same port-don't-depend pattern as the headless
composables section below.
