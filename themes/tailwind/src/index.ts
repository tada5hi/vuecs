import type { ClassesMergeFn, Theme } from '@vuecs/core';
import { COLOR_PALETTES } from '@vuecs/design';
import { twMerge } from 'tailwind-merge';
import './config';
import { renderColorPaletteStyles } from './palette';

export { renderColorPaletteStyles, setColorPalette } from './palette';
/**
 * @deprecated Import `useColorPalette` from `@vuecs/design` instead.
 *
 * The per-theme wrapper previously auto-wired the CSP nonce via
 * `useConfig('nonce')` from `@vuecs/core`. The design-level composable
 * does not. If you rely on CSP nonces, pass `nonce` explicitly:
 *
 *     import { useColorPalette } from '@vuecs/design';
 *     import { useConfig } from '@vuecs/core';
 *     const { current, set } = useColorPalette({
 *         nonce: () => useConfig('nonce').value,
 *     });
 *
 * Will be removed in the next major version of `@vuecs/theme-tailwind`.
 */
export { useColorPalette } from '@vuecs/design';
/** @deprecated Import from `@vuecs/design` instead. */
export type { UseColorPaletteOptions, UseColorPaletteReturn } from '@vuecs/design';
// `applyColorPaletteCss`, `bindColorPalette`, and `COLOR_PALETTE_STYLE_ELEMENT_ID` are
// theme-agnostic primitives — re-exported from `@vuecs/design`. Consumers
// can import them from either source; we keep the re-export so downstream
// code that picked up the imports from theme-tailwind in earlier versions
// keeps working.
export {
    COLOR_PALETTE_STYLE_ELEMENT_ID,
    applyColorPaletteCss,
    bindColorPalette,
} from '@vuecs/design';
/** @deprecated Import from `@vuecs/design` instead — the canonical `ColorPaletteConfig` lives there since plan 026. */
export type { ColorPaletteConfig } from '@vuecs/design';

export const merge: ClassesMergeFn = (base, override) => twMerge(base, override);

/**
 * Tailwind theme for vuecs components.
 *
 * Class strings reference **semantic Tailwind colors** that this package
 * exposes via a Tailwind v4 `@theme` block in `assets/index.css` — e.g.
 * `bg-primary-600`, `text-fg`, `border-border`. The `@theme` block maps
 * Tailwind's `--color-*` names onto `--vc-color-*` CSS variables, which
 * `@vuecs/design` defines as concrete OKLCH literals.
 *
 * Consumers must:
 *   1. Use Tailwind CSS v4 (v3 is not supported).
 *   2. Import `@vuecs/design` (concrete tokens) AND `@vuecs/theme-tailwind`
 *      (Tailwind rebind + `@theme` block + safelist) alongside their
 *      Tailwind stylesheet.
 *
 * Reskinning is done by redefining `--vc-color-*` variables (manually or
 * via `setColorPalette()`, exported from this package). No theme override
 * needed.
 */
