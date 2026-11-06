import type { ValidationSeverity } from '../constants';

/**
 * Context shared from `<VCFormGroup>` to its descendant form-input
 * children (`<VCFormInput>`, `<VCFormTextarea>`, `<VCFormSelect>`, …)
 * so the resolved validation severity propagates down without the
 * consumer wiring `:theme-variant="{ severity }"` on every input.
 *
 * Children read the context and fold the inherited severity into
 * their own `themeVariant`, lighting up each theme's `severity` variant
 * (red border for `error`, amber for `warning`, green for `success`
 * once themes declare it). Per-instance values on a child still win —
 * pass `:theme-variant="{ severity: 'error' }"` to override the
 * inherited one, or `:theme-variant="{ severity: undefined }"` to
 * explicitly opt out of inheritance for a single input.
 *
 * Optional — children render with their default border when mounted
 * outside `<VCFormGroup>` (ad-hoc usage, unit tests, custom layouts).
 *
 * Nested `<VCFormGroup>`s: the inner provider wins, so an input
 * mounted inside two stacked groups sees the inner group's severity.
 *
 * The severity getter is a function (not a plain value) so reads track
 * Vue's reactive deps: when the parent's `:validation` bundle updates,
 * descendants re-render automatically through `useComponentTheme`'s
 * computed wrapper.
 */
export type FormGroupContext = {
    severity: () => `${ValidationSeverity}` | 'success' | undefined;
};
