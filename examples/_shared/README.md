# `@vuecs-examples/shared`

Private workspace package — **never published**. Holds the theme-agnostic
demo views consumed by every app under `examples/`:

- `examples/nuxt/` (flagship Nuxt + Tailwind)
- `examples/tailwind/` (vanilla Vite + Vue)
- `examples/bootstrap/` (vanilla Vite + Vue)
- `examples/bulma/` (vanilla Vite + Vue)

The docs site (`docs/`) also pulls demo bodies from here so the same
view code drives both the marketing iframe and the runnable apps.

## The constraint: theme-agnostic views

Every `.vue` file under `src/views/` must render correctly under
**any** of the three vuecs themes. That permits:

- `<VC*>` components — their entire raison d'être.
- `vc-*` structural classes (theme-neutral; owned by component
  packages).
- Vanilla CSS for layout: inline `style="display:flex; gap:1rem"`
  or scoped `<style>` blocks with plain CSS properties.

That **forbids**:

- Tailwind utilities (`flex gap-4 items-start`) — break under BS-only
  / Bulma-only consumers.
- Bootstrap classes (`.row .col-md-6`) — only render styled under BS.
- Bulma classes (`.columns .column`) — same.

If you reach for layout utilities while writing a shared view, write
plain CSS instead. Idiomatic per-framework chrome belongs in each
example app's shell (`App.vue` / `layouts/default.vue`), not here.

## Plan reference

`.agents/plans/019-per-theme-examples.md` — full motivation, phases,
and risks.