export default function tailwindTheme(): Theme {
    return {
        classesMergeFn: merge,
        /*
         * Theme-runtime hook (plan 021): declare the Tailwind palette
         * renderer + catalog. `@vuecs/design`'s `useColorPalette()`
         * walks installed themes and routes through `palette.handle`,
         * so `@vuecs/theme-tailwind`'s `useColorPalette()` wrapper now
         * delegates here rather than wiring the renderer directly.
         */
        palette: {
            handle: renderColorPaletteStyles as (palette: Record<string, string>) => string,
            names: COLOR_PALETTES,
        },
        elements: {
            formGroup: {
                classes: {
                    root: 'flex flex-col gap-1',
                    label: 'text-sm font-medium text-fg',
                    hint: 'text-xs text-fg-muted',
                    validationError: 'text-xs text-error-600',
                    validationWarning: 'text-xs text-warning-600',
                },
            },
            formInput: {
                classes: {
                    root: 'block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-bg-muted',
                    rootGroupStart: 'rounded-l-none',
                    rootGroupEnd: 'rounded-r-none',
                    group: 'flex items-stretch',
                    groupAppend: 'inline-flex items-center rounded-r-md border border-l-0 border-border bg-bg-muted px-3 text-sm text-fg-muted',
                    groupPrepend: 'inline-flex items-center rounded-l-md border border-r-0 border-border bg-bg-muted px-3 text-sm text-fg-muted',
                },
                // Size axis mirrors the button family — `sm` shrinks padding
                // + font-size for dense forms, `lg` scales up for primary
                // call-to-action inputs. tailwind-merge dedupes the
                // overlap with the default `px-3 py-2 text-sm` chrome.
                //
                // Severity axis is folded in from the surrounding
                // `<VCFormGroup>`'s validation bundle (see
                // `useFormInputThemeProps` in @vuecs/forms). `error` /
                // `warning` repaint the border + focus ring; the default
                // primary-focus chrome is overridden via tailwind-merge.
                variants: {
                    size: {
                        xs: {
                            root: 'px-1.5 py-0.5 text-[0.7rem]',
                            groupAppend: 'px-1.5 text-[0.7rem]',
                            groupPrepend: 'px-1.5 text-[0.7rem]',
                        },
                        sm: {
                            root: 'px-2 py-1 text-xs',
                            groupAppend: 'px-2 text-xs',
                            groupPrepend: 'px-2 text-xs',
                        },
                        md: { root: '' },
                        lg: {
                            root: 'px-4 py-3 text-base',
                            groupAppend: 'px-4 text-base',
                            groupPrepend: 'px-4 text-base',
                        },
                    },
                    severity: {
                        error: { root: 'border-error-500 focus:border-error-500 focus:ring-error-500' },
                        warning: { root: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formCheckbox: {
                classes: {
                    root: 'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-border bg-bg text-on-primary shadow-sm transition-colors hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600 data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:border-primary-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    indicator: 'inline-flex items-center justify-center text-current',
                    label: 'text-sm text-fg cursor-pointer select-none',
                    group: 'inline-flex items-center gap-2',
                },
                // Sizing references the structural `vc-form-checkbox-{sm,lg}` helpers
                // (defined in @vuecs/forms/assets/form-checkbox.css) — utility-class
                // sizing like `h-3 w-3` lives in `@layer utilities` which loses to
                // the unlayered structural `.vc-form-checkbox` rule. Label
                // font-size uses Tailwind v4's `class!` important suffix to beat
                // the structural label rule.
                variants: {
                    size: {
                        xs: { root: 'vc-form-checkbox-xs', label: 'text-[0.7rem]!' },
                        sm: { root: 'vc-form-checkbox-sm', label: 'text-xs!' },
                        md: { root: '' },
                        lg: { root: 'vc-form-checkbox-lg', label: 'text-base!' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formCheckboxGroup: { classes: { root: 'flex flex-col gap-2 data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center' } },
            formSwitch: {
                classes: {
                    root: 'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border bg-bg-muted p-0.5 shadow-sm transition-colors hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    thumb: 'block h-3.5 w-3.5 rounded-full bg-bg shadow ring-0 transition-transform translate-x-0 data-[state=checked]:translate-x-4',
                    label: 'text-sm text-fg cursor-pointer select-none',
                    group: 'inline-flex items-center gap-2',
                },
                // Sizing references the structural `vc-form-switch-{sm,lg}` helpers
                // (track + thumb + checked-translate scale together via descendant
                // selectors). See formCheckbox above for rationale.
                variants: {
                    size: {
                        xs: { root: 'vc-form-switch-xs', label: 'text-[0.7rem]!' },
                        sm: { root: 'vc-form-switch-sm', label: 'text-xs!' },
                        md: { root: '' },
                        lg: { root: 'vc-form-switch-lg', label: 'text-base!' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formSelect: {
                classes: {
                    trigger: 'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-ring data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-muted data-[placeholder]:text-fg-muted',
                    value: 'truncate',
                    icon: 'inline-flex h-4 w-4 shrink-0 items-center justify-center text-fg-muted',
                    content: 'z-50 overflow-hidden rounded-md border border-border bg-bg text-sm text-fg shadow-md min-w-[var(--reka-select-trigger-width)] max-h-[var(--reka-select-content-available-height)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    viewport: 'p-1',
                    item: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-7 pr-2 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    itemIndicator: 'absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center text-primary-600',
                    group: '',
                    groupLabel: 'px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted',
                    separator: '-mx-1 my-1 h-px bg-border',
                },
                // Trigger size uses the structural `vc-form-select-trigger-{sm,lg}`
                // helpers — see formCheckbox above for rationale.
                variants: {
                    size: {
                        xs: { trigger: 'vc-form-select-trigger-xs', item: 'py-0.5 pl-6 text-[0.7rem]!' },
                        sm: { trigger: 'vc-form-select-trigger-sm', item: 'py-1 pl-6 text-xs!' },
                        md: { trigger: '' },
                        lg: { trigger: 'vc-form-select-trigger-lg', item: 'py-2 pl-8 text-base!' },
                    },
                    severity: {
                        error: { trigger: 'border-error-500 focus:border-error-500 focus:ring-error-500' },
                        warning: { trigger: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formSelectSearch: {
                classes: {
                    root: 'relative block',
                    input: 'block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-bg-muted',
                    content: 'absolute inset-x-0 top-[calc(100%+0.25rem)] z-50 max-h-60 overflow-y-auto rounded-md border border-border bg-bg shadow-md',
                    item: 'flex cursor-pointer select-none flex-col gap-0.5 px-3 py-2 text-sm text-fg outline-none hover:bg-bg-muted',
                    itemActive: 'bg-bg-elevated! font-semibold',
                    itemCurrent: 'bg-bg-muted',
                    itemDescription: 'text-xs text-fg-muted',
                    selected: 'mt-2 flex flex-wrap gap-1',
                    selectedItem: 'inline-flex items-center gap-1 rounded-sm border border-border bg-bg-muted px-2 py-0.5 text-xs text-fg hover:bg-bg-elevated',
                    selectedItemRemove: 'font-semibold leading-none text-fg-muted',
                },
                variants: {
                    severity: {
                        error: { input: 'border-error-500 focus:border-error-500 focus:ring-error-500' },
                        warning: { input: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500' },
                    },
                },
            },
            formRadio: {
                classes: {
                    root: 'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border bg-bg shadow-sm transition-colors hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 data-[state=checked]:border-primary-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    indicator: 'block h-2 w-2 rounded-full bg-primary-600',
                    label: 'text-sm text-fg cursor-pointer select-none',
                    group: 'inline-flex items-center gap-2',
                },
                // Sizing references the structural `vc-form-radio-{sm,lg}` helpers
                // (root + indicator scale together via descendant selectors).
                variants: {
                    size: {
                        xs: { root: 'vc-form-radio-xs', label: 'text-[0.7rem]!' },
                        sm: { root: 'vc-form-radio-sm', label: 'text-xs!' },
                        md: { root: '' },
                        lg: { root: 'vc-form-radio-lg', label: 'text-base!' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formRadioGroup: { classes: { root: 'flex flex-col gap-2 data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-4' } },
            formPin: {
                classes: {
                    root: 'inline-flex items-center gap-2',
                    input: 'h-10 w-10 rounded-md border border-border bg-bg text-center text-lg font-medium text-fg shadow-sm tabular-nums focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-bg-muted disabled:opacity-50',
                },
            },
            formSlider: {
                classes: {
                    root: 'relative flex items-center select-none touch-none w-full h-5 data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-5 data-[orientation=vertical]:h-32',
                    track: 'relative grow rounded-full bg-bg-muted h-1 data-[orientation=vertical]:w-1 data-[orientation=vertical]:h-full',
                    range: 'absolute rounded-full bg-primary-600 h-full data-[orientation=vertical]:w-full',
                    thumb: 'block h-4 w-4 rounded-full border-2 border-primary-600 bg-bg shadow-sm transition-shadow hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                },
            },
            formNumber: {
                classes: {
                    root: 'inline-flex w-fit items-stretch overflow-hidden rounded-md border border-border bg-bg shadow-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500',
                    // `field-sizing: content` lets the input auto-grow to fit
                    // formatted strings (e.g. "$20.05") instead of clipping.
                    // `min-w-16` keeps a sensible floor for empty / short
                    // values; the parent `w-fit` follows along.
                    input: 'min-w-16 [field-sizing:content] bg-transparent border-0 px-3 py-2 text-center text-sm text-fg outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                    decrement: 'inline-flex w-8 items-center justify-center bg-bg-muted text-fg hover:bg-bg-elevated focus-visible:outline-2 focus-visible:outline-primary-500 -outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    increment: 'inline-flex w-8 items-center justify-center bg-bg-muted text-fg hover:bg-bg-elevated focus-visible:outline-2 focus-visible:outline-primary-500 -outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                },
                variants: {
                    size: {
                        xs: {
                            input: 'px-1.5 py-0.5 text-[0.7rem]',
                            decrement: 'w-5 text-[0.7rem]',
                            increment: 'w-5 text-[0.7rem]',
                        },
                        sm: {
                            input: 'px-2 py-1 text-xs',
                            decrement: 'w-6 text-xs',
                            increment: 'w-6 text-xs',
                        },
                        md: { input: '' },
                        lg: {
                            input: 'px-4 py-3 text-base',
                            decrement: 'w-10 text-base',
                            increment: 'w-10 text-base',
                        },
                    },
                    severity: {
                        error: { root: 'border-error-500 focus-within:border-error-500 focus-within:ring-error-500' },
                        warning: { root: 'border-warning-500 focus-within:border-warning-500 focus-within:ring-warning-500' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formTags: {
                classes: {
                    root: 'flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1.5 text-sm shadow-sm cursor-text focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-muted data-[disabled]:opacity-60',
                    item: 'inline-flex items-center gap-1 rounded-full bg-primary-600 px-2 py-0.5 text-xs leading-tight text-on-primary',
                    itemText: 'select-none',
                    itemDelete: 'inline-flex h-4 w-4 items-center justify-center rounded-full bg-transparent text-current hover:bg-black/10',
                    input: 'flex-1 min-w-24 bg-transparent border-0 outline-none text-fg px-0 py-0.5 text-sm',
                },
                variants: {
                    size: {
                        xs: {
                            root: 'px-1! py-0.5!',
                            item: 'px-1! py-px! text-[0.5625rem]!',
                            input: 'text-[0.7rem]!',
                        },
                        sm: {
                            root: 'px-1.5! py-1!',
                            item: 'px-1.5! py-px! text-[0.625rem]!',
                            input: 'text-xs!',
                        },
                        md: { root: '' },
                        lg: {
                            root: 'px-3! py-2! text-base!',
                            item: 'px-2.5! py-1! text-sm!',
                            input: 'text-base!',
                        },
                    },
                    severity: {
                        error: { root: 'border-error-500 focus-within:border-error-500 focus-within:ring-error-500' },
                        warning: { root: 'border-warning-500 focus-within:border-warning-500 focus-within:ring-warning-500' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            button: {
                classes: {
                    // Structural baseline — every visual treatment composes
                    // on top via compound variants below. Focus ring uses the
                    // active color's `-500` shade picked per variant. `gap-2`
                    // (8px) keeps the leading-icon / spinner visually
                    // separated from the label without looking spaced-out.
                    root: 'inline-flex items-center justify-center gap-2 rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
                    leading: 'inline-flex shrink-0 items-center',
                    trailing: 'inline-flex shrink-0 items-center',
                    label: '',
                },
                variants: {
                    size: {
                        xs: { root: 'px-2 py-0.5 text-[0.7rem]' },
                        sm: { root: 'px-2.5 py-1 text-xs' },
                        md: { root: 'px-3 py-1.5 text-sm' },
                        lg: { root: 'px-4 py-2 text-base' },
                    },
                },
                // Full color × variant matrix. The `ButtonColor` type
                // promises six semantic colors and the API contract is
                // that any (variant, color) pair renders correctly — so
                // every cell is filled, even rare ones like
                // `<VCButton variant="soft" color="error" />`. Consumers
                // who want different shades override via the `overrides`
                // layer on `app.use()`.
                compoundVariants: [
                    // solid — colored fill, contrasting text
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'bg-primary-600 text-on-primary hover:bg-primary-700 focus:ring-primary-500' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'bg-neutral-700 text-on-neutral hover:bg-neutral-800 focus:ring-neutral-500' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'bg-success-600 text-on-success hover:bg-success-700 focus:ring-success-500' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'bg-warning-600 text-on-warning hover:bg-warning-700 focus:ring-warning-500' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'bg-error-600 text-on-error hover:bg-error-700 focus:ring-error-500' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'bg-info-600 text-on-info hover:bg-info-700 focus:ring-info-500' } },
                    // soft — tinted bg, colored text
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-100 text-success-700 hover:bg-success-200 focus:ring-success-500 dark:bg-success-900/30 dark:text-success-300 dark:hover:bg-success-900/50' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-100 text-warning-700 hover:bg-warning-200 focus:ring-warning-500 dark:bg-warning-900/30 dark:text-warning-300 dark:hover:bg-warning-900/50' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-error-100 text-error-700 hover:bg-error-200 focus:ring-error-500 dark:bg-error-900/30 dark:text-error-300 dark:hover:bg-error-900/50' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-100 text-info-700 hover:bg-info-200 focus:ring-info-500 dark:bg-info-900/30 dark:text-info-300 dark:hover:bg-info-900/50' } },
                    // outline — colored border, transparent fill
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'border border-primary-600 bg-bg text-primary-700 shadow-none hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/30' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'border border-border bg-bg text-fg shadow-none hover:bg-bg-muted focus:ring-neutral-500' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'border border-success-600 bg-bg text-success-700 shadow-none hover:bg-success-50 focus:ring-success-500 dark:text-success-400 dark:hover:bg-success-900/30' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'border border-warning-600 bg-bg text-warning-700 shadow-none hover:bg-warning-50 focus:ring-warning-500 dark:text-warning-400 dark:hover:bg-warning-900/30' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'border border-error-600 bg-bg text-error-700 shadow-none hover:bg-error-50 focus:ring-error-500 dark:text-error-400 dark:hover:bg-error-900/30' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'border border-info-600 bg-bg text-info-700 shadow-none hover:bg-info-50 focus:ring-info-500 dark:text-info-400 dark:hover:bg-info-900/30' } },
                    // ghost — no border, colored text, hover background
                    { variants: { variant: 'ghost', color: 'primary' }, class: { root: 'bg-transparent text-primary-700 shadow-none hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/30' } },
                    { variants: { variant: 'ghost', color: 'neutral' }, class: { root: 'bg-transparent text-fg shadow-none hover:bg-bg-muted focus:ring-neutral-500' } },
                    { variants: { variant: 'ghost', color: 'success' }, class: { root: 'bg-transparent text-success-700 shadow-none hover:bg-success-50 focus:ring-success-500 dark:text-success-400 dark:hover:bg-success-900/30' } },
                    { variants: { variant: 'ghost', color: 'warning' }, class: { root: 'bg-transparent text-warning-700 shadow-none hover:bg-warning-50 focus:ring-warning-500 dark:text-warning-400 dark:hover:bg-warning-900/30' } },
                    { variants: { variant: 'ghost', color: 'error' }, class: { root: 'bg-transparent text-error-700 shadow-none hover:bg-error-50 focus:ring-error-500 dark:text-error-400 dark:hover:bg-error-900/30' } },
                    { variants: { variant: 'ghost', color: 'info' }, class: { root: 'bg-transparent text-info-700 shadow-none hover:bg-info-50 focus:ring-info-500 dark:text-info-400 dark:hover:bg-info-900/30' } },
                    // link — underlined, no padding, no chrome
                    { variants: { variant: 'link', color: 'primary' }, class: { root: 'bg-transparent p-0 text-primary-700 shadow-none underline underline-offset-4 hover:text-primary-800 focus:ring-primary-500 dark:text-primary-400' } },
                    { variants: { variant: 'link', color: 'neutral' }, class: { root: 'bg-transparent p-0 text-fg shadow-none underline underline-offset-4 hover:text-fg-muted focus:ring-neutral-500' } },
                    { variants: { variant: 'link', color: 'success' }, class: { root: 'bg-transparent p-0 text-success-700 shadow-none underline underline-offset-4 hover:text-success-800 focus:ring-success-500 dark:text-success-400' } },
                    { variants: { variant: 'link', color: 'warning' }, class: { root: 'bg-transparent p-0 text-warning-700 shadow-none underline underline-offset-4 hover:text-warning-800 focus:ring-warning-500 dark:text-warning-400' } },
                    { variants: { variant: 'link', color: 'error' }, class: { root: 'bg-transparent p-0 text-error-700 shadow-none underline underline-offset-4 hover:text-error-800 focus:ring-error-500 dark:text-error-400' } },
                    { variants: { variant: 'link', color: 'info' }, class: { root: 'bg-transparent p-0 text-info-700 shadow-none underline underline-offset-4 hover:text-info-800 focus:ring-info-500 dark:text-info-400' } },
                ],
                defaultVariants: {
                    variant: 'solid',
                    color: 'primary',
                    size: 'md',
                },
            },
            formTextarea: {
                classes: { root: 'block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-bg-muted' },
                variants: {
                    size: {
                        xs: { root: 'px-1.5 py-0.5 text-[0.7rem]' },
                        sm: { root: 'px-2 py-1 text-xs' },
                        md: { root: '' },
                        lg: { root: 'px-4 py-3 text-base' },
                    },
                    severity: {
                        error: { root: 'border-error-500 focus:border-error-500 focus:ring-error-500' },
                        warning: { root: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            validationGroup: {
                classes: { item: 'text-xs text-error-600' },
                // Severity-aware per-message colour. The base class
                // sets `text-error-600` as the no-severity default
                // (back-compat with consumers who used legacy
                // `validationMessages` without a severity). The
                // variant overrides per active severity — `tailwind-merge`
                // dedupes the conflicting `text-*-600` classes (last
                // colour wins).
                variants: {
                    severity: {
                        error: { item: 'text-error-600' },
                        warning: { item: 'text-warning-600' },
                        success: { item: 'text-success-600' },
                    },
                },
            },
            list: {
                classes: {
                    // `relative` anchors `<VCListLoading :overlay>`'s
                    // `absolute inset-0` to the list container itself.
                    // Without it the overlay escapes to the nearest
                    // positioned ancestor (often the viewport).
                    root: 'relative flex flex-col gap-1',
                    // Header / footer chrome — consumer applies these to
                    // their own `<header>` / `<footer>` markup inside the
                    // `<VCList>` default slot. `empty:hidden` collapses
                    // out of layout when no content provided.
                    header: 'flex items-center empty:hidden',
                    footer: 'flex items-center empty:hidden',
                },
                // Density axis controls the gap between items. `compact`
                // suits dense data tables, `normal` is the default,
                // `spacious` reads as breathing room around long-form
                // entries (e.g. activity feeds).
                variants: {
                    density: {
                        compact: { root: 'gap-0' },
                        normal: { root: '' },
                        spacious: { root: 'gap-3' },
                    },
                },
                defaultVariants: { density: 'normal' },
            },
            listBody: { classes: { root: 'm-0 list-none p-0' } },
            // `<VCListItem>` owns the row's flex layout. The `text` slot
            // (consumer's `<span :class="classes.text">`) takes `flex-1
            // min-w-0` so it consumes available space and truncates
            // cleanly. The `actions` slot is positionally unopinionated
            // so N clusters compose naturally.
            listItem: {
                classes: {
                    root: 'flex flex-row items-center gap-2 py-1',
                    text: 'inline-flex min-w-0 flex-1 flex-col',
                    actions: 'inline-flex items-center gap-1',
                },
                variants: {
                    density: {
                        compact: { root: 'py-0.5' },
                        normal: { root: '' },
                        spacious: { root: 'py-3' },
                    },
                    disabled: { true: { root: 'cursor-not-allowed opacity-50' } },
                    active: { true: { root: 'bg-primary-50 text-primary-900 dark:bg-primary-950 dark:text-primary-100' } },
                    selected: { true: { root: 'bg-bg-muted' } },
                },
                defaultVariants: { density: 'normal' },
            },
            listLoading: {
                classes: { root: 'py-2 text-center text-sm text-fg-muted' },
                variants: { overlay: { true: { root: 'absolute inset-0 z-10 flex items-center justify-center bg-bg/75 backdrop-blur-sm' } } },
            },
            // Soft warning "empty / no-more" marker. Dark fill is a low-opacity
            // tint of the mid shade so it harmonizes with any customized dark
            // `--vc-color-bg` rather than staying a glaring light panel (#1662).
            listEmpty: { classes: { root: 'rounded-md border border-warning-200 bg-warning-50 p-2 text-sm text-warning-800 dark:border-warning-800 dark:bg-warning-500/12 dark:text-warning-200' } },
            navigation: {
                classes: {
                    group: 'm-0 flex list-none flex-col p-0',
                    item: 'list-none',
                    itemNested: '',
                    separator: 'my-2 text-xs font-semibold uppercase tracking-wide text-fg-muted',
                    link: 'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-fg no-underline hover:bg-bg-muted',
                    linkRoot: 'font-medium text-fg',
                    linkIcon: 'inline-flex h-4 w-4 shrink-0 items-center justify-center',
                    linkText: 'flex-1 truncate',
                    trigger: 'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-fg no-underline hover:bg-bg-muted',
                    content: 'block pl-3 text-fg',
                    viewport: 'relative block',
                },
                variants: {
                    size: {
                        xs: {
                            link: 'px-1.5 py-0.5 text-[0.7rem]',
                            linkIcon: 'h-2.5 w-2.5',
                            trigger: 'px-1.5 py-0.5 text-[0.7rem]',
                        },
                        sm: {
                            link: 'px-2 py-1 text-xs',
                            linkIcon: 'h-3 w-3',
                            trigger: 'px-2 py-1 text-xs',
                        },
                        md: { link: '' },
                        lg: {
                            link: 'px-4 py-3 text-base',
                            linkIcon: 'h-5 w-5',
                            trigger: 'px-4 py-3 text-base',
                        },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            table: {
                classes: {
                    root: 'w-full border-collapse text-sm text-fg',
                    scrollContainer: 'relative overflow-auto rounded-md border border-border',
                },
                variants: {
                    density: {
                        compact: { root: '[&_td]:py-1 [&_th]:py-1.5' },
                        normal: { root: '[&_td]:py-2 [&_th]:py-2.5' },
                        spacious: { root: '[&_td]:py-3 [&_th]:py-3.5' },
                    },
                    striped: { true: { root: '[&_tbody_tr:nth-child(even)]:bg-bg-muted/40' } },
                    bordered: { true: { root: '[&_td]:border [&_th]:border [&_td]:border-border [&_th]:border-border' } },
                    hover: { true: { root: '[&_tbody_tr:hover]:bg-bg-muted/60' } },
                    stickyHeader: { true: { root: '[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:bg-bg [&_thead_th]:z-10' } },
                },
                defaultVariants: { density: 'normal' },
            },
            tableHeader: { classes: { root: 'border-b border-border bg-bg-muted/30 text-xs uppercase tracking-wide text-fg-muted' } },
            tableBody: { classes: { root: '' } },
            tableFooter: { classes: { root: 'border-t border-border bg-bg-muted/30 font-medium' } },
            tableRow: {
                classes: { root: 'border-b border-border last:border-b-0 transition-colors' },
                variants: {
                    disabled: { true: { root: 'opacity-50 pointer-events-none' } },
                    selected: { true: { root: 'bg-primary-50 dark:bg-primary-950/40' } },
                    focused: { true: { root: 'outline outline-2 outline-ring outline-offset-[-2px]' } },
                    rowVariant: {
                        success: { root: 'bg-success-50 dark:bg-success-950/30' },
                        warning: { root: 'bg-warning-50 dark:bg-warning-950/30' },
                        error: { root: 'bg-error-50 dark:bg-error-950/30' },
                        info: { root: 'bg-info-50 dark:bg-info-950/30' },
                        neutral: { root: 'bg-neutral-50 dark:bg-neutral-900' },
                        primary: { root: 'bg-primary-50 dark:bg-primary-950/30' },
                    },
                },
            },
            tableCell: {
                classes: { root: 'px-3 align-middle' },
                variants: {
                    align: {
                        left: { root: 'text-left' },
                        center: { root: 'text-center' },
                        right: { root: 'text-right' },
                    },
                    stickyColumn: { true: { root: 'sticky left-0 bg-bg z-[1]' } },
                    cellVariant: {
                        success: { root: 'text-success-700 dark:text-success-300' },
                        warning: { root: 'text-warning-700 dark:text-warning-300' },
                        error: { root: 'text-error-700 dark:text-error-300' },
                        info: { root: 'text-info-700 dark:text-info-300' },
                        neutral: { root: 'text-neutral-700 dark:text-neutral-200' },
                        primary: { root: 'text-primary-700 dark:text-primary-300' },
                    },
                },
            },
            tableHeadCell: {
                classes: {
                    root: 'px-3 text-left font-medium',
                    sortIcon: 'ml-1 inline-block text-xs leading-none',
                },
                variants: {
                    align: {
                        left: { root: 'text-left' },
                        center: { root: 'text-center' },
                        right: { root: 'text-right' },
                    },
                    stickyColumn: { true: { root: 'sticky left-0 bg-bg-muted z-[2]' } },
                    sorted: {
                        asc: { root: 'text-fg' },
                        desc: { root: 'text-fg' },
                        none: { root: '' },
                    },
                },
            },
            tableEmpty: {
                classes: { root: '' },
                variants: {
                    filtered: {
                        true: { root: '[&_td]:py-6 [&_td]:text-center [&_td]:text-fg-muted [&_td]:italic' },
                        false: { root: '[&_td]:py-6 [&_td]:text-center [&_td]:text-fg-muted' },
                    },
                },
            },
            tableLoading: {
                classes: {
                    root: '[&_td]:py-6 [&_td]:text-center [&_td]:text-fg-muted',
                    overlay: 'bg-bg/70 backdrop-blur-[1px] text-fg-muted',
                },
            },
            tableSortIndicators: {
                classes: {
                    root: 'flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-bg-muted px-3 py-2 text-xs',
                    label: 'font-semibold text-fg-muted me-1',
                    empty: 'italic text-fg-muted',
                    // The chip is a non-interactive wrapper that
                    // houses two inner buttons (toggle + remove).
                    // Wrapper carries border + background; buttons
                    // inside are borderless to inherit the look.
                    chip: 'inline-flex items-center rounded-full border border-border bg-bg text-fg transition-colors focus-within:border-primary-500',
                    chipToggle: 'inline-flex items-center gap-1.5 bg-transparent border-0 px-2 py-1 rounded-l-full text-fg cursor-pointer hover:bg-primary-50 focus-visible:bg-primary-50 focus-visible:outline-none',
                    chipPosition: 'text-[0.625rem] font-bold text-fg-muted',
                    chipLabel: '',
                    chipArrow: 'font-bold text-primary-600',
                    chipRemove: 'inline-flex h-7 w-6 items-center justify-center bg-transparent border-0 rounded-r-full text-fg-muted cursor-pointer hover:bg-error-100 hover:text-error-600 focus-visible:bg-error-100 focus-visible:text-error-600 focus-visible:outline-none',
                    // addWrapper omitted — Tailwind styles the
                    // <select> directly; no wrapper needed.
                    add: 'rounded-full border border-border bg-bg px-2 py-1 text-fg',
                    clear: 'ms-auto rounded-full border border-transparent bg-transparent px-2.5 py-1 text-fg-muted hover:bg-bg hover:border-border hover:text-fg focus-visible:bg-bg focus-visible:border-border focus-visible:text-fg focus-visible:outline-none',
                },
            },
            pagination: {
                classes: {
                    root: 'inline-flex items-center',
                    item: 'inline-flex',
                    // Structural only — sizing/padding/typography come from the
                    // `size` variant, bg/border/colors come from the `variant`
                    // variant. Keeping concerns split lets consumers pick a
                    // size and a visual treatment independently.
                    link: 'inline-flex items-center justify-center gap-1.5 rounded-md leading-none focus:outline-none focus:ring-1 focus:ring-ring',
                    linkActive: 'border-primary-600! bg-primary-600! text-on-primary! hover:bg-primary-700!',
                    // The component composes `link + ellipsis` onto
                    // PaginationEllipsis so it inherits the box styling
                    // (size, border, bg) from the link slot. These overrides
                    // turn the inherited interactivity off and mute the
                    // text — matching the "non-clickable spacer" semantics.
                    ellipsis: 'pointer-events-none cursor-default text-fg-muted',
                },
                variants: {
                    variant: {
                        // Default — clear edges that read as discrete buttons
                        // on any page bg (including white-on-white surfaces).
                        outline: { link: 'border border-neutral-300 bg-bg text-fg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700' },
                        // Tinted background, no border — for a softer feel
                        // when the surrounding chrome already provides
                        // visual separation.
                        soft: { link: 'border border-transparent bg-bg-muted text-fg hover:bg-bg-elevated' },
                        // Pre-pilot defaults — blends into a non-white page
                        // bg. Available for consumers who liked the old look.
                        ghost: { link: 'border border-border bg-bg text-fg hover:bg-bg-muted' },
                    },
                    size: {
                        xs: { link: 'h-6 min-w-6 px-1.5 text-[0.7rem]' },
                        sm: { link: 'h-7 min-w-7 px-2 text-xs' },
                        md: { link: 'h-8 min-w-8 px-3 text-sm' },
                        lg: { link: 'h-10 min-w-10 px-4 text-base' },
                    },
                },
                defaultVariants: { variant: 'outline', size: 'md' },
            },
            // VCGravatar wraps VCAvatar — sizing comes from the structural
            // `vc-gravatar` class (5rem default, ships with @vuecs/gravatar).
            // The `size` prop only drives the Gravatar URL's `?s=` parameter;
            // override visual size via per-instance `themeClass`.
            gravatar: { classes: { root: 'inline-block overflow-hidden rounded-full' } },
            separator: {
                classes: {
                    // Reka encodes orientation as `data-orientation`; size each
                    // axis off that so the same class drives horizontal +
                    // vertical separators.
                    root: 'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
                },
            },
            tag: {
                classes: {
                    root: 'inline-flex items-center gap-1 rounded-full bg-primary-600 leading-tight text-on-primary',
                    icon: 'inline-flex shrink-0 items-center',
                    remove: 'inline-flex items-center justify-center rounded-full bg-transparent text-current hover:bg-black/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary',
                },
                // Size axis mirrors @vuecs/elements badge so a `<VCTag size="lg">`
                // and `<VCBadge size="lg">` read at the same scale. The `!`
                // suffix is needed because the structural `.vc-tag` rule
                // (`@vuecs/elements/assets/tag.css`) sits unlayered and beats
                // utilities in `@layer utilities` — the suffix promotes each
                // utility above the structural padding/font-size defaults.
                variants: {
                    size: {
                        xs: { root: 'px-1! py-px! text-[0.5625rem]! gap-0.5!', remove: 'h-2.5! w-2.5!' },
                        sm: { root: 'px-1.5! py-px! text-[0.625rem]! gap-0.5!', remove: 'h-3! w-3!' },
                        md: { root: 'px-2! py-0.5! text-xs!', remove: 'h-4! w-4!' },
                        lg: { root: 'px-2.5! py-1! text-sm!', remove: 'h-5! w-5!' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            tags: {
                classes: {
                    root: 'flex flex-wrap items-center gap-1.5',
                    item: '',
                },
                // Gap scales with the chip size so the row reads at a
                // consistent visual rhythm. The Tags component forwards its
                // `size` prop to each <VCTag> child so the chips themselves
                // also resize.
                variants: {
                    size: {
                        xs: { root: 'gap-0.5' },
                        sm: { root: 'gap-1' },
                        md: { root: '' },
                        lg: { root: 'gap-2' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            avatar: {
                classes: {
                    root: 'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-bg-muted text-fg-muted align-middle',
                    image: 'h-full w-full object-cover',
                    fallback: 'inline-flex h-full w-full items-center justify-center font-medium leading-none',
                },
                // Sizing references the structural `vc-avatar-{sm,md,lg}` helpers
                // (defined in @vuecs/elements/assets/avatar.css) — Tailwind
                // utility-class sizing like `h-8 w-8` lives in `@layer utilities`
                // which loses to the unlayered structural `.vc-avatar` rule.
                // `md` is the no-op default — the structural `.vc-avatar` rule
                // already sets the medium size. `vc-avatar-{sm,lg}` helpers
                // override at the structural level (utility classes lose to
                // unlayered structural; see form-checkbox.css rationale).
                variants: {
                    size: {
                        xs: { root: 'vc-avatar-xs', fallback: 'text-[0.625rem]!' },
                        sm: { root: 'vc-avatar-sm', fallback: 'text-xs!' },
                        md: { fallback: 'text-sm!' },
                        lg: { root: 'vc-avatar-lg', fallback: 'text-base!' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            aspectRatio: { classes: { root: 'block w-full' } },
            card: {
                classes: { root: 'rounded-lg' },
                variants: {
                    variant: {
                        outline: { root: 'border border-border bg-bg text-fg' },
                        soft: { root: 'bg-bg-muted text-fg' },
                        elevated: { root: 'border border-border bg-bg text-fg shadow-md' },
                    },
                    interactive: { true: { root: 'transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-bg cursor-pointer' } },
                },
                defaultVariants: { variant: 'outline' },
            },
            cardHeader: {
                classes: { root: 'flex flex-col gap-1 border-b border-border' },
                variants: {
                    padding: {
                        compact: { root: 'px-3 py-2' },
                        normal: { root: 'px-4 py-3' },
                        spacious: { root: 'px-6 py-4' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            cardTitle: { classes: { root: 'text-base font-semibold leading-tight text-fg' } },
            cardDescription: { classes: { root: 'text-sm text-fg-muted' } },
            cardBody: {
                classes: { root: 'text-sm text-fg' },
                variants: {
                    padding: {
                        compact: { root: 'px-3 py-3' },
                        normal: { root: 'px-4 py-4' },
                        spacious: { root: 'px-6 py-6' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            cardFooter: {
                classes: { root: 'flex items-center justify-end gap-2 border-t border-border' },
                variants: {
                    padding: {
                        compact: { root: 'px-3 py-2' },
                        normal: { root: 'px-4 py-3' },
                        spacious: { root: 'px-6 py-4' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            collapse: { classes: { root: '' } },
            collapseTrigger: {
                // Chevron rotation lives in structural CSS
                // (`[data-state="open"] .vc-collapse-chevron`) so themes can
                // skip a `group data-[state=open]:` rewire. Both Tailwind
                // and BS/Bulma get rotate-on-open for free via the
                // `.vc-collapse-chevron` structural class.
                classes: {
                    root: 'inline-flex items-center justify-between gap-2 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
                    chevron: 'h-4 w-4 shrink-0 text-fg-muted',
                },
                variants: {
                    chevron: {
                        auto: { chevron: 'inline-flex' },
                        none: { chevron: 'hidden' },
                    },
                },
                defaultVariants: { chevron: 'auto' },
            },
            // `collapsible-*` keyframes (not `accordion-*`) — they read
            // `--reka-collapsible-content-height` which Reka's
            // CollapsibleContent sets at runtime. Accordion variant would
            // silently fall back to height `auto` (no animation).
            collapseContent: { classes: { root: 'overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up' } },
            alert: {
                classes: {
                    root: 'relative flex items-start gap-3 rounded-md border text-sm',
                    icon: 'inline-flex shrink-0 items-center justify-center mt-0.5',
                    content: 'flex flex-1 flex-col gap-1 min-w-0',
                    closeIcon: 'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-ring',
                    close: 'inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring',
                },
                variants: {
                    size: {
                        xs: { root: 'p-1.5 pr-7 text-[0.7rem]' },
                        sm: { root: 'p-2 pr-8 text-xs' },
                        md: { root: 'p-3 pr-9 text-sm' },
                        lg: { root: 'p-4 pr-10 text-sm' },
                    },
                },
                compoundVariants: [
                    // solid
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'bg-primary-600 text-on-primary border-primary-700' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'bg-neutral-600 text-on-neutral border-neutral-700' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'bg-success-600 text-on-success border-success-700' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'bg-warning-600 text-on-warning border-warning-700' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'bg-error-600 text-on-error border-error-700' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'bg-info-600 text-on-info border-info-700' } },
                    // soft — surface-aware dark fill: a low-opacity tint of the
                    // mid shade (not the opaque deep `-950`) so the actual
                    // `--vc-color-bg` shows through and the panel harmonizes with
                    // any customized dark surface instead of reading muddy (#1662).
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-primary-500/12 dark:text-primary-200 dark:border-primary-800' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-neutral-50 text-fg border-border dark:bg-neutral-500/12' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-50 text-success-800 border-success-200 dark:bg-success-500/12 dark:text-success-200 dark:border-success-800' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-50 text-warning-800 border-warning-200 dark:bg-warning-500/12 dark:text-warning-200 dark:border-warning-800' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-error-50 text-error-800 border-error-200 dark:bg-error-500/12 dark:text-error-200 dark:border-error-800' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-50 text-info-800 border-info-200 dark:bg-info-500/12 dark:text-info-200 dark:border-info-800' } },
                    // outline
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'border-primary-600 text-primary-700 bg-transparent dark:text-primary-200' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'border-border text-fg bg-transparent' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'border-success-600 text-success-700 bg-transparent dark:text-success-200' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'border-warning-600 text-warning-700 bg-transparent dark:text-warning-200' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'border-error-600 text-error-700 bg-transparent dark:text-error-200' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'border-info-600 text-info-700 bg-transparent dark:text-info-200' } },
                ],
                defaultVariants: {
                    variant: 'soft', 
                    color: 'neutral', 
                    size: 'md', 
                },
            },
            alertTitle: { classes: { root: 'font-semibold leading-tight' } },
            alertDescription: { classes: { root: 'leading-snug opacity-90' } },
            badge: {
                classes: { root: 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-tight' },
                // Size variants use the `!` suffix to override the unlayered
                // structural `.vc-badge` padding/font-size defaults — see
                // tag.size above for rationale.
                variants: {
                    size: {
                        xs: { root: 'px-1! py-px! text-[0.5625rem]!' },
                        sm: { root: 'px-1.5! py-px! text-[0.625rem]!' },
                        md: { root: 'px-2! py-0.5! text-xs!' },
                        lg: { root: 'px-2.5! py-1! text-sm!' },
                    },
                },
                // Color × variant matrix for the `solid` / `soft` / `outline`
                // treatments. Mirrors the button matrix so a `<VCBadge color="error" />`
                // and a `<VCButton color="error" variant="soft" />` read as the
                // same visual family.
                compoundVariants: [
                    // solid — colored fill
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'bg-primary-600 text-on-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'bg-neutral-700 text-on-neutral' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'bg-success-600 text-on-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'bg-warning-600 text-on-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'bg-error-600 text-on-error' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'bg-info-600 text-on-info' } },
                    // soft — tinted bg + colored text
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300' } },
                    // outline — colored border, transparent fill
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'border border-primary-600 bg-bg text-primary-700 dark:text-primary-400' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'border border-border bg-bg text-fg' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'border border-success-600 bg-bg text-success-700 dark:text-success-400' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'border border-warning-600 bg-bg text-warning-700 dark:text-warning-400' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'border border-error-600 bg-bg text-error-700 dark:text-error-400' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'border border-info-600 bg-bg text-info-700 dark:text-info-400' } },
                ],
                defaultVariants: {
                    variant: 'soft',
                    color: 'neutral',
                    size: 'md',
                },
            },
            modal: {
                classes: {
                    overlay: 'fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                    content: 'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-bg p-6 text-fg shadow-lg outline-none focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    header: 'flex flex-col gap-1.5',
                    title: 'text-lg font-semibold text-fg',
                    description: 'text-sm text-fg-muted',
                    body: 'flex flex-col gap-2 text-sm text-fg',
                    footer: 'flex flex-row items-center justify-end gap-2',
                    trigger: '',
                    // Generic close trigger — neutral baseline so consumer
                    // classes (`<VCModalClose class="...">`) compose cleanly.
                    // The corner-X pattern lives in `closeIcon` below.
                    close: 'focus:outline-none focus:ring-2 focus:ring-ring',
                    closeIcon: 'absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-ring',
                    back: 'inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-ring',
                },
                // Modal size axis = max-width tier. md (lg) is the default;
                // sm fits compact confirms, lg fits forms, xl fits dashboards.
                variants: {
                    size: {
                        xs: { content: 'max-w-xs p-3 gap-2' },
                        sm: { content: 'max-w-sm p-4 gap-3' },
                        md: { content: '' },
                        lg: { content: 'max-w-2xl' },
                        xl: { content: 'max-w-4xl' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            popover: {
                classes: {
                    trigger: '',
                    content: 'z-50 w-72 rounded-md border border-border bg-bg p-4 text-sm text-fg shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    arrow: 'fill-bg',
                    // Generic close trigger — neutral baseline so consumer
                    // classes compose cleanly. Corner-X lives in `closeIcon`.
                    close: 'focus:outline-none focus:ring-2 focus:ring-ring',
                    closeIcon: 'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-ring',
                },
                variants: {
                    size: {
                        xs: { content: 'w-48 p-2 text-[0.7rem]' },
                        sm: { content: 'w-56 p-3 text-xs' },
                        md: { content: '' },
                        lg: { content: 'w-96 p-5 text-base' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            hoverCard: {
                classes: {
                    trigger: '',
                    content: 'z-50 w-64 rounded-md border border-border bg-bg p-4 text-sm text-fg shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    arrow: 'fill-bg',
                },
                variants: {
                    size: {
                        xs: { content: 'w-40 p-2 text-[0.7rem]' },
                        sm: { content: 'w-48 p-3 text-xs' },
                        md: { content: '' },
                        lg: { content: 'w-80 p-5 text-base' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            stepper: {
                classes: {
                    root: 'flex items-center gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
                    // `group` scopes the indicator's `group-data-[state=active]:`
                    // / `group-data-[state=completed]:` variants. Without it,
                    // every step renders identical (the variant prefix has
                    // nothing to anchor to and never matches).
                    item: 'group flex flex-1 items-center gap-2 data-[orientation=vertical]:flex-row',
                    // The trigger is a circle that swaps colors based on the
                    // step's `data-state` (active / completed / inactive). It
                    // also receives `data-disabled` from Reka when the linear
                    // option blocks navigation; muted styling reads as
                    // "currently unreachable".
                    trigger: 'inline-flex shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
                    // Active + completed both light up primary so the
                    // "where you've been" trail reads as one continuous
                    // progression. Completed-as-success made the row
                    // visually noisy and broke the linear-progress metaphor.
                    indicator: 'inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg text-sm font-semibold text-fg-muted group-data-[state=active]:border-primary-600 group-data-[state=active]:bg-primary-600 group-data-[state=active]:text-on-primary group-data-[state=completed]:border-primary-600 group-data-[state=completed]:bg-primary-600 group-data-[state=completed]:text-on-primary',
                    title: 'text-sm font-medium text-fg',
                    description: 'text-xs text-fg-muted',
                    separator: 'h-px flex-1 shrink bg-border data-[state=completed]:bg-primary-600 data-[orientation=vertical]:h-8 data-[orientation=vertical]:w-px',
                },
                // Indicator sizing references the structural
                // `vc-stepper-indicator-{sm,lg}` helpers (defined in
                // @vuecs/navigation/assets/index.css). Title / description
                // font-sizes use the `!` suffix to override base structural
                // text-size defaults set on neighboring elements.
                variants: {
                    size: {
                        xs: {
                            indicator: 'vc-stepper-indicator-xs',
                            title: 'text-[0.7rem]!',
                            description: 'text-[0.5625rem]!',
                        },
                        sm: {
                            indicator: 'vc-stepper-indicator-sm',
                            title: 'text-xs!',
                            description: 'text-[0.625rem]!',
                        },
                        md: { indicator: '' },
                        lg: {
                            indicator: 'vc-stepper-indicator-lg',
                            title: 'text-base!',
                            description: 'text-sm!',
                        },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            toastViewport: {
                // Fixed-position viewport. Each position variant pins the
                // viewport against one viewport corner / center. Stack
                // direction is bottom-up for `bottom-*` and top-down for
                // `top-*` so the most recent toast is always closest to
                // the user's pointer.
                classes: { root: 'fixed z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-4 list-none m-0 pointer-events-none [&>*]:pointer-events-auto outline-none' },
                variants: {
                    position: {
                        'top-left': { root: 'top-0 left-0' },
                        'top-right': { root: 'top-0 right-0' },
                        'top-center': { root: 'top-0 left-1/2 -translate-x-1/2' },
                        'bottom-left': { root: 'bottom-0 left-0 flex-col-reverse' },
                        'bottom-right': { root: 'bottom-0 right-0 flex-col-reverse' },
                        'bottom-center': { root: 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse' },
                    },
                },
                defaultVariants: { position: 'top-right' },
            },
            toast: {
                classes: {
                    root: 'relative pointer-events-auto flex w-full items-start gap-3 overflow-hidden rounded-md border border-border bg-bg p-4 pr-8 text-sm text-fg shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--reka-toast-swipe-end-x)] data-[swipe=end]:animate-out data-[swipe=end]:fade-out-80',
                    body: 'flex flex-col gap-1 flex-1 min-w-0',
                    close: 'inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium text-fg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-ring',
                    closeIcon: 'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-ring',
                },
                // Color × variant matrix mirrors `<VCBadge>`'s.
                compoundVariants: [
                    // solid
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'bg-primary-600 text-on-primary border-primary-700' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'bg-neutral-700 text-on-neutral border-neutral-800' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'bg-success-600 text-on-success border-success-700' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'bg-warning-600 text-on-warning border-warning-700' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'bg-error-600 text-on-error border-error-700' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'bg-info-600 text-on-info border-info-700' } },
                    // soft — tinted bg + colored text
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-50 text-primary-900 border-primary-200 dark:bg-primary-950/30 dark:text-primary-200 dark:border-primary-900' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-bg-muted text-fg border-border' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-50 text-success-900 border-success-200 dark:bg-success-950/30 dark:text-success-200 dark:border-success-900' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-50 text-warning-900 border-warning-200 dark:bg-warning-950/30 dark:text-warning-200 dark:border-warning-900' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-error-50 text-error-900 border-error-200 dark:bg-error-950/30 dark:text-error-200 dark:border-error-900' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-50 text-info-900 border-info-200 dark:bg-info-950/30 dark:text-info-200 dark:border-info-900' } },
                    // outline — colored border, transparent fill
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'border-primary-600 bg-bg text-primary-700 dark:text-primary-300' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'border-border bg-bg text-fg' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'border-success-600 bg-bg text-success-700 dark:text-success-300' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'border-warning-600 bg-bg text-warning-700 dark:text-warning-300' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'border-error-600 bg-bg text-error-700 dark:text-error-300' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'border-info-600 bg-bg text-info-700 dark:text-info-300' } },
                ],
                defaultVariants: { variant: 'soft', color: 'neutral' },
            },
            toastTitle: { classes: { root: 'text-sm font-semibold leading-tight' } },
            toastDescription: { classes: { root: 'text-sm leading-snug opacity-90' } },
            toastAction: { classes: { root: 'inline-flex items-center justify-center rounded-md border border-current px-2 py-1 text-xs font-medium hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-ring shrink-0' } },
            tooltip: {
                classes: {
                    trigger: '',
                    content: 'z-50 overflow-hidden rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-on-neutral shadow-md data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95 dark:bg-neutral-50 dark:text-neutral-900',
                    arrow: 'fill-neutral-900 dark:fill-neutral-50',
                },
                variants: {
                    size: {
                        xs: { content: 'px-1.5 py-0.5 text-[0.5625rem]' },
                        sm: { content: 'px-2 py-1 text-[0.625rem]' },
                        md: { content: '' },
                        lg: { content: 'px-4 py-2 text-sm' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            dropdownMenu: {
                classes: {
                    trigger: '',
                    content: 'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg p-1 text-sm text-fg shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    item: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    checkboxItem: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-7 pr-2 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    radioItem: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-7 pr-2 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    radioGroup: '',
                    itemIndicator: 'absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center',
                    label: 'px-2 py-1.5 text-xs font-semibold text-fg-muted',
                    separator: '-mx-1 my-1 h-px bg-border',
                    group: '',
                    subTrigger: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-bg-muted data-[state=open]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    subContent: 'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg p-1 text-sm text-fg shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    arrow: 'fill-bg',
                },
                variants: {
                    size: {
                        xs: {
                            content: 'min-w-[5rem] text-[0.7rem]',
                            item: 'px-1 py-0.5',
                            subTrigger: 'px-1 py-0.5',
                            subContent: 'min-w-[5rem] text-[0.7rem]',
                        },
                        sm: {
                            content: 'min-w-[6rem] text-xs',
                            item: 'px-1.5 py-1',
                            subTrigger: 'px-1.5 py-1',
                            subContent: 'min-w-[6rem] text-xs',
                        },
                        md: { content: '' },
                        lg: {
                            content: 'min-w-[12rem] text-base',
                            item: 'px-3 py-2',
                            subTrigger: 'px-3 py-2',
                            subContent: 'min-w-[12rem] text-base',
                        },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            contextMenu: {
                classes: {
                    trigger: '',
                    content: 'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg p-1 text-sm text-fg shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    item: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    checkboxItem: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-7 pr-2 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    radioItem: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-7 pr-2 outline-none data-[highlighted]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    radioGroup: '',
                    itemIndicator: 'absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center',
                    label: 'px-2 py-1.5 text-xs font-semibold text-fg-muted',
                    separator: '-mx-1 my-1 h-px bg-border',
                    group: '',
                    subTrigger: 'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-bg-muted data-[state=open]:bg-bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    subContent: 'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg p-1 text-sm text-fg shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                },
                variants: {
                    size: {
                        xs: {
                            content: 'min-w-[5rem] text-[0.7rem]',
                            item: 'px-1 py-0.5',
                            subTrigger: 'px-1 py-0.5',
                            subContent: 'min-w-[5rem] text-[0.7rem]',
                        },
                        sm: {
                            content: 'min-w-[6rem] text-xs',
                            item: 'px-1.5 py-1',
                            subTrigger: 'px-1.5 py-1',
                            subContent: 'min-w-[6rem] text-xs',
                        },
                        md: { content: '' },
                        lg: {
                            content: 'min-w-[12rem] text-base',
                            item: 'px-3 py-2',
                            subTrigger: 'px-3 py-2',
                            subContent: 'min-w-[12rem] text-base',
                        },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            placeholder: {
                // Tailwind 4 ships `animate-pulse` for the glow
                // pattern. The wave variant inherits the default
                // (`vc-placeholder-wave`), which composes the
                // shipped mask-based gradient sweep from
                // `@vuecs/placeholder/assets/index.css`.
                classes: {
                    root: 'bg-bg-muted text-fg-muted',
                    glow: 'animate-pulse',
                },
            },
            tablePlaceholder: {
                classes: {
                    root: 'w-full table-fixed border-collapse',
                    header: 'border-b border-border',
                    body: '',
                    footer: 'border-t border-border',
                    row: '[&>*]:py-2 [&>*]:px-3',
                    cell: '',
                },
            },
            cardPlaceholder: {
                classes: {
                    root: 'flex flex-col gap-2 rounded-md border border-border bg-bg p-4 text-fg-muted',
                    image: 'overflow-hidden rounded-md',
                    header: '',
                    body: 'flex flex-col gap-1.5',
                    footer: 'mt-2 flex gap-2',
                },
            },
            placeholderWrapper: { classes: { root: 'relative' } },
            tableRowExpansion: {
                classes: {
                    root: 'bg-bg-muted/40',
                    cell: 'p-0',
                    panel: 'overflow-hidden',
                    panelInner: 'px-4 py-3 text-fg',
                },
            },
            tableExpandTrigger: {
                classes: {
                    root: 'inline-flex items-center justify-center rounded p-1 text-fg-muted hover:bg-bg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    icon: 'h-4 w-4 transition-transform duration-200',
                },
            },
            tableExpandTriggerCell: { classes: { root: 'w-px whitespace-nowrap text-center align-middle' } },
        },
    };
}
