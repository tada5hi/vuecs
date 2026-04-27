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
            button: {
                classes: { root: 'btn' },
                variants: {
                    size: {
                        sm: { root: 'btn-sm' },
                        md: { root: '' },
                        lg: { root: 'btn-lg' },
                    },
                },
                // Map each (variant, color) pair onto a Bootstrap button
                // class. `outline` uses Bootstrap's own `btn-outline-*`
                // family; `soft` leverages v5's `bg-opacity-*` utility for
                // a tinted look; `ghost` strips the link underline so it
                // reads as a borderless button rather than a hyperlink.
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
                    // soft — colored fill at 25% opacity + colored text
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'btn-primary bg-opacity-25 text-primary border-0' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'btn-light' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'btn-success bg-opacity-25 text-success border-0' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'btn-warning bg-opacity-25 text-warning border-0' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'btn-danger bg-opacity-25 text-danger border-0' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'btn-info bg-opacity-25 text-info border-0' } },
                    // ghost — borderless / no underline, colored text
                    { variants: { variant: 'ghost', color: 'primary' }, class: { root: 'btn-link text-decoration-none' } },
                    { variants: { variant: 'ghost', color: 'neutral' }, class: { root: 'btn-link text-decoration-none text-secondary' } },
                    { variants: { variant: 'ghost', color: 'success' }, class: { root: 'btn-link text-decoration-none text-success' } },
                    { variants: { variant: 'ghost', color: 'warning' }, class: { root: 'btn-link text-decoration-none text-warning' } },
                    { variants: { variant: 'ghost', color: 'error' }, class: { root: 'btn-link text-decoration-none text-danger' } },
                    { variants: { variant: 'ghost', color: 'info' }, class: { root: 'btn-link text-decoration-none text-info' } },
                    // link — underlined hyperlink-style, color via text-*
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
            // Reka primitives drive open/close via `data-state="open|closed"`,
            // not Bootstrap's `.show` class. The mappings below give consumers
            // Bootstrap's chrome (border, padding, typography) but the
            // show/hide animation lifecycle is Reka's, not Bootstrap's.
            // Consumers wanting the BS fade transition can layer
            // `data-[state=open]:animate-... ` rules on top via overrides.
            modal: {
                classes: {
                    overlay: 'modal-backdrop fade show',
                    content: 'modal-content position-fixed top-50 start-50 translate-middle shadow',
                    header: 'modal-header',
                    title: 'modal-title',
                    description: 'text-muted small',
                    body: 'modal-body',
                    footer: 'modal-footer',
                    trigger: '',
                    close: 'btn-close position-absolute top-0 end-0 m-2',
                    back: 'btn btn-sm btn-link p-1',
                },
            },
            popover: {
                classes: {
                    trigger: '',
                    content: 'popover bs-popover-auto show',
                    arrow: 'popover-arrow',
                    close: 'btn-close position-absolute top-0 end-0 m-1',
                },
            },
            tooltip: {
                classes: {
                    trigger: '',
                    content: 'tooltip bs-tooltip-auto show tooltip-inner',
                    arrow: 'tooltip-arrow',
                },
            },
            dropdownMenu: {
                classes: {
                    trigger: '',
                    content: 'dropdown-menu show',
                    item: 'dropdown-item',
                    checkboxItem: 'dropdown-item ps-4',
                    radioItem: 'dropdown-item ps-4',
                    radioGroup: '',
                    itemIndicator: 'position-absolute start-0 ms-2',
                    label: 'dropdown-header',
                    separator: 'dropdown-divider',
                    group: '',
                    subTrigger: 'dropdown-item dropdown-toggle',
                    subContent: 'dropdown-menu show',
                    arrow: '',
                },
            },
            contextMenu: {
                classes: {
                    trigger: '',
                    content: 'dropdown-menu show',
                    item: 'dropdown-item',
                    checkboxItem: 'dropdown-item ps-4',
                    radioItem: 'dropdown-item ps-4',
                    radioGroup: '',
                    itemIndicator: 'position-absolute start-0 ms-2',
                    label: 'dropdown-header',
                    separator: 'dropdown-divider',
                    group: '',
                    subTrigger: 'dropdown-item dropdown-toggle',
                    subContent: 'dropdown-menu show',
                },
            },
        },
    };
}
