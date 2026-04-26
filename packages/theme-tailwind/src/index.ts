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
            formSubmit: {
                classes: {
                    root: 'inline-flex items-center gap-2',
                    createButton: 'inline-flex items-center gap-1.5 rounded-md bg-success-600 px-3 py-1.5 text-sm font-medium text-on-success shadow-sm hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
                    updateButton: 'inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-on-primary shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
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
