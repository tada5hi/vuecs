import type { Theme } from '@vuecs/core';
import { COLOR_PALETTES } from '@vuecs/design';
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
 * Will be removed in the next major version of `@vuecs/theme-bulma`.
 */
export { useColorPalette } from '@vuecs/design';
/** @deprecated Import from `@vuecs/design` instead. */
export type { UseColorPaletteOptions, UseColorPaletteReturn } from '@vuecs/design';
/** @deprecated Import from `@vuecs/design` instead — the canonical `ColorPaletteConfig` lives there since plan 026. */
export type { ColorPaletteConfig } from '@vuecs/design';
export type { Hsl } from './types';

/**
 * Bulma theme for vuecs components.
 *
 * Targets Bulma 1.0+ (CSS-variable-based theming). The companion
 * `assets/index.css` bridges `--bulma-*` onto `--vc-color-*` so palette
 * switches propagate to native Bulma elements alongside vuecs ones.
 *
 * Two notable mapping decisions vs. the Bootstrap theme:
 *   - **`ghost` / `link` variants are reversed.** Bulma's `is-ghost`
 *     ships an underlined hyperlink-style button (matching our `link`);
 *     Bulma's `is-text` ships a borderless transparent button
 *     (matching our `ghost`). The mapping here looks inverted at a
 *     glance, but it's the natural reading once you know Bulma's
 *     vocabulary.
 *   - **DropdownMenu / FormSelect content uses `.dropdown-content`,
 *     not `.dropdown-menu`.** Bulma gates `.dropdown-menu` visibility
 *     on the parent `.dropdown.is-active` wrapper. Reka renders the
 *     content via portal — there is no parent — so we apply
 *     `.dropdown-content` (the inner box-styled element) directly,
 *     which is unconditionally visible.
 */
