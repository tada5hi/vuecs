import type { ClassesMergeFn, Theme } from '@vuecs/core';
import { twMerge } from 'tailwind-merge';

export const merge: ClassesMergeFn = (base, override) => twMerge(base, override);

/**
 * Tailwind theme for vuecs components.
 *
 * Class strings reference **semantic Tailwind colors** that are provided by
 * `@vuecs/design/index.css` — e.g. `bg-primary-600`, `text-fg`,
 * `border-border`. The `@vuecs/design` package wires these names to
 * `--vc-color-*` CSS variables via a Tailwind v4 `@theme` block.
 *
 * Consumers must:
 *   1. Use Tailwind CSS v4 (v3 is not supported).
 *   2. Import `@vuecs/design/index.css` alongside their Tailwind
 *      stylesheet.
 *
 * Reskinning is done by redefining `--vc-color-*` variables (manually or
 * via `setPalette()` from `@vuecs/design`). No theme override needed.
 */
export default function tailwindTheme(): Theme {
    return {
        classesMergeFn: merge,
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
                    group: 'flex items-stretch',
                    groupAppend: 'inline-flex items-center rounded-r-md border border-l-0 border-border bg-bg-muted px-3 text-sm text-fg-muted',
                    groupPrepend: 'inline-flex items-center rounded-l-md border border-r-0 border-border bg-bg-muted px-3 text-sm text-fg-muted',
                },
            },
            formInputCheckbox: {
                classes: {
                    root: '',
                    label: 'text-sm text-fg',
                    group: 'inline-flex items-center gap-2',
                },
                variants: { variant: { switch: { root: 'vc-form-input-checkbox--switch' } } },
                defaultVariants: { variant: 'checkbox' },
            },
            formSelect: { classes: { root: 'block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-bg-muted' } },
            button: {
                classes: {
                    // Structural baseline — every visual treatment composes
                    // on top via compound variants below. Focus ring uses the
                    // active color's `-500` shade picked per variant.
                    root: 'inline-flex items-center justify-center gap-1.5 rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
                    leading: 'inline-flex shrink-0 items-center',
                    trailing: 'inline-flex shrink-0 items-center',
                    label: '',
                },
                variants: {
                    size: {
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
            formTextarea: { classes: { root: 'block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-bg-muted' } },
            validationGroup: { classes: { item: 'text-xs text-error-600' } },
            list: { classes: { root: 'flex flex-col gap-1' } },
            listHeader: { classes: { root: 'flex items-center' } },
            listFooter: { classes: { root: 'flex items-center' } },
            listBody: { classes: { root: 'm-0 list-none p-0' } },
            listItem: {
                classes: {
                    root: 'flex flex-row items-center gap-2 py-1',
                    iconWrapper: 'inline-flex shrink-0 text-fg-muted',
                    textWrapper: 'inline-flex min-w-0 flex-col',
                    actionsWrapper: 'ml-auto inline-flex items-center gap-1',
                    actionsExtraWrapper: 'inline-flex items-center gap-1',
                },
            },
            listLoading: { classes: { root: 'py-2 text-center text-sm text-fg-muted' } },
            listNoMore: { classes: { root: 'rounded-md border border-warning-200 bg-warning-50 p-2 text-sm text-warning-800' } },
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
                    link: 'inline-flex items-center justify-center rounded-md leading-none focus:outline-none focus:ring-1 focus:ring-ring',
                    linkActive: '!border-primary-600 !bg-primary-600 !text-on-primary hover:!bg-primary-700',
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
                        sm: { link: 'h-7 min-w-7 px-2 text-xs' },
                        md: { link: 'h-8 min-w-8 px-3 text-sm' },
                        lg: { link: 'h-10 min-w-10 px-4 text-base' },
                    },
                },
                defaultVariants: { variant: 'outline', size: 'md' },
            },
            gravatar: { classes: { root: 'inline-block overflow-hidden rounded-full' } },
        },
    };
}
