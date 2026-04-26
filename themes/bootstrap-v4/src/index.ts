import type { Theme } from '@vuecs/core';

export default function bootstrapV4Theme(): Theme {
    return {
        elements: {
            formGroup: {
                classes: {
                    root: 'form-group',
                    validationError: 'form-group-error',
                    validationWarning: 'form-group-warning',
                },
            },
            formInput: {
                classes: {
                    root: 'form-control',
                    group: 'input-group',
                    groupAppend: 'input-group-text',
                    groupPrepend: 'input-group-text',
                },
            },
            formInputCheckbox: {
                classes: {
                    root: 'form-check-input',
                    label: 'form-check-label',
                    group: 'form-check',
                },
            },
            formSelect: { classes: { root: 'form-control' } },
            button: {
                classes: { root: 'btn' },
                variants: {
                    size: {
                        sm: { root: 'btn-sm' },
                        md: { root: '' },
                        lg: { root: 'btn-lg' },
                    },
                },
                // Bootstrap 4 ships `btn-outline-*` for every theme color,
                // so the outline matrix is complete. The non-solid filled
                // variants (`soft`, `ghost`, `link`) have no native Bootstrap
                // 4 equivalents — `bg-opacity-*` was added in v5 — so we
                // approximate with `text-<color>` + `text-decoration-none`
                // to give each (variant, color) pair a distinct visual
                // identity instead of collapsing into another variant.
                compoundVariants: [
                    // solid
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'btn-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'btn-secondary' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'btn-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'btn-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'btn-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'btn-info' } },
                    // outline
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'btn-outline-primary' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'btn-outline-secondary' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'btn-outline-success' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'btn-outline-warning' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'btn-outline-danger' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'btn-outline-info' } },
                    // soft — light bg + colored text. `btn-light` for
                    // neutral; for the others we lean on `bg-light` to
                    // avoid the colored fill `btn-<color>` would apply.
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'btn-light text-primary border-0' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'btn-light' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'btn-light text-success border-0' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'btn-light text-warning border-0' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'btn-light text-danger border-0' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'btn-light text-info border-0' } },
                    // ghost — link color, no underline. Differentiates
                    // from `link` (which keeps the underline).
                    { variants: { variant: 'ghost', color: 'primary' }, class: { root: 'btn-link text-decoration-none' } },
                    { variants: { variant: 'ghost', color: 'neutral' }, class: { root: 'btn-link text-decoration-none text-secondary' } },
                    { variants: { variant: 'ghost', color: 'success' }, class: { root: 'btn-link text-decoration-none text-success' } },
                    { variants: { variant: 'ghost', color: 'warning' }, class: { root: 'btn-link text-decoration-none text-warning' } },
                    { variants: { variant: 'ghost', color: 'error' }, class: { root: 'btn-link text-decoration-none text-danger' } },
                    { variants: { variant: 'ghost', color: 'info' }, class: { root: 'btn-link text-decoration-none text-info' } },
                    // link — underline kept, color applied via text-*
                    { variants: { variant: 'link', color: 'primary' }, class: { root: 'btn-link' } },
                    { variants: { variant: 'link', color: 'neutral' }, class: { root: 'btn-link text-secondary' } },
                    { variants: { variant: 'link', color: 'success' }, class: { root: 'btn-link text-success' } },
                    { variants: { variant: 'link', color: 'warning' }, class: { root: 'btn-link text-warning' } },
                    { variants: { variant: 'link', color: 'error' }, class: { root: 'btn-link text-danger' } },
                    { variants: { variant: 'link', color: 'info' }, class: { root: 'btn-link text-info' } },
                ],
                defaultVariants: {
                    variant: 'solid', 
                    color: 'primary', 
                    size: 'md', 
                },
            },
            formTextarea: { classes: { root: 'form-control' } },
            listBody: { classes: { root: 'list-unstyled' } },
            listItem: {
                classes: {
                    root: 'd-flex flex-row align-items-center',
                    icon: 'pr-1',
                    actionsWrapper: 'ml-auto',
                },
            },
            listNoMore: { classes: { root: 'alert alert-warning alert-sm' } },
            pagination: {
                classes: {
                    root: 'd-flex justify-content-center pagination',
                    // Apply Bootstrap's page-item / page-link so Bootstrap 4
                    // CSS handles the joined-button visuals.
                    item: 'page-item',
                    link: 'page-link',
                    linkActive: 'active',
                    // Wrapper composes `link + ellipsis` onto PaginationEllipsis
                    // so it inherits the page-link box. Disable interactivity.
                    ellipsis: 'disabled text-muted',
                },
                variants: {
                    // API parity with the Tailwind + Bootstrap-v5 themes.
                    variant: {
                        outline: { link: '' },
                        soft: { link: 'border-0' },
                        ghost: { link: 'border-0 bg-transparent' },
                    },
                    size: {
                        sm: { root: 'pagination-sm' },
                        md: { root: '' },
                        lg: { root: 'pagination-lg' },
                    },
                },
                defaultVariants: { variant: 'outline', size: 'md' },
            },
        },
    };
}
