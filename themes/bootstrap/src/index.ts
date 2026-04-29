import type { Theme } from '@vuecs/core';

export default function bootstrapTheme(): Theme {
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
            // Reka renders the checkbox / radio / switch as `<button role="…">`,
            // not native `<input type="…">`. Bootstrap's `.form-check-input`
            // selector targets inputs only, so we don't apply it. Instead we
            // layer Bootstrap shadow + bg utilities on top of the `vc-form-*`
            // structural defaults — but deliberately skip border utilities:
            // bootstrap's `.border-*` utilities carry `!important` and would
            // beat the structural CSS's `data-state="checked"` border-color
            // rule, making checked / unchecked visually identical. Letting
            // structural CSS own border-color preserves the checked-state
            // visual diff (neutral border → primary border on check).
            formCheckbox: {
                classes: {
                    root: 'bg-white shadow-sm',
                    indicator: 'text-white',
                    label: 'form-check-label',
                    group: '',
                },
            },
            formCheckboxGroup: { classes: { root: 'd-flex flex-column gap-2' } },
            formSwitch: {
                classes: {
                    root: 'shadow-sm',
                    thumb: 'bg-white shadow-sm',
                    label: 'form-check-label',
                    group: '',
                },
            },
            formSelect: { classes: { root: 'form-select' } },
            formRadio: {
                classes: {
                    root: 'bg-white shadow-sm',
                    indicator: 'bg-primary',
                    label: 'form-check-label',
                    group: '',
                },
            },
            formRadioGroup: { classes: { root: 'd-flex flex-column gap-2' } },
            // PinInputInput DOES render a real <input>, so `.form-control`
            // would technically apply — but it sets `width: 100%` and
            // collapses every cell into the container's full width. Use
            // bootstrap utilities that mirror form-control's look (border
            // + rounded + shadow + bg) without the width hint; structural
            // CSS keeps the per-cell 2.5rem sizing.
            formPin: {
                classes: {
                    root: 'd-inline-flex align-items-center gap-2',
                    input: 'border border-secondary-subtle bg-white shadow-sm text-center fw-semibold',
                },
            },
            // Reka Slider renders <span> elements, not <input type="range">.
            // Bootstrap's `.form-range` selector is `input[type=range]` so
            // it never applies — drop it. Layer bootstrap utilities for the
            // visual: muted track, primary range fill, white thumb with a
            // bootstrap-blue ring.
            formSlider: {
                classes: {
                    root: '',
                    track: 'bg-secondary-subtle rounded-pill',
                    range: 'bg-primary rounded-pill',
                    thumb: 'rounded-circle bg-white border border-2 border-primary shadow-sm',
                },
            },
            formNumber: {
                classes: {
                    root: 'input-group',
                    input: 'form-control text-center',
                    decrement: 'btn btn-outline-secondary',
                    increment: 'btn btn-outline-secondary',
                },
            },
            formTags: {
                classes: {
                    root: 'form-control d-flex flex-wrap align-items-center gap-2 p-2',
                    item: 'badge rounded-pill text-bg-primary d-inline-flex align-items-center gap-1',
                    itemText: '',
                    // Plain styled button — `.btn-close` was wrong here: it
                    // renders an × via background-image SVG, which combined
                    // with the slot's literal "×" text produced a doubled
                    // delete glyph in every chip.
                    itemDelete: 'd-inline-flex align-items-center justify-content-center bg-transparent border-0 text-white p-0 ms-1 lh-1',
                    input: 'form-control border-0 flex-grow-1 p-0 shadow-none',
                },
            },
            button: {
                // `.btn` is `display: inline-block` by default — gives the
                // leading icon / spinner no gap from the label. Force
                // inline-flex so Bootstrap's `.gap-2` utility takes effect
                // (only affects layout when there are multiple children;
                // single-label buttons render identically).
                classes: { root: 'btn d-inline-flex align-items-center justify-content-center gap-2' },
                variants: {
                    size: {
                        sm: { root: 'btn-sm' },
                        md: { root: '' },
                        lg: { root: 'btn-lg' },
                    },
                },
                // Map each (variant, color) pair onto a Bootstrap button
                // class. `outline` uses Bootstrap's own `btn-outline-*`
                // family; `soft` uses Bootstrap 5.3+'s `*-subtle` /
                // `*-emphasis` token pair (tint bg + dark colored text);
                // `ghost` strips the link underline so it reads as a
                // borderless button rather than a hyperlink.
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
                    // soft — Bootstrap 5.3+'s subtle bg + emphasis text.
                    // Both tokens are bridged onto design-system shades by
                    // theme-bootstrap/assets/index.css.
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-subtle text-primary-emphasis border-0' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-secondary-subtle text-secondary-emphasis border-0' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-subtle text-success-emphasis border-0' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-subtle text-warning-emphasis border-0' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-danger-subtle text-danger-emphasis border-0' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-subtle text-info-emphasis border-0' } },
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
            listHeader: { classes: { root: 'd-flex align-items-center' } },
            listBody: { classes: { root: 'list-unstyled m-0' } },
            listItem: {
                classes: {
                    root: 'd-flex flex-row align-items-center gap-1',
                    textWrapper: 'd-inline-flex flex-column',
                    actionsWrapper: 'ms-auto d-inline-flex align-items-center gap-1',
                    actionsExtraWrapper: 'd-inline-flex align-items-center gap-1',
                },
            },
            listFooter: { classes: { root: 'd-flex align-items-center' } },
            listLoading: { classes: { root: 'py-2 text-center text-muted small' } },
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
            // Bootstrap's chrome (border, padding, typography) plus enter+exit
            // animations via vuecs's dual-state helpers from @vuecs/design's
            // animations.css (`vc-overlay-anim`, `vc-overlay-fade-anim`,
            // `vc-tooltip-anim`). These helpers package the per-state gating
            // into a single class because BS5 theme strings can't carry the
            // `data-[state=]:` attribute-selector prefix that theme-tailwind
            // uses. Reka's Presence (already wrapping every *Content
            // primitive) keeps the element mounted until the exit animation
            // finishes.
            modal: {
                classes: {
                    overlay: 'modal-backdrop fade show vc-overlay-fade-anim',
                    content: 'modal-content position-fixed top-50 start-50 translate-middle shadow vc-overlay-anim',
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
                    content: 'popover bs-popover-auto show vc-overlay-anim',
                    arrow: 'popover-arrow',
                    close: 'btn-close position-absolute top-0 end-0 m-1',
                },
            },
            tooltip: {
                classes: {
                    trigger: '',
                    content: 'tooltip bs-tooltip-auto show tooltip-inner vc-tooltip-anim',
                    arrow: 'tooltip-arrow',
                },
            },
            dropdownMenu: {
                classes: {
                    trigger: '',
                    content: 'dropdown-menu show vc-overlay-anim',
                    item: 'dropdown-item',
                    checkboxItem: 'dropdown-item ps-4',
                    radioItem: 'dropdown-item ps-4',
                    radioGroup: '',
                    itemIndicator: 'position-absolute start-0 ms-2',
                    label: 'dropdown-header',
                    separator: 'dropdown-divider',
                    group: '',
                    subTrigger: 'dropdown-item dropdown-toggle',
                    subContent: 'dropdown-menu show vc-overlay-anim',
                    arrow: '',
                },
            },
            contextMenu: {
                classes: {
                    trigger: '',
                    content: 'dropdown-menu show vc-overlay-anim',
                    item: 'dropdown-item',
                    checkboxItem: 'dropdown-item ps-4',
                    radioItem: 'dropdown-item ps-4',
                    radioGroup: '',
                    itemIndicator: 'position-absolute start-0 ms-2',
                    label: 'dropdown-header',
                    separator: 'dropdown-divider',
                    group: '',
                    subTrigger: 'dropdown-item dropdown-toggle',
                    subContent: 'dropdown-menu show vc-overlay-anim',
                },
            },
        },
    };
}
