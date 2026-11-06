# Stepper

`<VCStepper>` and friends live in `@vuecs/navigation` because a stepper
is a navigation/progress pattern (wizard, checkout flow, onboarding) —
the pattern fit. The Stepper compound is independent of the navigation
registry; it owns its own state via Reka's `StepperRoot`.

```text
@vuecs/navigation/src/components/stepper/
  Stepper.vue              <- StepperRoot (v-model:modelValue, orientation, linear)
  StepperItem.vue          <- StepperItem (step prop required; data-state)
  StepperTrigger.vue       <- StepperTrigger (clickable; disabled in linear mode when unreachable)
  StepperIndicator.vue     <- StepperIndicator (circle: number / check / icon)
  StepperTitle.vue
  StepperDescription.vue
  StepperSeparator.vue     <- StepperSeparator (carries data-state="completed" when prev step is done)
  context.ts               <- provideStepperContext / useStepperContext (theme-class + theme-variant inheritance)
  theme.ts                 <- shared stepperThemeDefaults
  types.ts                 <- StepperThemeClasses + ThemeElements augmentation
  index.ts
```

`<VCStepper>` `provideStepperContext`s its `themeClass` + `themeVariant`
so descendant parts inherit them automatically — a single
`<VCStepper :theme-variant="{ size: 'sm' }">` resizes every indicator /
title / description / separator without per-part repetition. Children
read via `useStepperContext()` and merge with their own per-instance
props (per-instance values win). The context is optional so children
render bare for unit tests / Storybook. `provideStepperContext` /
`useStepperContext` / `StepperContext` are re-exported from
`@vuecs/navigation` for consumers building custom step parts.

Bootstrap theme strings can't carry `[data-state=…]` attribute
selectors, so `themes/bootstrap/assets/index.css` ships dedicated
`[data-state="active|completed"] .vc-stepper-…` rules with `!important`
(Bootstrap utility classes like `.bg-light` ship `!important`; the
attribute-selector specificity boost alone isn't enough). Both states
use the primary color so the trail of progress reads as one
continuous run; the Tailwind theme matches.

`@vuecs/navigation`'s install takes no item list at all — a
consumer always calls `app.use(navigation, {})`, and each `<VCNavItems>`
supplies its own items via `:data`. A stepper-only consumer simply
never mounts a `<VCNavItems>`.

Theme entries ship in `@vuecs/theme-tailwind` (uses
`group-data-[state=active]:` / `group-data-[state=completed]:` variant
prefixes, scoped via the `group` utility added by `<VCStepperItem>`) and
`@vuecs/theme-bootstrap` (Bootstrap utility classes only, with
data-state visualization handled by the bridge CSS as noted above).
