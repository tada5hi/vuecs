import type { Theme } from '@vuecs/core';

export default function bootstrapV5Theme(): Theme {
    return {
        elements: {
            formGroup: {
                classes: {
                    root: 'form-group',
                    label: 'form-label',
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
            formSelect: { classes: { root: 'form-select' } },
            formSubmit: {
                classes: {
                    createButton: 'btn btn-xs btn-success',
                    updateButton: 'btn btn-xs btn-primary',
                },
            },
            formTextarea: { classes: { root: 'form-control' } },
            list: { classes: { root: 'd-flex flex-column gap-1' } },
            listBody: { classes: { root: 'list-unstyled m-0' } },
            listItem: {
                classes: {
                    root: 'd-flex flex-row align-items-center gap-1',
                    actionsWrapper: 'ms-auto',
                },
            },
            listNoMore: { classes: { root: 'alert alert-warning alert-sm' } },
            navigation: {
                classes: {
                    group: 'nav-items',
                    link: 'nav-link',
                },
            },
            pagination: {
                classes: {
                    root: 'd-flex justify-content-center pagination',
                    // Apply Bootstrap's `page-item` / `page-link` so Bootstrap
                    // CSS picks up the joined-button styling (border, hover,
                    // disabled state, focus ring). Active state uses
                    // Bootstrap's own `.active.page-link` rules; we merge
                    // `active` into linkActive below.
                    item: 'page-item',
                    link: 'page-link',
                    linkActive: 'active',
                    // Wrapper composes `link + ellipsis` onto PaginationEllipsis
                    // so it inherits the page-link box. Disable interactivity.
                    ellipsis: 'pe-none text-muted',
                },
                variants: {
                    // Bootstrap pagination is a single visual style. We
                    // expose the same variant catalog as the Tailwind theme
                    // for API parity; soft / ghost are minor tweaks rather
                    // than a different visual treatment.
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
