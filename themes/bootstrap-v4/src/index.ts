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
                // API parity with the bootstrap-v5 / tailwind themes. Bootstrap 4
                // doesn't ship `btn-outline-info` / `btn-outline-warning` etc.,
                // so we keep outline coverage to primary + secondary; consumers
                // wanting a full matrix override via `app.use()`.
                compoundVariants: [
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'btn-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'btn-secondary' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'btn-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'btn-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'btn-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'btn-info' } },
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'btn-outline-primary' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'btn-outline-secondary' } },
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'btn-primary' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'btn-light' } },
                    { variants: { variant: 'ghost', color: 'primary' }, class: { root: 'btn-link' } },
                    { variants: { variant: 'ghost', color: 'neutral' }, class: { root: 'btn-link text-secondary' } },
                    { variants: { variant: 'link', color: 'primary' }, class: { root: 'btn-link' } },
                    { variants: { variant: 'link', color: 'neutral' }, class: { root: 'btn-link text-secondary' } },
                ],
                defaultVariants: { variant: 'solid', color: 'primary', size: 'md' },
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
