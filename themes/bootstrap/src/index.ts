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
                // Bootstrap's `.form-control-{sm,lg}` modifies padding +
                // font-size on top of `.form-control`. There's no `-md`
                // class — md IS the default.
                //
                // Severity uses Bootstrap's native `.is-invalid` /
                // `.is-warning`-style helpers — but Bootstrap 5 only
                // ships `.is-invalid` + `.is-valid`. We map `warning` →
                // `.is-invalid` (close-enough red) and leave a comment;
                // BS doesn't really have a soft-severity slot. Consumers
                // wanting a true amber state can override.
                variants: {
                    size: {
                        sm: { root: 'form-control-sm', group: 'input-group-sm' },
                        md: { root: '' },
                        lg: { root: 'form-control-lg', group: 'input-group-lg' },
                    },
                    severity: {
                        error: { root: 'is-invalid' },
                        warning: { root: 'is-invalid' },
                    },
                },
                defaultVariants: { size: 'md' },
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
                // Bootstrap doesn't ship sm/lg form-check sizes, so fall
                // back to the structural CSS `vc-form-checkbox-{sm,lg}`
                // helpers (defined in @vuecs/forms styles).
                variants: {
                    size: {
                        sm: { root: 'vc-form-checkbox-sm', label: 'small' },
                        md: { root: '' },
                        lg: { root: 'vc-form-checkbox-lg', label: 'fs-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formCheckboxGroup: { classes: { root: 'd-flex flex-column gap-2' } },
            formSwitch: {
                classes: {
                    root: 'shadow-sm',
                    thumb: 'bg-white shadow-sm',
                    label: 'form-check-label',
                    group: '',
                },
                variants: {
                    size: {
                        sm: { root: 'vc-form-switch-sm', label: 'small' },
                        md: { root: '' },
                        lg: { root: 'vc-form-switch-lg', label: 'fs-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formSelect: {
                classes: {
                    // Bootstrap's `.form-select` ships the chevron via background-image —
                    // it works for native <select> but not for our compound trigger.
                    // We use `.form-control` for the input chrome plus `d-flex` to lay
                    // out the value and our own chevron <span> (rendered by SelectIcon).
                    trigger: 'form-control d-flex align-items-center justify-content-between gap-2 text-start',
                    value: 'text-truncate',
                    icon: 'text-muted',
                    content: 'dropdown-menu show vc-overlay-anim',
                    viewport: '',
                    item: 'dropdown-item ps-4 position-relative',
                    itemIndicator: 'position-absolute start-0 ms-2',
                    group: '',
                    groupLabel: 'dropdown-header',
                    separator: 'dropdown-divider',
                },
                variants: {
                    size: {
                        sm: { trigger: 'form-control-sm' },
                        md: { trigger: '' },
                        lg: { trigger: 'form-control-lg' },
                    },
                    severity: {
                        error: { trigger: 'is-invalid' },
                        warning: { trigger: 'is-invalid' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formSelectSearch: {
                classes: {
                    root: 'position-relative',
                    input: 'form-control',
                    // .show flips Bootstrap's dropdown-menu visibility. The component
                    // toggles its own v-show, so .show is redundant for visibility,
                    // but ensures the menu picks up `display: block` if a consumer
                    // upgrades to a custom toggle that relies on the bootstrap class.
                    content: 'dropdown-menu show w-100 mt-1 overflow-auto',
                    item: 'dropdown-item d-flex flex-column gap-1',
                    // `itemActive` default is already `'active'` — Bootstrap's
                    // dropdown active class — so we inherit it.
                    itemCurrent: 'bg-secondary-subtle',
                    itemDescription: 'small text-muted',
                    selected: 'd-flex flex-wrap gap-1 mt-2',
                    selectedItem: 'badge bg-secondary-subtle text-body border d-inline-flex align-items-center gap-1',
                    selectedItemRemove: 'fw-bold',
                },
                variants: {
                    severity: {
                        error: { input: 'is-invalid' },
                        warning: { input: 'is-invalid' },
                    },
                },
            },
            formRadio: {
                classes: {
                    root: 'bg-white shadow-sm',
                    indicator: 'bg-primary',
                    label: 'form-check-label',
                    group: '',
                },
                variants: {
                    size: {
                        sm: { root: 'vc-form-radio-sm', label: 'small' },
                        md: { root: '' },
                        lg: { root: 'vc-form-radio-lg', label: 'fs-5' },
                    },
                },
                defaultVariants: { size: 'md' },
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
                variants: {
                    size: {
                        sm: {
                            root: 'input-group-sm',
                            input: 'form-control-sm',
                            decrement: 'btn-sm',
                            increment: 'btn-sm',
                        },
                        md: { root: '' },
                        lg: {
                            root: 'input-group-lg',
                            input: 'form-control-lg',
                            decrement: 'btn-lg',
                            increment: 'btn-lg',
                        },
                    },
                    severity: {
                        error: { input: 'is-invalid' },
                        warning: { input: 'is-invalid' },
                    },
                },
                defaultVariants: { size: 'md' },
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
                variants: {
                    size: {
                        sm: { root: 'form-control-sm p-1', item: 'small' },
                        md: { root: '' },
                        lg: { root: 'form-control-lg p-3', item: 'fs-6' },
                    },
                    severity: {
                        error: { root: 'is-invalid' },
                        warning: { root: 'is-invalid' },
                    },
                },
                defaultVariants: { size: 'md' },
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
            formTextarea: {
                classes: { root: 'form-control' },
                variants: {
                    size: {
                        sm: { root: 'form-control-sm' },
                        md: { root: '' },
                        lg: { root: 'form-control-lg' },
                    },
                    severity: {
                        error: { root: 'is-invalid' },
                        warning: { root: 'is-invalid' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            list: {
                classes: {
                    // `position-relative` anchors `<VCListLoading :overlay>`'s
                    // absolute positioning to the list container.
                    root: 'd-flex flex-column gap-1 position-relative',
                    header: 'd-flex align-items-center',
                    footer: 'd-flex align-items-center',
                },
                variants: {
                    density: {
                        compact: { root: 'gap-0' },
                        normal: { root: '' },
                        spacious: { root: 'gap-3' },
                    },
                },
                defaultVariants: { density: 'normal' },
            },
            listBody: { classes: { root: 'list-unstyled m-0' } },
            listItem: {
                classes: {
                    root: 'd-flex flex-row align-items-center gap-1',
                    text: 'd-inline-flex flex-column flex-grow-1 text-truncate',
                    actions: 'd-inline-flex align-items-center gap-1',
                },
                variants: {
                    density: {
                        compact: { root: 'py-0' },
                        normal: { root: 'py-1' },
                        spacious: { root: 'py-3' },
                    },
                    disabled: { true: { root: 'opacity-50 pe-none' } },
                    active: { true: { root: 'bg-primary-subtle text-primary-emphasis' } },
                    selected: { true: { root: 'bg-body-secondary' } },
                },
                defaultVariants: { density: 'normal' },
            },
            listLoading: {
                classes: { root: 'py-2 text-center text-muted small' },
                // Translucent veil (`bg-body bg-opacity-75`) so underlying
                // rows stay partly visible during refresh — matches the
                // tailwind theme's `bg-bg/75 backdrop-blur-sm`.
                variants: { overlay: { true: { root: 'position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-body bg-opacity-75' } } },
            },
            listEmpty: { classes: { root: 'alert alert-warning small p-2' } },
            navigation: {
                classes: {
                    group: 'nav-items',
                    link: 'nav-link',
                },
                variants: {
                    size: {
                        sm: { link: 'small py-1 px-2' },
                        md: { link: '' },
                        lg: { link: 'fs-6 py-3 px-4' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Reka encodes orientation as `data-orientation`; Bootstrap has
            // `<hr>` styling for horizontal but no built-in vertical rule —
            // the structural CSS does both. We just remove the default
            // margins so consumers control spacing via parent flex gaps.
            separator: { classes: { root: 'm-0' } },
            tag: {
                classes: {
                    // Use `text-bg-primary` so Bootstrap's contrast pair handles
                    // light/dark text-on-bg automatically. `rounded-pill` matches
                    // the chip aesthetic of Bootstrap badges.
                    root: 'badge rounded-pill text-bg-primary d-inline-flex align-items-center gap-1',
                    icon: 'd-inline-flex align-items-center',
                    // Deliberately NOT `.btn`: `.btn` sets an absolute
                    // `font-size: 1rem` which overrides the badge's
                    // inherited `0.75em`, stretching the line-box and
                    // making removable tags taller than non-removable
                    // ones. Plain utilities + `.focus-ring` keep
                    // keyboard-focus styling without leaking the .btn
                    // sizing into the chip.
                    remove: 'focus-ring p-0 d-inline-flex align-items-center justify-content-center bg-transparent border-0 text-white lh-1',
                },
                variants: {
                    size: {
                        sm: { root: 'small px-2 py-1' },
                        md: { root: '' },
                        lg: { root: 'fs-6 px-3 py-2' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            tags: {
                classes: {
                    root: 'd-flex flex-wrap align-items-center gap-2',
                    item: '',
                },
                variants: {
                    size: {
                        sm: { root: 'gap-1' },
                        md: { root: '' },
                        lg: { root: 'gap-3' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            avatar: {
                classes: {
                    root: 'd-inline-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-secondary-subtle text-secondary-emphasis',
                    image: 'w-100 h-100 object-fit-cover',
                    fallback: 'd-inline-flex align-items-center justify-content-center w-100 h-100 fw-medium small lh-1',
                },
                // Bootstrap doesn't ship h-8/h-10/h-14 utilities. `md` is
                // the no-op default — the structural `.vc-avatar` rule
                // already sets the medium size. `vc-avatar-{sm,lg}` are
                // shipped in @vuecs/elements/assets/avatar.css.
                variants: {
                    size: {
                        sm: { root: 'vc-avatar-sm' },
                        md: { root: '' },
                        lg: { root: 'vc-avatar-lg' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            aspectRatio: { classes: { root: 'd-block w-100' } },
            // VCGravatar wraps VCAvatar — sizing comes from the structural
            // `vc-gravatar` class (5rem default, ships with @vuecs/gravatar).
            // Theme adds bootstrap aesthetics; override visual size via
            // per-instance `themeClass`.
            gravatar: { classes: { root: 'rounded-circle overflow-hidden d-inline-block' } },
            card: {
                // Bootstrap `.card` brings the border + radius + bg-body.
                // Theme bridge (`assets/index.css`) maps `--bs-card-*` onto
                // `--vc-color-*` so runtime palette switches propagate.
                classes: { root: 'card' },
                variants: {
                    variant: {
                        // Bootstrap's default `.card` is already the outline look.
                        outline: { root: '' },
                        // Soft = subtle muted bg; we drop the border for visual lift.
                        soft: { root: 'bg-body-tertiary border-0' },
                        // Elevated = drop a shadow on the default `.card`.
                        elevated: { root: 'shadow' },
                    },
                    interactive: { true: { root: 'shadow-sm' } },
                },
                defaultVariants: { variant: 'outline' },
            },
            cardHeader: {
                classes: { root: 'card-header' },
                variants: {
                    padding: {
                        compact: { root: 'py-2 px-3' },
                        normal: { root: '' },
                        spacious: { root: 'py-3 px-4' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            cardTitle: { classes: { root: 'card-title mb-0' } },
            cardDescription: { classes: { root: 'card-subtitle text-body-secondary mb-0' } },
            cardBody: {
                classes: { root: 'card-body' },
                variants: {
                    padding: {
                        compact: { root: 'p-2' },
                        normal: { root: '' },
                        spacious: { root: 'p-4' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            cardFooter: {
                classes: { root: 'card-footer d-flex justify-content-end gap-2' },
                variants: {
                    padding: {
                        compact: { root: 'py-2 px-3' },
                        normal: { root: '' },
                        spacious: { root: 'py-3 px-4' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            collapse: { classes: { root: '' } },
            collapseTrigger: {
                classes: {
                    root: 'btn btn-link p-0 d-inline-flex align-items-center gap-2 text-decoration-none',
                    chevron: 'small',
                },
                variants: {
                    chevron: {
                        auto: { chevron: 'd-inline-flex' },
                        none: { chevron: 'd-none' },
                    },
                },
                defaultVariants: { chevron: 'auto' },
            },
            collapseContent: { classes: { root: 'vc-collapse-anim' } },
            alert: {
                // Bootstrap's `.alert` ships padding + border-radius +
                // border-width baseline; per-variant color comes from
                // `.alert-<color>`. Outline variant has no native BS class
                // — bridge CSS adds `.vc-alert.vc-alert-outline.alert-<color>`
                // rules that flip background to transparent.
                classes: {
                    root: 'alert d-flex align-items-start gap-3 mb-0 position-relative pe-5',
                    icon: 'flex-shrink-0 d-inline-flex align-items-center justify-content-center',
                    content: 'flex-grow-1 min-w-0 d-flex flex-column gap-1',
                    closeIcon: 'btn-close position-absolute top-0 end-0 m-2',
                    close: 'btn btn-sm',
                },
                variants: {
                    // Size variants only adjust vertical padding + font-size.
                    // Right-padding (reserved for the absolute corner-close
                    // button) comes from the base `.pe-5` class; overriding
                    // with `px-*` here would let text overlap the close icon
                    // because BS `.px-*` utilities clobber both sides.
                    size: {
                        sm: { root: 'py-2 small' },
                        md: { root: '' },
                        lg: { root: 'py-3 fs-6' },
                    },
                },
                compoundVariants: [
                    // solid — BS `.alert-<color>` uses the subtle/tinted style
                    // which matches our `soft` variant; for `solid` use the
                    // `text-bg-<color>` contrast-aware utility.
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'text-bg-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'text-bg-secondary' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'text-bg-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'text-bg-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'text-bg-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'text-bg-info' } },
                    // soft → BS's native `.alert-<color>`
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'alert-primary' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'alert-secondary' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'alert-success' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'alert-warning' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'alert-danger' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'alert-info' } },
                    // outline — bridge CSS picks these up
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'vc-alert-outline alert-primary' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'vc-alert-outline alert-secondary' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'vc-alert-outline alert-success' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'vc-alert-outline alert-warning' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'vc-alert-outline alert-danger' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'vc-alert-outline alert-info' } },
                ],
                defaultVariants: {
                    variant: 'soft', 
                    color: 'neutral', 
                    size: 'md', 
                },
            },
            alertTitle: { classes: { root: 'fw-semibold mb-1' } },
            alertDescription: { classes: { root: 'mb-0' } },
            badge: {
                classes: { root: 'badge rounded-pill' },
                variants: {
                    size: {
                        sm: { root: 'small px-2 py-1' },
                        md: { root: '' },
                        lg: { root: 'fs-6 px-3 py-2' },
                    },
                },
                // Map (variant, color) onto Bootstrap's `text-bg-*` (solid),
                // `*-subtle` + `*-emphasis` (soft), and `border *-emphasis`
                // (outline) families. Same structure as the button matrix
                // for visual family consistency.
                compoundVariants: [
                    // solid — text-bg-* picks the contrast pair
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'text-bg-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'text-bg-secondary' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'text-bg-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'text-bg-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'text-bg-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'text-bg-info' } },
                    // soft — *-subtle bg + *-emphasis text
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-subtle text-primary-emphasis' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-secondary-subtle text-secondary-emphasis' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-subtle text-success-emphasis' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-subtle text-warning-emphasis' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-danger-subtle text-danger-emphasis' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-subtle text-info-emphasis' } },
                    // outline — border + *-emphasis text on transparent
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'border border-primary text-primary-emphasis' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'border border-secondary text-secondary-emphasis' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'border border-success text-success-emphasis' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'border border-warning text-warning-emphasis' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'border border-danger text-danger-emphasis' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'border border-info text-info-emphasis' } },
                ],
                defaultVariants: {
                    variant: 'soft',
                    color: 'neutral',
                    size: 'md',
                },
            },
            // Bootstrap ships `.table` family natively. Compose those
            // utility classes plus the design-token bridge for
            // dark-mode + runtime palette propagation.
            table: {
                classes: {
                    root: 'table align-middle mb-0',
                    scrollContainer: 'table-responsive border rounded',
                },
                variants: {
                    density: {
                        compact: { root: 'table-sm' },
                        normal: { root: '' },
                        spacious: { root: '' },
                    },
                    striped: { true: { root: 'table-striped' } },
                    bordered: { true: { root: 'table-bordered' } },
                    hover: { true: { root: 'table-hover' } },
                    stickyHeader: { true: { root: 'vc-table-sticky-header' } },
                },
                defaultVariants: { density: 'normal' },
            },
            tableHeader: { classes: { root: 'text-uppercase small text-body-secondary' } },
            tableBody: { classes: { root: '' } },
            tableFooter: { classes: { root: 'fw-medium' } },
            tableRow: {
                variants: {
                    disabled: { true: { root: 'opacity-50 pe-none' } },
                    selected: { true: { root: 'table-active' } },
                    focused: { true: { root: 'vc-table-row-focused' } },
                    rowVariant: {
                        success: { root: 'table-success' },
                        warning: { root: 'table-warning' },
                        error: { root: 'table-danger' },
                        info: { root: 'table-info' },
                        neutral: { root: 'table-secondary' },
                        primary: { root: 'table-primary' },
                    },
                },
            },
            tableCell: {
                variants: {
                    align: {
                        left: { root: 'text-start' },
                        center: { root: 'text-center' },
                        right: { root: 'text-end' },
                    },
                    stickyColumn: { true: { root: 'vc-table-sticky-column' } },
                    cellVariant: {
                        success: { root: 'text-success' },
                        warning: { root: 'text-warning' },
                        error: { root: 'text-danger' },
                        info: { root: 'text-info' },
                        neutral: { root: 'text-body-secondary' },
                        primary: { root: 'text-primary' },
                    },
                },
            },
            tableHeadCell: {
                classes: { sortIcon: 'ms-1 small lh-1' },
                variants: {
                    align: {
                        left: { root: 'text-start' },
                        center: { root: 'text-center' },
                        right: { root: 'text-end' },
                    },
                    stickyColumn: { true: { root: 'vc-table-sticky-column' } },
                    sorted: {
                        asc: { root: 'vc-table-sort-asc' },
                        desc: { root: 'vc-table-sort-desc' },
                        none: { root: '' },
                    },
                },
            },
            tableEmpty: {
                classes: { root: '' },
                variants: {
                    filtered: {
                        true: { root: 'text-center text-body-secondary fst-italic py-4' },
                        false: { root: 'text-center text-body-secondary py-4' },
                    },
                },
            },
            tableLoading: {
                classes: {
                    root: 'text-center text-body-secondary py-4',
                    overlay: 'bg-body bg-opacity-75 text-body-secondary',
                },
            },
            tableSortIndicators: {
                classes: {
                    root: 'd-flex flex-wrap align-items-center gap-2 bg-body-tertiary border rounded px-3 py-2 small',
                    label: 'fw-semibold text-body-secondary me-1',
                    empty: 'fst-italic text-body-secondary',
                    // The chip is now a non-interactive wrapper. We
                    // restyle two real `<button>`s inside (toggle +
                    // remove), each borderless to inherit the chip
                    // pill look as one unit.
                    chip: 'd-inline-flex align-items-center border rounded-pill bg-body',
                    chipToggle: 'btn btn-sm d-inline-flex align-items-center gap-2 border-0 rounded-start-pill rounded-end-0',
                    chipPosition: 'fw-bold text-body-secondary',
                    chipLabel: '',
                    chipArrow: 'fw-bold text-primary',
                    chipRemove: 'btn btn-sm d-inline-flex align-items-center justify-content-center border-0 rounded-end-pill rounded-start-0 px-2 text-body-secondary',
                    // addWrapper omitted — Bootstrap styles the
                    // <select> directly via `.form-select`.
                    add: 'form-select form-select-sm rounded-pill w-auto',
                    clear: 'btn btn-sm btn-link text-body-secondary text-decoration-none ms-auto',
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
                    // `d-inline-flex align-items-center gap-1` layers on top of
                    // Bootstrap's `.page-link` so the icon + label pair (e.g.
                    // <chevron> "Previous") sits on a single baseline with
                    // breathing room between them. `.page-link` is `display: block`
                    // by default, which would otherwise stack them.
                    link: 'page-link d-inline-flex align-items-center gap-1',
                    // `linkActive` default is already `'active'` — Bootstrap's
                    // pagination active class — so we inherit it.
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
                    // Generic close trigger — neutral baseline so consumer
                    // classes (`<VCModalClose class="...">`) compose cleanly.
                    // The corner-X pattern lives in `closeIcon` below.
                    close: '',
                    closeIcon: 'btn-close position-absolute top-0 end-0 m-2',
                    back: 'btn btn-sm btn-link p-1',
                },
                // Bootstrap maps modal sizes via `.modal-sm` / `.modal-lg` /
                // `.modal-xl` on the .modal element. Our content slot stands
                // in for `.modal-dialog` so we apply the size class there.
                variants: {
                    size: {
                        sm: { content: 'modal-sm' },
                        md: { content: '' },
                        lg: { content: 'modal-lg' },
                        xl: { content: 'modal-xl' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            popover: {
                classes: {
                    trigger: '',
                    content: 'popover bs-popover-auto show vc-overlay-anim',
                    arrow: 'popover-arrow',
                    // Generic close trigger — neutral baseline so consumer
                    // classes compose cleanly. Corner-X lives in `closeIcon`.
                    close: '',
                    closeIcon: 'btn-close position-absolute top-0 end-0 m-1',
                },
                // Bootstrap doesn't ship size variants for popovers — adjust
                // font-size + padding via utility classes; the popover
                // shrinks/grows to content, so explicit width tuning is left
                // to consumers via per-instance themeClass.
                variants: {
                    size: {
                        sm: { content: 'small p-2' },
                        md: { content: '' },
                        lg: { content: 'fs-6 p-4' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            hoverCard: {
                classes: {
                    trigger: '',
                    content: 'popover bs-popover-auto show vc-overlay-anim',
                    arrow: 'popover-arrow',
                },
                variants: {
                    size: {
                        sm: { content: 'small p-2' },
                        md: { content: '' },
                        lg: { content: 'fs-6 p-4' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Bootstrap doesn't ship a stepper component — we wire the rough
            // shape with utility classes (gap-* + rounded-circle for the
            // indicator). data-state="completed" / "active" drives bg-* via
            // attribute selectors; without those the indicator stays muted.
            stepper: {
                classes: {
                    root: 'd-flex align-items-center gap-2',
                    item: 'd-flex align-items-center gap-2 flex-grow-1',
                    trigger: 'btn p-0 border-0 bg-transparent d-inline-flex align-items-center justify-content-center',
                    indicator: 'rounded-circle border border-secondary-subtle bg-light text-muted d-inline-flex align-items-center justify-content-center fw-semibold',
                    title: 'small fw-medium',
                    description: 'small text-muted',
                    separator: 'flex-grow-1 border-top border-secondary-subtle',
                },
                // Bootstrap doesn't ship circular size utilities; use the
                // structural `vc-stepper-indicator-{sm,lg}` helpers added to
                // @vuecs/navigation's stepper structural CSS.
                variants: {
                    size: {
                        sm: { indicator: 'vc-stepper-indicator-sm', title: 'small' },
                        md: { indicator: '' },
                        lg: { indicator: 'vc-stepper-indicator-lg', title: 'fs-6' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Bootstrap doesn't ship a Toast viewport / queue idiom (the
            // toasts CSS exists but `.toast-container` is a static
            // layout). We compose `.toast-container` + position helpers
            // for the viewport, and `.toast.show` for each entry so
            // Bootstrap's per-color contrast (`text-bg-*`) propagates.
            // Slide-in/out animations use the `vc-toast-anim` dual-state
            // helper in the bridge CSS (BS theme strings can't carry
            // `data-[state=]:` attribute selectors).
            toastViewport: {
                classes: { root: 'toast-container position-fixed d-flex flex-column p-3 list-unstyled m-0' },
                variants: {
                    position: {
                        'top-left': { root: 'top-0 start-0' },
                        'top-right': { root: 'top-0 end-0' },
                        'top-center': { root: 'top-0 start-50 translate-middle-x' },
                        'bottom-left': { root: 'bottom-0 start-0 flex-column-reverse' },
                        'bottom-right': { root: 'bottom-0 end-0 flex-column-reverse' },
                        'bottom-center': { root: 'bottom-0 start-50 translate-middle-x flex-column-reverse' },
                    },
                },
                defaultVariants: { position: 'top-right' },
            },
            toast: {
                classes: {
                    root: 'toast show vc-toast-anim d-flex align-items-start gap-3 position-relative pe-5',
                    body: 'flex-grow-1 min-w-0',
                    close: 'btn-close-white btn btn-sm align-self-start',
                    closeIcon: 'btn-close position-absolute top-0 end-0 m-2',
                },
                compoundVariants: [
                    // solid via Bootstrap's contrast-aware `text-bg-*`
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'text-bg-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'text-bg-secondary' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'text-bg-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'text-bg-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'text-bg-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'text-bg-info' } },
                    // soft — subtle bg + emphasis text
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'bg-primary-subtle text-primary-emphasis border border-primary-subtle' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'bg-body-tertiary text-body border' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'bg-success-subtle text-success-emphasis border border-success-subtle' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'bg-info-subtle text-info-emphasis border border-info-subtle' } },
                    // outline — border + emphasis text on transparent
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'border border-primary text-primary-emphasis bg-body' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'border text-body bg-body' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'border border-success text-success-emphasis bg-body' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'border border-warning text-warning-emphasis bg-body' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'border border-danger text-danger-emphasis bg-body' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'border border-info text-info-emphasis bg-body' } },
                ],
                defaultVariants: { variant: 'soft', color: 'neutral' },
            },
            toastTitle: { classes: { root: 'toast-header bg-transparent border-0 p-0 mb-1 fw-semibold' } },
            toastDescription: { classes: { root: 'toast-body p-0' } },
            toastAction: { classes: { root: 'btn btn-sm btn-outline-secondary flex-shrink-0' } },
            tooltip: {
                classes: {
                    trigger: '',
                    content: 'tooltip bs-tooltip-auto show tooltip-inner vc-tooltip-anim',
                    arrow: 'tooltip-arrow',
                },
                variants: {
                    size: {
                        sm: { content: 'small px-2 py-1' },
                        md: { content: '' },
                        lg: { content: 'fs-6 px-3 py-2' },
                    },
                },
                defaultVariants: { size: 'md' },
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
                // Bootstrap doesn't ship dropdown size variants. Layer
                // utility classes for spacing/font-size; the structural
                // dropdown chrome stays untouched.
                variants: {
                    size: {
                        sm: {
                            content: 'small p-1', 
                            item: 'py-1 px-2', 
                            subTrigger: 'py-1 px-2', 
                            subContent: 'small p-1', 
                        },
                        md: { content: '' },
                        lg: {
                            content: 'fs-6', 
                            item: 'py-2 px-3', 
                            subTrigger: 'py-2 px-3', 
                            subContent: 'fs-6', 
                        },
                    },
                },
                defaultVariants: { size: 'md' },
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
                variants: {
                    size: {
                        sm: {
                            content: 'small p-1', 
                            item: 'py-1 px-2', 
                            subTrigger: 'py-1 px-2', 
                            subContent: 'small p-1', 
                        },
                        md: { content: '' },
                        lg: {
                            content: 'fs-6', 
                            item: 'py-2 px-3', 
                            subTrigger: 'py-2 px-3', 
                            subContent: 'fs-6', 
                        },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            placeholder: {
                // Bootstrap 5 ships native `.placeholder`,
                // `.placeholder-wave`, and `.placeholder-glow` —
                // map onto those directly.
                classes: {
                    root: 'placeholder',
                    wave: 'placeholder-wave',
                    glow: 'placeholder-glow',
                },
            },
            tablePlaceholder: {
                classes: {
                    root: 'table table-borderless mb-0',
                    header: 'border-bottom',
                    body: '',
                    footer: 'border-top',
                    row: '',
                    cell: '',
                },
            },
            cardPlaceholder: {
                classes: {
                    root: 'card',
                    image: 'ratio ratio-16x9',
                    header: 'card-header',
                    body: 'card-body',
                    footer: 'card-footer d-flex gap-2',
                },
            },
            placeholderWrapper: { classes: { root: 'position-relative' } },
        },
        /*
         * Theme-runtime hook (plan 021): mirror the resolved color mode
         * onto Bootstrap's `data-bs-theme` attribute so framework chrome
         * (navbar, dropdown, form-control, etc.) follows vuecs's `.dark`
         * toggle without a per-app `watchEffect` mirror. Bootstrap 5.3+
         * reads `data-bs-theme` as its own dark-mode source of truth;
         * the bridge `assets/index.css` keeps `--vc-color-*` aligned.
         */
        colorMode: {
            handle(doc, mode) {
                doc.documentElement.setAttribute('data-bs-theme', mode);
            },
        },
    };
}