export default function bulmaTheme(): Theme {
    return {
        elements: {
            formGroup: {
                classes: {
                    root: 'field',
                    label: 'label',
                    hint: 'help',
                    validationError: 'help is-danger',
                    validationWarning: 'help is-warning',
                },
            },
            formInput: {
                classes: {
                    root: 'input',
                    group: 'field has-addons',
                    groupAppend: 'control',
                    groupPrepend: 'control',
                },
                // Bulma's `.input` size modifiers are `is-small` / `is-medium` /
                // `is-large`. `md` is the unmodified default.
                //
                // Severity uses Bulma's native `.is-danger` / `.is-warning`
                // input states — both paint the border + focus shadow in
                // the matching variant color (`error` → red, `warning` →
                // amber). Bulma already styles these as a closed set, no
                // gap-fill needed.
                variants: {
                    size: {
                        xs: { root: 'is-small vc-size-xs' },
                        sm: { root: 'is-small' },
                        md: { root: '' },
                        lg: { root: 'is-large' },
                    },
                    severity: {
                        error: { root: 'is-danger' },
                        warning: { root: 'is-warning' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formTextarea: {
                classes: { root: 'textarea' },
                variants: {
                    size: {
                        xs: { root: 'is-small vc-size-xs' },
                        sm: { root: 'is-small' },
                        md: { root: '' },
                        lg: { root: 'is-large' },
                    },
                    severity: {
                        error: { root: 'is-danger' },
                        warning: { root: 'is-warning' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Reka renders the checkbox / radio / switch as `<button role="…">`,
            // not native `<input>`. Bulma's `.checkbox` / `.radio` / `.switch`
            // selectors target inputs, so they don't apply. Lean entirely on
            // the structural `vc-form-*` classes from @vuecs/forms (shape +
            // border + sizing) and let the bridge CSS paint the
            // `data-state="checked"` colors.
            formCheckbox: {
                classes: {
                    // Bulma utility chrome layered on top of the structural
                    // `vc-form-checkbox` rule. We deliberately omit Bulma's
                    // border utilities — they would beat the structural
                    // `data-state="checked"` border-color rule and flatten
                    // the checked-state visual diff.
                    root: 'has-background-white',
                    indicator: 'has-text-white',
                    label: '',
                    group: 'is-inline-flex is-align-items-center',
                },
                variants: {
                    size: {
                        xs: { root: 'vc-form-checkbox-xs', label: 'vc-fs-xs' },
                        sm: { root: 'vc-form-checkbox-sm', label: 'is-size-7' },
                        md: { root: '' },
                        lg: { root: 'vc-form-checkbox-lg', label: 'is-size-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Bulma 1.0 doesn't ship gap utilities; use `mr-2` on the items
            // via the wrapper. The structural `vc-form-checkbox-group` rule
            // owns the flex direction.
            formCheckboxGroup: { classes: { root: 'is-flex is-flex-direction-column' } },
            formSwitch: {
                classes: {
                    root: '',
                    thumb: 'has-background-white',
                    label: '',
                    group: 'is-inline-flex is-align-items-center',
                },
                variants: {
                    size: {
                        xs: { root: 'vc-form-switch-xs', label: 'vc-fs-xs' },
                        sm: { root: 'vc-form-switch-sm', label: 'is-size-7' },
                        md: { root: '' },
                        lg: { root: 'vc-form-switch-lg', label: 'is-size-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formRadio: {
                classes: {
                    root: 'has-background-white',
                    indicator: '',
                    label: '',
                    group: 'is-inline-flex is-align-items-center',
                },
                variants: {
                    size: {
                        xs: { root: 'vc-form-radio-xs', label: 'vc-fs-xs' },
                        sm: { root: 'vc-form-radio-sm', label: 'is-size-7' },
                        md: { root: '' },
                        lg: { root: 'vc-form-radio-lg', label: 'is-size-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formRadioGroup: { classes: { root: 'is-flex is-flex-direction-column' } },
            // FormSelect (Reka-backed compound) — we deliberately don't use
            // Bulma's `.select` because that styles a `<div>` wrapper around a
            // real `<select>`. Build the trigger from `.input` + flex
            // utilities. Content uses `.dropdown-content` (NOT `.dropdown-menu`,
            // which is parent-gated — see header comment).
            formSelect: {
                classes: {
                    trigger: 'input is-flex is-align-items-center is-justify-content-space-between',
                    value: 'is-flex-grow-1',
                    icon: 'has-text-grey',
                    content: 'dropdown-content',
                    viewport: 'p-1',
                    item: 'dropdown-item',
                    itemIndicator: '',
                    group: '',
                    groupLabel: 'has-text-weight-semibold is-size-7 has-text-grey',
                    separator: 'dropdown-divider',
                },
                variants: {
                    size: {
                        xs: { trigger: 'is-small vc-size-xs' },
                        sm: { trigger: 'is-small' },
                        md: { trigger: '' },
                        lg: { trigger: 'is-large' },
                    },
                    severity: {
                        error: { trigger: 'is-danger' },
                        warning: { trigger: 'is-warning' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formSelectSearch: {
                classes: {
                    root: 'is-relative',
                    input: 'input',
                    // No parent `.dropdown.is-active` to gate `.dropdown-menu`,
                    // so apply `.dropdown-content` directly.
                    content: 'dropdown-content',
                    item: 'dropdown-item is-flex is-flex-direction-column',
                    itemActive: 'is-active',
                    itemCurrent: 'has-background-light',
                    itemDescription: 'is-size-7 has-text-grey',
                    selected: 'is-flex is-flex-wrap-wrap mt-2',
                    selectedItem: 'tag is-light is-rounded',
                    selectedItemRemove: 'has-text-weight-bold',
                },
                variants: {
                    severity: {
                        error: { input: 'is-danger' },
                        warning: { input: 'is-warning' },
                    },
                },
            },
            // PinInputInput renders a real `<input>`; `.input` would give it
            // `width: 100%` which collapses every cell. Use Bulma utility
            // classes that mirror the input look (border + bg + shadow)
            // without the width hint. Structural CSS keeps per-cell sizing.
            formPin: {
                classes: {
                    root: 'is-inline-flex is-align-items-center',
                    input: 'has-background-white has-text-centered has-text-weight-semibold',
                },
            },
            // Reka Slider renders `<span>` elements, not `<input type="range">`.
            // Bulma's `.slider` (extension) targets inputs anyway. Hand-roll
            // the visual via the structural `vc-form-slider-*` classes; bridge
            // CSS paints the primary range fill.
            formSlider: {
                classes: {
                    root: '',
                    track: '',
                    range: '',
                    thumb: '',
                },
            },
            formNumber: {
                classes: {
                    root: 'field has-addons',
                    input: 'input has-text-centered',
                    decrement: 'button',
                    increment: 'button',
                },
                variants: {
                    size: {
                        xs: {
                            input: 'is-small vc-size-xs', 
                            decrement: 'is-small vc-size-xs', 
                            increment: 'is-small vc-size-xs', 
                        },
                        sm: {
                            input: 'is-small',
                            decrement: 'is-small',
                            increment: 'is-small',
                        },
                        md: { input: '' },
                        lg: {
                            input: 'is-large',
                            decrement: 'is-large',
                            increment: 'is-large',
                        },
                    },
                    severity: {
                        error: { input: 'is-danger' },
                        warning: { input: 'is-warning' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            formTags: {
                classes: {
                    root: 'input is-flex is-flex-wrap-wrap is-align-items-center',
                    item: 'tag is-primary is-rounded is-flex is-align-items-center',
                    itemText: '',
                    // Plain styled cross button. Bulma's `.delete` element
                    // injects its own × glyph via CSS pseudo-elements — paired
                    // with the slot's literal "×" text it would double-render.
                    itemDelete: 'is-inline-flex is-align-items-center is-justify-content-center has-background-transparent has-text-white p-0 ml-1',
                    input: 'is-flex-grow-1 has-background-transparent',
                },
                variants: {
                    size: {
                        xs: { root: 'is-small vc-size-xs', item: 'vc-fs-xs' },
                        sm: { root: 'is-small', item: 'is-size-7' },
                        md: { root: '' },
                        lg: { root: 'is-large', item: 'is-size-6' },
                    },
                    severity: {
                        error: { root: 'is-danger' },
                        warning: { root: 'is-warning' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            button: {
                // Bulma 1.x ships `is-gap-*` flex/grid spacing utilities;
                // `is-gap-2` (0.5rem) matches the gap baked into the
                // Tailwind / Bootstrap themes so leading icon / label /
                // trailing icon don't sit flush against each other.
                classes: { root: 'button is-inline-flex is-align-items-center is-justify-content-center is-gap-2' },
                variants: {
                    size: {
                        xs: { root: 'is-small vc-size-xs' },
                        sm: { root: 'is-small' },
                        md: { root: '' },
                        lg: { root: 'is-large' },
                    },
                },
                // Bulma's `.is-light` is the soft variant (tinted bg + colored
                // text). `.is-outlined` swaps to colored border + transparent
                // fill. `.is-text` (vuecs `ghost`) is borderless transparent;
                // `.is-ghost` (vuecs `link`) is anchor-like with underline. We
                // map `neutral` to bare `.button` (Bulma's default grey) for
                // the cleanest look.
                compoundVariants: [
                    // solid
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'is-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: '' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'is-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'is-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'is-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'is-info' } },
                    // soft (= Bulma is-light shade modifier)
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'is-primary is-light' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'is-light' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'is-success is-light' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'is-warning is-light' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'is-danger is-light' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'is-info is-light' } },
                    // outline
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'is-primary is-outlined' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'is-outlined' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'is-success is-outlined' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'is-warning is-outlined' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'is-danger is-outlined' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'is-info is-outlined' } },
                    // ghost — Bulma's `is-text` (borderless transparent)
                    { variants: { variant: 'ghost', color: 'primary' }, class: { root: 'is-text has-text-primary' } },
                    { variants: { variant: 'ghost', color: 'neutral' }, class: { root: 'is-text' } },
                    { variants: { variant: 'ghost', color: 'success' }, class: { root: 'is-text has-text-success' } },
                    { variants: { variant: 'ghost', color: 'warning' }, class: { root: 'is-text has-text-warning' } },
                    { variants: { variant: 'ghost', color: 'error' }, class: { root: 'is-text has-text-danger' } },
                    { variants: { variant: 'ghost', color: 'info' }, class: { root: 'is-text has-text-info' } },
                    // link — Bulma's `is-ghost` (anchor-like, underlined)
                    { variants: { variant: 'link', color: 'primary' }, class: { root: 'is-ghost has-text-primary' } },
                    { variants: { variant: 'link', color: 'neutral' }, class: { root: 'is-ghost' } },
                    { variants: { variant: 'link', color: 'success' }, class: { root: 'is-ghost has-text-success' } },
                    { variants: { variant: 'link', color: 'warning' }, class: { root: 'is-ghost has-text-warning' } },
                    { variants: { variant: 'link', color: 'error' }, class: { root: 'is-ghost has-text-danger' } },
                    { variants: { variant: 'link', color: 'info' }, class: { root: 'is-ghost has-text-info' } },
                ],
                defaultVariants: {
                    variant: 'solid',
                    color: 'primary',
                    size: 'md',
                },
            },
            // Severity-aware per-message colour. Bulma's `.has-text-*`
            // helpers paint the text colour via HSL channel vars; one
            // wins cleanly per message, so the base item carries no
            // colour (messages stay default when no severity is set).
            validationGroup: {
                classes: { item: 'is-size-7' },
                variants: {
                    severity: {
                        error: { item: 'has-text-danger' },
                        warning: { item: 'has-text-warning' },
                        success: { item: 'has-text-success' },
                    },
                },
            },
            list: {
                classes: {
                    // `is-relative` anchors `<VCListLoading :overlay>`'s
                    // `is-overlay` (absolute) positioning to the list
                    // container itself.
                    root: 'is-flex is-flex-direction-column is-relative',
                    header: 'is-flex is-align-items-center',
                    footer: 'is-flex is-align-items-center',
                },
                variants: {
                    density: {
                        compact: { root: '' },
                        normal: { root: '' },
                        spacious: { root: '' },
                    },
                },
                defaultVariants: { density: 'normal' },
            },
            listBody: { classes: { root: 'm-0 p-0' } },
            listItem: {
                classes: {
                    root: 'is-flex is-flex-direction-row is-align-items-center',
                    text: 'is-inline-flex is-flex-direction-column is-flex-grow-1',
                    actions: 'is-inline-flex is-align-items-center',
                },
                variants: {
                    density: {
                        compact: { root: 'py-0' },
                        normal: { root: 'py-1' },
                        spacious: { root: 'py-3' },
                    },
                    disabled: { true: { root: 'has-text-grey-light' } },
                    active: { true: { root: 'has-background-primary-light has-text-primary' } },
                    selected: { true: { root: 'has-background-grey-lighter' } },
                },
                defaultVariants: { density: 'normal' },
            },
            listLoading: {
                classes: { root: 'py-2 has-text-centered has-text-grey is-size-7' },
                variants: { overlay: { true: { root: 'is-overlay is-flex is-align-items-center is-justify-content-center has-background-white-bis' } } },
            },
            // Bulma `.notification.is-warning.is-light` matches the BS theme's
            // `.alert.alert-warning` look.
            listEmpty: { classes: { root: 'notification is-warning is-light is-size-7 p-2' } },
            navigation: {
                classes: {
                    group: 'menu-list',
                    link: '',
                    // The structural `.vc-nav-trigger` resets the native
                    // <button>; Bulma's menu links carry no base class, so the
                    // trigger only needs sizing parity via the size variant.
                    trigger: '',
                    content: 'pl-3',
                },
                variants: {
                    size: {
                        xs: { link: 'vc-fs-xs', trigger: 'vc-fs-xs' },
                        sm: { link: 'is-size-7', trigger: 'is-size-7' },
                        md: { link: '' },
                        lg: { link: 'is-size-6', trigger: 'is-size-6' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Reka encodes orientation as `data-orientation`; Bulma's `<hr>`
            // styling is limited (no built-in vertical rule). Structural CSS
            // does both axes; we just trim default margins so consumers
            // control spacing via parent flex gaps.
            separator: { classes: { root: 'm-0' } },
            tag: {
                classes: {
                    root: 'tag is-primary is-rounded is-flex is-align-items-center',
                    icon: 'is-inline-flex is-align-items-center',
                    // Plain styled cross button (see formTags.itemDelete for
                    // the same rationale — `.delete` injects its own glyph).
                    remove: 'is-inline-flex is-align-items-center is-justify-content-center has-background-transparent has-text-white p-0',
                },
                // Bulma's `.tag` size modifiers are `is-medium` / `is-large`;
                // there is no `is-small` (the default IS the smallest size).
                // Mapping our `sm` to the bare default keeps `.tag` small;
                // `md` lifts to `is-medium` and `lg` to `is-large`.
                variants: {
                    size: {
                        xs: { root: 'vc-fs-xs' },
                        sm: { root: '' },
                        md: { root: 'is-medium' },
                        lg: { root: 'is-large' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            tags: {
                classes: {
                    root: 'tags',
                    item: '',
                },
                variants: {
                    size: {
                        xs: { root: 'vc-size-xs' },
                        sm: { root: '' },
                        md: { root: 'are-medium' },
                        lg: { root: 'are-large' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            avatar: {
                classes: {
                    root: 'is-inline-flex is-align-items-center is-justify-content-center has-background-light has-text-grey-dark',
                    image: 'is-flex-grow-1',
                    fallback: 'is-inline-flex is-align-items-center is-justify-content-center has-text-weight-medium is-size-7',
                },
                // Bulma's `.image is-32x32` family relies on fixed size scales
                // — for our sm/md/lg axis we use the structural
                // `vc-avatar-{sm,lg}` helpers (defined in @vuecs/elements).
                variants: {
                    size: {
                        xs: { root: 'vc-avatar-xs' },
                        sm: { root: 'vc-avatar-sm' },
                        md: { root: '' },
                        lg: { root: 'vc-avatar-lg' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            aspectRatio: { classes: { root: 'is-block' } },
            // VCGravatar wraps VCAvatar — sizing comes from the structural
            // `vc-gravatar` class. Theme adds Bulma aesthetics; override
            // visual size via per-instance `themeClass`.
            gravatar: { classes: { root: 'is-inline-block' } },
            // Bulma's native `.box` is the closest match to a Card. It
            // ships radius + bg + shadow by default. The bridge CSS
            // (`assets/index.css`) wires Bulma's box bg to `--vc-color-bg`
            // so runtime palette / color-mode flips propagate.
            card: {
                classes: { root: 'box' },
                variants: {
                    variant: {
                        // Bulma `.box` already carries a shadow; the
                        // outline variant flattens it and adds a border to
                        // distinguish it from the elevated variant.
                        outline: { root: 'has-shadow-none vc-card-outline' },
                        // Soft = neutral muted background, no shadow. The
                        // `vc-card-soft` helper in the bridge paints
                        // `background-color` from `--vc-color-bg-muted`
                        // so runtime palette / color-mode flips propagate
                        // (Bulma's `.has-background-light` resolves
                        // through the unbridged `--bulma-light-*` channels).
                        soft: { root: 'vc-card-soft has-shadow-none' },
                        // Elevated = keep Bulma's default `.box` shadow.
                        elevated: { root: '' },
                    },
                    interactive: { true: { root: 'vc-card-interactive' } },
                },
                defaultVariants: { variant: 'outline' },
            },
            // Bulma has no card-header / card-body / card-footer ladder
            // (its `.card` is differently structured), so we paint these
            // with utility classes from Bulma's spacing helpers + a couple
            // of vc-* helpers in the bridge for the separator borders.
            //
            // Header + body inherit their structural `vc-card-*` classes
            // from the component default — we only contribute the
            // `padding` variant axis. The footer overrides `root` with a
            // flex-row layout helper because Bulma has no native equivalent
            // for "right-aligned action band".
            cardHeader: {
                variants: {
                    padding: {
                        compact: { root: 'py-2 px-3' },
                        normal: { root: 'py-3 px-4' },
                        spacious: { root: 'py-4 px-5' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            cardTitle: { classes: { root: 'title is-5 mb-0' } },
            cardDescription: { classes: { root: 'subtitle is-6 has-text-grey mb-0' } },
            cardBody: {
                variants: {
                    padding: {
                        compact: { root: 'py-3 px-3' },
                        normal: { root: 'py-4 px-4' },
                        spacious: { root: 'py-5 px-5' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            cardFooter: {
                classes: { root: 'vc-card-footer is-flex is-justify-content-flex-end' },
                variants: {
                    padding: {
                        compact: { root: 'py-2 px-3' },
                        normal: { root: 'py-3 px-4' },
                        spacious: { root: 'py-4 px-5' },
                    },
                },
                defaultVariants: { padding: 'normal' },
            },
            collapse: { classes: { root: '' } },
            collapseTrigger: {
                classes: {
                    root: 'is-inline-flex is-align-items-center button is-text px-0',
                    chevron: 'is-size-7',
                },
                variants: {
                    chevron: {
                        auto: { chevron: 'is-inline-flex' },
                        none: { chevron: 'is-hidden' },
                    },
                },
                defaultVariants: { chevron: 'auto' },
            },
            collapseContent: { classes: { root: 'vc-collapse-anim' } },
            alert: {
                // Bulma's `.notification` is the alert-equivalent. Toast
                // already composes `.notification`, so per-variant `is-*`
                // overrides + `is-light` for `soft` work the same way.
                // Outline variant uses the existing `vc-toast-outline-*`
                // helpers (same color palette, same intent).
                classes: {
                    root: 'notification is-flex is-align-items-flex-start mb-0 is-relative',
                    icon: 'is-flex is-flex-shrink-0 is-align-items-center is-justify-content-center mr-3',
                    content: 'is-flex-grow-1 is-flex is-flex-direction-column',
                    closeIcon: 'delete is-small',
                    close: 'button is-small is-text',
                },
                variants: {
                    // Size variants only adjust font-size. Bulma's
                    // `.notification` already reserves right-padding for the
                    // built-in `.delete` button; overriding with `.p-*` here
                    // would shrink that reserved space and let text overlap
                    // the close icon.
                    size: {
                        xs: { root: 'vc-fs-xs' },
                        sm: { root: 'is-size-7' },
                        md: { root: '' },
                        lg: { root: 'is-size-5' },
                    },
                },
                compoundVariants: [
                    // solid → `.notification.is-<color>`
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'is-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'is-dark' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'is-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'is-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'is-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'is-info' } },
                    // soft → `.notification.is-<color>.is-light`
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'is-primary is-light' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'is-light' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'is-success is-light' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'is-warning is-light' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'is-danger is-light' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'is-info is-light' } },
                    // outline — reuse Toast's bridge helpers
                    // (same color palette + same intent).
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'vc-toast-outline-primary' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'vc-toast-outline-neutral' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'vc-toast-outline-success' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'vc-toast-outline-warning' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'vc-toast-outline-error' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'vc-toast-outline-info' } },
                ],
                defaultVariants: {
                    variant: 'soft', 
                    color: 'neutral', 
                    size: 'md', 
                },
            },
            alertTitle: { classes: { root: 'has-text-weight-semibold mb-1' } },
            alertDescription: { classes: { root: 'mb-0' } },
            // Bulma has NO core `.badge` class. Use `.tag` as the host
            // (consistent with how Bulma docs recommend chip-style badges)
            // plus the same color × variant matrix structure as button.
            // Outline variant has no native Bulma class — bridge CSS adds
            // `.vc-badge.vc-badge-outline.tag.is-<color>` rules.
            badge: {
                classes: { root: 'tag is-rounded vc-badge' },
                variants: {
                    size: {
                        xs: { root: 'vc-fs-xs' },
                        sm: { root: '' },
                        md: { root: 'is-medium' },
                        lg: { root: 'is-large' },
                    },
                },
                compoundVariants: [
                    // solid — `.tag.is-<color>`
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'is-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'is-dark' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'is-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'is-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'is-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'is-info' } },
                    // soft — `.tag.is-<color>.is-light`
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'is-primary is-light' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'is-light' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'is-success is-light' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'is-warning is-light' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'is-danger is-light' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'is-info is-light' } },
                    // outline — gap-fill rule in assets/index.css does the
                    // colored border + transparent fill. The marker class
                    // `vc-badge-outline` carries the per-color rule.
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'vc-badge-outline vc-badge-outline-primary' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'vc-badge-outline vc-badge-outline-neutral' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'vc-badge-outline vc-badge-outline-success' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'vc-badge-outline vc-badge-outline-warning' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'vc-badge-outline vc-badge-outline-error' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'vc-badge-outline vc-badge-outline-info' } },
                ],
                defaultVariants: {
                    variant: 'soft',
                    color: 'neutral',
                    size: 'md',
                },
            },
            // Bulma's `.table` family covers the basic chrome. Variant
            // mappings: `.table.is-striped`, `.is-bordered`, `.is-hoverable`,
            // `.is-narrow` (compact). Sticky-header and per-row variants
            // come from the bridge CSS (`vc-table-*` gap-fill helpers).
            table: {
                classes: { root: 'table is-fullwidth' },
                variants: {
                    density: {
                        compact: { root: 'is-narrow' },
                        normal: { root: '' },
                        spacious: { root: '' },
                    },
                    striped: { true: { root: 'is-striped' } },
                    bordered: { true: { root: 'is-bordered' } },
                    hover: { true: { root: 'is-hoverable' } },
                    stickyHeader: { true: { root: 'vc-table-sticky-header' } },
                },
                defaultVariants: { density: 'normal' },
            },
            tableHeader: { classes: { root: 'is-uppercase has-text-grey is-size-7' } },
            tableBody: { classes: { root: '' } },
            tableFooter: { classes: { root: 'has-text-weight-medium' } },
            tableRow: {
                variants: {
                    disabled: { true: { root: 'vc-table-row-disabled' } },
                    selected: { true: { root: 'is-selected' } },
                    focused: { true: { root: 'vc-table-row-focused' } },
                    rowVariant: {
                        success: { root: 'has-background-success-light' },
                        warning: { root: 'has-background-warning-light' },
                        error: { root: 'has-background-danger-light' },
                        info: { root: 'has-background-info-light' },
                        neutral: { root: 'has-background-light' },
                        primary: { root: 'has-background-primary-light' },
                    },
                },
            },
            tableCell: {
                variants: {
                    align: {
                        left: { root: 'has-text-left' },
                        center: { root: 'has-text-centered' },
                        right: { root: 'has-text-right' },
                    },
                    stickyColumn: { true: { root: 'vc-table-sticky-column' } },
                    cellVariant: {
                        success: { root: 'has-text-success' },
                        warning: { root: 'has-text-warning' },
                        error: { root: 'has-text-danger' },
                        info: { root: 'has-text-info' },
                        neutral: { root: 'has-text-grey' },
                        primary: { root: 'has-text-primary' },
                    },
                },
            },
            tableHeadCell: {
                classes: { sortIcon: 'ml-1 is-size-7' },
                variants: {
                    align: {
                        left: { root: 'has-text-left' },
                        center: { root: 'has-text-centered' },
                        right: { root: 'has-text-right' },
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
                        true: { root: 'has-text-centered has-text-grey is-italic py-5' },
                        false: { root: 'has-text-centered has-text-grey py-5' },
                    },
                },
            },
            tableLoading: {
                classes: {
                    root: 'has-text-centered has-text-grey py-5',
                    overlay: 'vc-table-loading-overlay-bulma',
                },
            },
            tableSortIndicators: {
                classes: {
                    root: 'vc-table-sort-indicators-bulma',
                    label: 'has-text-weight-semibold has-text-grey mr-1',
                    empty: 'is-italic has-text-grey',
                    // Bulma's `.tag` is the chip primitive; we use it
                    // for the wrapper. Inner toggle is a borderless
                    // button. Inner remove is a button styled to
                    // match (Bulma's `.delete` pseudo-element
                    // approach can't compose with a real glyph
                    // inside, so we go custom via gap-fill CSS).
                    chip: 'tag is-medium is-rounded is-light vc-table-sort-indicators-chip-bulma',
                    chipToggle: 'button is-small is-rounded vc-table-sort-indicators-chip-toggle-bulma',
                    chipPosition: 'has-text-weight-bold has-text-grey is-size-7',
                    chipLabel: '',
                    chipArrow: 'has-text-weight-bold has-text-primary',
                    chipRemove: 'button is-small is-rounded vc-table-sort-indicators-chip-remove-bulma',
                    // Bulma 1.x `.select` is a wrapper styling pattern,
                    // not a direct-on-select class — see addWrapper.
                    addWrapper: 'select is-small is-rounded',
                    add: '',
                    clear: 'button is-small is-text ml-auto',
                },
            },
            pagination: {
                // Bulma's pagination canonical structure is
                // `<nav class="pagination">` containing standalone
                // `.pagination-previous` / `-next` siblings PLUS a
                // `<ul class="pagination-list">` wrapping the `.pagination-link`
                // page items. <VCPagination> only renders one `<ul>` with
                // uniform `<li>` children for every control (first / prev /
                // page items / next / last) — there's no mid-render hook to
                // differentiate item types in the theme today. As a
                // pragmatic mapping: apply `.pagination-list` to the
                // outer `<ul>` so its flex layout takes effect, and use
                // `.pagination-link` uniformly for all controls (Bulma's
                // edge-control styling — `.pagination-previous`/`-next` —
                // is very close to `.pagination-link`'s anyway, just
                // wider on small viewports). Visual parity with the
                // Tailwind / Bootstrap themes is preserved.
                classes: {
                    root: 'pagination-list is-flex is-justify-content-center',
                    item: '',
                    link: 'pagination-link',
                    linkActive: 'is-current',
                    ellipsis: 'pagination-ellipsis',
                },
                variants: {
                    variant: {
                        outline: { link: '' },
                        soft: { link: 'is-light' },
                        ghost: { link: 'is-text' },
                    },
                    size: {
                        xs: { root: 'is-small vc-size-xs' },
                        sm: { root: 'is-small' },
                        md: { root: '' },
                        lg: { root: 'is-large' },
                    },
                },
                defaultVariants: { variant: 'outline', size: 'md' },
            },
            // Reka primitives drive open/close via `data-state="open|closed"`,
            // not Bulma's `.is-active` class. Theme strings reference Bulma
            // classes for chrome (border, padding, typography); enter+exit
            // animations come from vuecs's dual-state helpers in
            // @vuecs/design's animations.css (`vc-overlay-anim`,
            // `vc-overlay-fade-anim`, `vc-tooltip-anim`).
            modal: {
                classes: {
                    overlay: 'modal-background vc-overlay-fade-anim',
                    // `.modal-content` is Bulma's centered panel host. Use
                    // it directly (skipping `.modal-card`); width sizing is
                    // wired in the bridge CSS for `.modal-sm/lg/xl`.
                    content: 'modal-content has-background-white p-5 vc-overlay-anim',
                    header: 'is-flex is-flex-direction-column',
                    title: 'title is-5',
                    description: 'subtitle is-size-7 has-text-grey',
                    body: 'is-flex is-flex-direction-column',
                    footer: 'is-flex is-align-items-center is-justify-content-flex-end',
                    trigger: '',
                    close: '',
                    // `.delete` paints the X glyph (Bulma's pseudo-element +
                    // `font-size: 0` recipe — the slot's literal "×"
                    // fallback is collapsed to zero size, so no
                    // double-render). Bulma's `.delete` is `position:
                    // relative` by default; the bridge CSS adds
                    // corner-positioning by targeting the structural
                    // `vc-modal-close-icon` class (from component defaults).
                    closeIcon: 'delete is-medium',
                    back: 'button is-small is-ghost',
                },
                variants: {
                    size: {
                        xs: { content: 'vc-modal-xs' },
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
                    // No native popover compound — `box` ships the panel
                    // chrome (bg, border-radius, shadow, padding).
                    content: 'box vc-overlay-anim',
                    arrow: '',
                    close: '',
                    // Same `.delete` rationale as `modal.closeIcon` —
                    // bridge CSS positions the structural
                    // `vc-popover-close-icon` class in the corner.
                    closeIcon: 'delete',
                },
                variants: {
                    size: {
                        xs: { content: 'vc-fs-xs p-2' },
                        sm: { content: 'is-size-7 p-2' },
                        md: { content: '' },
                        lg: { content: 'is-size-6 p-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            hoverCard: {
                classes: {
                    trigger: '',
                    content: 'box vc-overlay-anim',
                    arrow: '',
                },
                variants: {
                    size: {
                        xs: { content: 'vc-fs-xs p-2' },
                        sm: { content: 'is-size-7 p-2' },
                        md: { content: '' },
                        lg: { content: 'is-size-6 p-5' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Bulma has no native toast component. Compose `.notification`
            // (its closest visual equivalent) for the per-toast root plus
            // position utilities on the viewport. Slide animations use
            // the `vc-toast-anim` dual-state helper.
            toastViewport: {
                classes: { root: 'is-flex is-flex-direction-column m-0 p-4 vc-toast-viewport-fixed' },
                variants: {
                    position: {
                        'top-left': { root: 'vc-toast-viewport-top-left' },
                        'top-right': { root: 'vc-toast-viewport-top-right' },
                        'top-center': { root: 'vc-toast-viewport-top-center' },
                        'bottom-left': { root: 'vc-toast-viewport-bottom-left is-flex-direction-column-reverse' },
                        'bottom-right': { root: 'vc-toast-viewport-bottom-right is-flex-direction-column-reverse' },
                        'bottom-center': { root: 'vc-toast-viewport-bottom-center is-flex-direction-column-reverse' },
                    },
                },
                defaultVariants: { position: 'top-right' },
            },
            toast: {
                classes: {
                    root: 'notification is-flex is-align-items-flex-start vc-toast-anim',
                    body: 'is-flex-grow-1',
                    close: 'button is-small is-text',
                    closeIcon: 'delete is-small',
                },
                compoundVariants: [
                    // solid → `.notification.is-<color>`
                    { variants: { variant: 'solid', color: 'primary' }, class: { root: 'is-primary' } },
                    { variants: { variant: 'solid', color: 'neutral' }, class: { root: 'is-dark' } },
                    { variants: { variant: 'solid', color: 'success' }, class: { root: 'is-success' } },
                    { variants: { variant: 'solid', color: 'warning' }, class: { root: 'is-warning' } },
                    { variants: { variant: 'solid', color: 'error' }, class: { root: 'is-danger' } },
                    { variants: { variant: 'solid', color: 'info' }, class: { root: 'is-info' } },
                    // soft → `.notification.is-<color>.is-light`
                    { variants: { variant: 'soft', color: 'primary' }, class: { root: 'is-primary is-light' } },
                    { variants: { variant: 'soft', color: 'neutral' }, class: { root: 'is-light' } },
                    { variants: { variant: 'soft', color: 'success' }, class: { root: 'is-success is-light' } },
                    { variants: { variant: 'soft', color: 'warning' }, class: { root: 'is-warning is-light' } },
                    { variants: { variant: 'soft', color: 'error' }, class: { root: 'is-danger is-light' } },
                    { variants: { variant: 'soft', color: 'info' }, class: { root: 'is-info is-light' } },
                    // outline — bridge helper `vc-toast-outline-*` paints
                    // the border + emphasis text since Bulma's
                    // `.notification` has no outline variant.
                    { variants: { variant: 'outline', color: 'primary' }, class: { root: 'vc-toast-outline-primary' } },
                    { variants: { variant: 'outline', color: 'neutral' }, class: { root: 'vc-toast-outline-neutral' } },
                    { variants: { variant: 'outline', color: 'success' }, class: { root: 'vc-toast-outline-success' } },
                    { variants: { variant: 'outline', color: 'warning' }, class: { root: 'vc-toast-outline-warning' } },
                    { variants: { variant: 'outline', color: 'error' }, class: { root: 'vc-toast-outline-error' } },
                    { variants: { variant: 'outline', color: 'info' }, class: { root: 'vc-toast-outline-info' } },
                ],
                defaultVariants: { variant: 'soft', color: 'neutral' },
            },
            toastTitle: { classes: { root: 'has-text-weight-semibold mb-1' } },
            toastDescription: { classes: { root: 'is-size-7' } },
            toastAction: { classes: { root: 'button is-small is-outlined' } },
            tooltip: {
                classes: {
                    trigger: '',
                    // Bulma's `[data-tooltip]` is data-attribute-driven and
                    // doesn't fit Reka's class-based tooltip. Use `box` +
                    // dark-bg utilities for a tooltip-like panel.
                    content: 'has-background-dark has-text-light vc-tooltip-anim',
                    arrow: '',
                },
                variants: {
                    size: {
                        xs: { content: 'vc-fs-xs px-2 py-0' },
                        sm: { content: 'is-size-7 px-2 py-1' },
                        md: { content: 'px-3 py-1' },
                        lg: { content: 'is-size-6 px-3 py-2' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            dropdownMenu: {
                classes: {
                    trigger: '',
                    // `.dropdown-content` instead of `.dropdown-menu` — see
                    // file header for rationale (parent-state-gated).
                    content: 'dropdown-content vc-overlay-anim',
                    item: 'dropdown-item',
                    checkboxItem: 'dropdown-item',
                    radioItem: 'dropdown-item',
                    radioGroup: '',
                    itemIndicator: '',
                    label: 'dropdown-item has-text-weight-semibold has-text-grey',
                    separator: 'dropdown-divider',
                    group: '',
                    subTrigger: 'dropdown-item is-flex is-justify-content-space-between',
                    subContent: 'dropdown-content vc-overlay-anim',
                    arrow: '',
                },
                variants: {
                    size: {
                        xs: { content: 'vc-fs-xs' },
                        sm: { content: 'is-size-7' },
                        md: { content: '' },
                        lg: { content: 'is-size-6' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            contextMenu: {
                classes: {
                    trigger: '',
                    content: 'dropdown-content vc-overlay-anim',
                    item: 'dropdown-item',
                    checkboxItem: 'dropdown-item',
                    radioItem: 'dropdown-item',
                    radioGroup: '',
                    itemIndicator: '',
                    label: 'dropdown-item has-text-weight-semibold has-text-grey',
                    separator: 'dropdown-divider',
                    group: '',
                    subTrigger: 'dropdown-item is-flex is-justify-content-space-between',
                    subContent: 'dropdown-content vc-overlay-anim',
                },
                variants: {
                    size: {
                        xs: { content: 'vc-fs-xs' },
                        sm: { content: 'is-size-7' },
                        md: { content: '' },
                        lg: { content: 'is-size-6' },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Bulma has no core stepper compound. Layout (size, radius,
            // gaps) lives in @vuecs/navigation's structural CSS; this entry
            // only paints colors. data-state="active|completed" drives the
            // bg/text/border flip via attribute selectors in the bridge CSS.
            stepper: {
                classes: {
                    root: '',
                    item: '',
                    trigger: 'button is-text',
                    indicator: 'has-background-light has-text-grey has-text-weight-semibold',
                    // No size class on title/description by default — let the
                    // size variants control. `is-size-{1..7}` are equal-
                    // specificity class selectors; Bulma's source order
                    // would make a default size impossible to override per
                    // variant without `!important`.
                    title: 'has-text-weight-medium',
                    description: 'has-text-grey',
                    separator: 'has-background-grey-lighter',
                },
                variants: {
                    size: {
                        xs: {
                            indicator: 'vc-stepper-indicator-xs', 
                            title: 'vc-fs-xs', 
                            description: 'vc-fs-xs', 
                        },
                        sm: {
                            indicator: 'vc-stepper-indicator-sm', 
                            title: 'is-size-7', 
                            description: 'is-size-7', 
                        },
                        md: { indicator: '' },
                        lg: {
                            indicator: 'vc-stepper-indicator-lg', 
                            title: 'is-size-5', 
                            description: 'is-size-6', 
                        },
                    },
                },
                defaultVariants: { size: 'md' },
            },
            // Bulma ships a native `.breadcrumb` (`nav.breadcrumb > ul > li`).
            // We put `.breadcrumb` on the `<nav>` root so Bulma colours the
            // crumb links (`.breadcrumb a`). vuecs renders an `<ol>` plus an
            // EXPLICIT separator `<li aria-hidden>` between items — Bulma's
            // native `li + li::before { content: "/" }` would double up with
            // ours, so the bridge CSS neutralises it (see assets/index.css).
            // State styling (current / disabled) is keyed off `aria-current`
            // / `aria-disabled`, which Bulma class strings can't express, so
            // it also lives in the bridge CSS gap-fill.
            breadcrumb: {
                classes: {
                    root: 'breadcrumb',
                    list: '',
                    link: '',
                    page: '',
                    ellipsis: '',
                },
            },
            breadcrumbItem: { classes: { root: '' } },
            breadcrumbSeparator: { classes: { root: '' } },
            placeholder: {
                // Bulma has no built-in placeholder primitive — use
                // the design-token muted bg. `wave` and `glow`
                // inherit the shipped animation classes from
                // `@vuecs/placeholder/assets/index.css`.
                classes: { root: 'has-background-grey-lighter' },
            },
            tablePlaceholder: {
                classes: {
                    root: 'table is-fullwidth',
                    header: '',
                    body: '',
                    footer: '',
                    row: '',
                    cell: '',
                },
            },
            cardPlaceholder: {
                classes: {
                    root: 'card',
                    image: 'card-image',
                    header: 'card-header p-3',
                    body: 'card-content',
                    footer: 'card-footer p-3',
                },
            },
            placeholderWrapper: { classes: { root: 'is-relative' } },
            tableRowExpansion: {
                classes: {
                    root: 'has-background-light',
                    cell: 'p-0',
                    panel: '',
                    panelInner: 'px-4 py-3',
                },
            },
            tableExpandTrigger: {
                classes: {
                    root: 'button is-small is-ghost p-1 has-text-grey',
                    icon: 'is-size-7',
                },
            },
            tableExpandTriggerCell: { classes: { root: 'has-text-centered' } },
        },
        /*
         * Theme-runtime hook (plan 021): mirror the resolved color mode
         * onto Bulma's `data-theme` attribute so framework chrome (navbar
         * text, form-control bg, etc.) follows vuecs's `.dark` toggle
         * without a per-app `watchEffect` mirror. Bulma 1.0+ reads
         * `data-theme` (alongside `prefers-color-scheme`) as its own
         * dark-mode source of truth; the bridge `assets/index.css` keeps
         * `--vc-color-*` aligned.
         */
        colorMode: {
            handle(doc, mode) {
                doc.documentElement.setAttribute('data-theme', mode);
            },
        },
        /*
         * Theme-runtime hook (plan 021): declare the Bulma palette
         * renderer + catalog. `@vuecs/design`'s `useColorPalette()`
         * walks installed themes and concatenates each
         * `palette.handle` output, so `@vuecs/theme-bulma`'s
         * `useColorPalette()` wrapper delegates here. When stacked
         * alongside theme-tailwind (the docs-site case), both renderers
         * fire on the same payload and emit non-overlapping CSS rules
         * into the single `<style id="vc-color-palette">` block. Bulma
         * reuses Tailwind's 22-name palette catalog, rendered as HSL
         * channel vars internally (plan 018).
         */
        palette: {
            handle: renderColorPaletteStyles as (palette: Record<string, string>) => string,
            names: COLOR_PALETTES,
        },
    };
}
