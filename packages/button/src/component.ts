import { isMeaningfulSlotContent, useComponentTheme } from '@vuecs/core';
import type {
    ComponentThemeDefinition,
    ThemeClassesOverride,
    ThemeElementDefinition,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
import { VCIcon } from '@vuecs/icon';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNodeArrayChildren,
} from 'vue';
import {
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type {
    ButtonColor,
    ButtonSize,
    ButtonSlotProps,
    ButtonThemeClasses,
    ButtonVariant,
} from './type';

declare module '@vuecs/core' {
    interface ThemeElements {
        button?: ThemeElementDefinition<ButtonThemeClasses>;
    }
}

export const buttonThemeDefaults: ComponentThemeDefinition<ButtonThemeClasses> = {
    classes: {
        root: 'vc-button',
        leading: 'vc-button-leading',
        trailing: 'vc-button-trailing',
        label: 'vc-button-label',
    },
};

const buttonProps = {
    color: { type: String as PropType<ButtonColor>, default: undefined },
    variant: { type: String as PropType<ButtonVariant>, default: undefined },
    size: { type: String as PropType<ButtonSize>, default: undefined },
    type: { type: String, default: 'button' },
    /**
     * Element or component to render as. Pass a string tag (`'a'`, `'div'`)
     * or a component (`RouterLink` / `NuxtLink`) to render a button-styled
     * link / arbitrary element. Native `type` / `disabled` semantics apply
     * only when this resolves to `'button'`; every other target is disabled
     * via `aria-disabled` + `tabindex="-1"` + a capture-phase click guard
     * that blocks activation (so a disabled button-link can't navigate).
     * Extra attrs (`to`, `href`, `target`, …) forward to the rendered
     * element.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * @deprecated Use `as` instead. Retained as a non-breaking alias — when
     * set it takes precedence over `as`.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    label: { type: String, default: undefined },
    iconLeft: { type: String, default: undefined },
    iconRight: { type: String, default: undefined },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ButtonThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>;

export const VCButton = defineComponent({
    name: 'VCButton',
    props: buttonProps,
    slots: Object as SlotsType<{
        default: ButtonSlotProps;
        leading: ButtonSlotProps;
        trailing: ButtonSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        /*
         * Activation guard for non-native render targets (#1699).
         *
         * `disabled` is a `<button>` / form-control attribute — an `<a>`,
         * a `RouterLink` / `NuxtLink`, or any other `as` target keeps its
         * own click behaviour, so a disabled button-link still navigated.
         * `aria-disabled` alone announces the state without enforcing it.
         *
         * Registered as `onClickCapture` deliberately. At the event target
         * the DOM runs the capture-phase listeners before the bubble-phase
         * ones (dispatch walks the path twice — capturing, then bubbling —
         * and skips listeners whose capture flag doesn't match the current
         * phase), so this lands ahead of the target's own `onClick`
         * regardless of registration order. That matters because fallthrough
         * attrs are merged *after* a component's own props, i.e. a plain
         * bubble-phase guard would run second — after RouterLink had
         * already navigated.
         *
         * `stopPropagation()` also suppresses the target's bubble listeners:
         * the stop-propagation flag is checked once per element per phase,
         * so the element's own bubbling pass returns early.
         */
        const guardDisabledActivation = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        };

        // The convenience props (color/variant/size/loading) are merged into
        // themeVariant before resolution so themes can drive slot classes off
        // them via the standard variant system. Getter properties keep this
        // reactive — Vue's computed() inside useComponentTheme tracks the
        // underlying prop reads.
        const themeProps: UseComponentThemeProps<ButtonThemeClasses> = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return {
                    ...(props.themeVariant ?? {}),
                    ...(props.color !== undefined ? { color: props.color } : {}),
                    ...(props.variant !== undefined ? { variant: props.variant } : {}),
                    ...(props.size !== undefined ? { size: props.size } : {}),
                    ...(props.loading ? { loading: true } : {}),
                };
            },
        };

        const theme = useComponentTheme('button', themeProps, buttonThemeDefaults);

        return () => {
            const resolved = theme.value;
            const isDisabled = props.disabled || props.loading;
            const slotProps: ButtonSlotProps = {
                loading: props.loading,
                disabled: isDisabled,
            };

            const children: VNodeArrayChildren = [];

            // Empty slot results (`<template #leading />` returning [], or a
            // `v-if="false"` comment) would otherwise emit a wrapper <span>
            // with no visible children — functionally inert but dead markup.
            // `isMeaningfulSlotContent` (from @vuecs/core) gates that out.

            // When loading, the leading slot becomes a spinner — universally
            // legible loading affordance, replaces any consumer-provided icon
            // for the duration of the in-flight work. Without this the only
            // signal was a faint opacity/cursor change that read identical to
            // the disabled state on most themes.
            //
            // Accessibility: the spinner glyph is `aria-hidden` (it's
            // decorative — the visual is the spinning ring) but we wrap it
            // alongside a visually-hidden "Loading" label so screen readers
            // announce the busy state. Combined with `aria-busy="true"` on
            // the root (set below), AT users get a clear "in progress"
            // signal instead of the indistinct "disabled" the native
            // `disabled` attribute would otherwise convey on its own.
            if (props.loading) {
                children.push(h('span', { class: resolved.leading || undefined }, [
                    h('span', { class: 'vc-button-spinner', 'aria-hidden': 'true' }),
                    h('span', { class: 'vc-sr-only' }, 'Loading'),
                ]));
            } else if (slots.leading) {
                const leadingOut = slots.leading(slotProps);
                if (isMeaningfulSlotContent(leadingOut)) {
                    children.push(h('span', { class: resolved.leading || undefined }, leadingOut));
                }
            } else if (props.iconLeft) {
                // The string is treated as an Iconify name (e.g. 'lucide:plus')
                // and resolved through <VCIcon>. Consumers wanting raw class
                // strings should slot their own element via #leading instead.
                children.push(h('span', { class: resolved.leading || undefined }, [
                    h(VCIcon, { name: props.iconLeft }),
                ]));
            }

            const slotLabel = slots.default ? slots.default(slotProps) : undefined;
            if (isMeaningfulSlotContent(slotLabel)) {
                children.push(h('span', { class: resolved.label || undefined }, slotLabel));
            } else if (typeof props.label === 'string' && props.label !== '') {
                children.push(h('span', { class: resolved.label || undefined }, props.label));
            }

            if (slots.trailing) {
                const trailingOut = slots.trailing(slotProps);
                if (isMeaningfulSlotContent(trailingOut)) {
                    children.push(h('span', { class: resolved.trailing || undefined }, trailingOut));
                }
            } else if (props.iconRight) {
                children.push(h('span', { class: resolved.trailing || undefined }, [
                    h(VCIcon, { name: props.iconRight }),
                ]));
            }

            // `tag` is the deprecated alias — when explicitly set it wins
            // over `as`; otherwise `as` (default `'button'`) drives the
            // render target. A string tag or a component both resolve here.
            const renderAs = props.tag ?? props.as;
            const isNativeButton = renderAs === 'button';

            return h(
                renderAs,
                mergeProps({
                    class: [
                        resolved.root || undefined,
                        // Structural busy class — themes layer their own look,
                        // but every theme gets a consistent loading affordance
                        // (wait cursor + opacity pulse) without redeclaring it.
                        // `disabled` blocks pointer events on native buttons,
                        // which would defeat `cursor: wait`; the CSS handles
                        // that by scoping `cursor: wait` only when the busy
                        // class is set and avoids `pointer-events: none`.
                        props.loading ? 'vc-button--busy' : undefined,
                    ],
                    ...(isNativeButton ? { type: props.type } : {}),
                    ...(isNativeButton ? { disabled: isDisabled || undefined } : {}),
                    // Non-native targets get the full disabled treatment:
                    // announced (`aria-disabled`), removed from the tab
                    // order to match what native `disabled` does, and
                    // blocked from activating. `tabindex="-1"` keeps the
                    // element focusable programmatically, so it stays
                    // reachable for tooltips explaining *why* it's off.
                    // Enter on a focused link dispatches a click, so the
                    // capture guard covers keyboard activation too.
                    ...(!isNativeButton && isDisabled ? {
                        'aria-disabled': 'true',
                        tabindex: '-1',
                        onClickCapture: guardDisabledActivation,
                    } : {}),
                    // Distinguish loading from plain `disabled` for AT —
                    // both still set `disabled` (loading must block clicks
                    // to prevent double-submit), but `aria-busy` lets screen
                    // readers announce "busy" rather than just "disabled".
                    ...(props.loading ? { 'aria-busy': 'true' } : {}),
                }, attrs),
                children,
            );
        };
    },
});
