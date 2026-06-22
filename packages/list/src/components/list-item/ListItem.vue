<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    onBeforeUnmount,
    ref,
    watch,
} from 'vue';
import type { 
    Component, 
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
} from 'vue';
import { provideListItemContext, useList } from '../../composables';
import { applyAsChild } from '../../utils';
import type { ListItemThemeClasses } from '../../types';

type AriaCurrent = boolean | 'page' | 'step' | 'location' | 'date' | 'time';

const listItemProps = {
    /** The item record this row represents. Forwarded as a slot prop + into context. */
    data: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Index within iteration. Forwarded as a slot prop. -1 outside iteration. */
    index: { type: Number, default: -1 },

    /**
     * Row element. Default `'li'` — emits semantic HTML inside `<ul>` /
     * `<ol>` (the `<VCListBody>` parent). Override only for non-list
     * structural contexts. Accepts a string tag or a component.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'li' },

    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },

    /**
     * Reka-style as-child: render by cloning the slot's first vnode
     * instead of emitting a wrapper. Class + ARIA attributes merge
     * onto the consumer's element.
     */
    asChild: { type: Boolean, default: false },

    /**
     * Disable interaction. Sets `aria-disabled="true"` + theme variant
     * `disabled.true`. Disabled rows skip selection toggle on click and
     * are excluded from keyboard navigation.
     */
    disabled: { type: Boolean, default: false },

    /**
     * Mark the row as "current" — typically the active route in a nav
     * list. Sets `aria-current` (default `'true'` when boolean, or the
     * string variant) + theme variant `active.true`. Independent of
     * selection; purely visual+semantic.
     */
    active: {
        type: [Boolean, String] as PropType<AriaCurrent>,
        default: false,
    },

    /**
     * Make this row selection-aware. Clicks toggle selection (whole-row
     * with auto-exclude for native interactive descendants); when the
     * parent `<VCList>` has `selection-mode` set, the row participates
     * in keyboard navigation and gets `role="option"` + `aria-selected`.
     */
    selectable: { type: Boolean, default: false },

    themeClass: { type: Object as PropType<ThemeClassesOverride<ListItemThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListItemProps = ExtractPublicPropTypes<typeof listItemProps>;

export type ListItemSlotProps<T = unknown> = {
    data: T;
    index: number;
    classes: ListItemThemeClasses;
    isSelected: boolean;
    isFocused: boolean;
    isDisabled: boolean;
    isActive: boolean;
    isSelectable: boolean;
    toggle: () => void;
};

export const listItemThemeDefaults: ComponentThemeDefinition<ListItemThemeClasses> = {
    classes: {
        root: 'vc-list-item',
        text: 'vc-list-item-text',
        actions: 'vc-list-item-actions',
    },
};

/**
 * CSS selector matching native interactive elements that should NOT
 * trigger row selection when clicked. Plan 027 OQ6 — auto-exclude
 * for whole-row click activation. Consumers can mark custom
 * interactive elements with `data-vc-noselect` to opt in.
 */
const NATIVE_INTERACTIVE_SELECTOR =    'button, a[href], input, select, textarea, [contenteditable], [contenteditable=""], [contenteditable="true"], [role="button"], [role="link"], [role="checkbox"], [role="switch"], [data-vc-noselect]';

function clickShouldToggle(event: Event): boolean {
    // Use structural duck-typing instead of `instanceof Element` so the
    // lint config doesn't need `dom` globals; any event target with a
    // `.closest()` is a DOM element by convention.
    const target = event.target as { closest?: (s: string) => unknown } | null;
    if (!target || typeof target.closest !== 'function') return true;
    return target.closest(NATIVE_INTERACTIVE_SELECTOR) === null;
}

/**
 * `<VCListItem>` — per-row container. Renders the row element (`<li>`
 * by default), exposes resolved item-level theme classes + row state
 * via slot props, and coordinates with the parent `<VCList>` for
 * selection / focus.
 *
 * Selection activation: click anywhere on a `:selectable` row toggles
 * selection. Native interactive descendants (`button`, `a`, `input`,
 * etc.) auto-exclude so their clicks propagate normally. Custom
 * interactive elements opt out via `data-vc-noselect` attribute.
 */
export default defineComponent({
    name: 'VCListItem',
    props: listItemProps,
    slots: Object as SlotsType<{
        default: ListItemSlotProps;
    }>,
    setup(props, { slots, attrs }) {
        const list = useList<unknown>('VCListItem');
        const { state, selection } = list;

        const key = computed(() => {
            if (props.data === undefined) return undefined;
            return state.getItemKey(props.data);
        });

        const isSelected = computed(() => {
            if (!props.selectable || key.value === undefined) return false;
            return selection.isSelected(key.value);
        });

        const isDisabled = computed(() => props.disabled);
        // Truthy on `true`, `'page'`, `'step'`, … Falsy on `false`. Single
        // source of truth for the row's "active" axis — read by both the
        // theme-variant fold + the aria-current / data-active render.
        const isActive = computed(() => Boolean(props.active));
        const isSelectable = computed(() => props.selectable);

        // Fold row-state props + derived `selected` into `themeVariant`
        // so theme entries' `variants.{disabled,active,selected}.true`
        // activate without consumers having to repeat the values on
        // `:theme-variant`. `selected` comes from the selection state
        // machine (not a prop), so we build the proxy manually instead
        // of using `useThemeProps`.
        const themedProps = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                const base = { ...(props.themeVariant ?? {}) };
                if (isDisabled.value) base.disabled = true;
                if (isActive.value) base.active = true;
                if (isSelected.value) base.selected = true;
                return base;
            },
        };
        const theme = useComponentTheme('listItem', themedProps, listItemThemeDefaults);

        // Tab-stop ownership — the FIRST selectable + enabled item
        // (lowest data index, dynamically resolved) gets
        // `tabindex="0"` initially. Previously hard-coded to
        // `props.index === 0`, which left the listbox with no
        // keyboard entry point if row 0 was disabled. Each eligible
        // item registers with the list-scope tab-stop registry;
        // `firstTabStopIndex` is the lowest registered index.
        const isEligibleTabStop = computed(() => (
            props.selectable && !props.disabled
        ));
        // Watch eligibility AND index together. If the row's index
        // changes mid-life (list reorder / splice), the old index
        // must unregister before the new one registers — otherwise
        // the registry holds a stale entry and `firstTabStopIndex`
        // points at a row that no longer exists.
        watch(
            [isEligibleTabStop, () => props.index],
            ([eligible, newIndex], oldValues) => {
                const oldIndex = oldValues?.[1];
                if (oldIndex !== undefined && oldIndex !== newIndex) {
                    list.unregisterEligibleItem(oldIndex);
                }
                if (eligible) list.registerEligibleItem(newIndex);
                else list.unregisterEligibleItem(newIndex);
            },
            { immediate: true },
        );
        onBeforeUnmount(() => {
            if (isEligibleTabStop.value) list.unregisterEligibleItem(props.index);
        });
        const isTabStop = computed(() => (
            isEligibleTabStop.value && list.firstTabStopIndex.value === props.index
        ));

        // Real DOM-focus state — wired via focusin/focusout on the
        // root element. Previously this was `props.index === 0`
        // (always true for row 0), which lied about actual focus.
        // Driven by `onFocusin` / `onFocusout` attached below.
        const isFocused = ref(false);

        const toggle = (opts: { range?: boolean; toggle?: boolean } = {}): void => {
            if (props.disabled || !props.selectable || key.value === undefined) return;
            if (selection.mode.value === undefined) return;
            selection.toggle(key.value, opts);
        };

        provideListItemContext({
            data: computed(() => props.data),
            index: computed(() => props.index),
            key,
            classes: computed(() => theme.value),
            isSelected,
            isFocused,
            isDisabled,
            isActive,
            isSelectable,
            toggle: (opts) => toggle(opts),
        });

        const onClick = (event: Event): void => {
            if (!props.selectable || props.disabled) return;
            if (!clickShouldToggle(event)) return;
            const m = event as {
                shiftKey?: boolean; 
                ctrlKey?: boolean; 
                metaKey?: boolean 
            };
            toggle({
                range: !!m.shiftKey,
                toggle: !!m.ctrlKey || !!m.metaKey,
            });
        };

        const onKeydown = (event: Event): void => {
            if (!props.selectable || props.disabled) return;
            const k = event as {
                key?: string; 
                shiftKey?: boolean; 
                ctrlKey?: boolean; 
                metaKey?: boolean; 
                preventDefault: () => void 
            };
            if (k.key === ' ' || k.key === 'Enter') {
                k.preventDefault();
                toggle({
                    range: !!k.shiftKey,
                    toggle: !!k.ctrlKey || !!k.metaKey,
                });
            }
        };

        return () => {
            const slotProps: ListItemSlotProps = {
                data: props.data,
                index: props.index,
                classes: theme.value,
                isSelected: isSelected.value,
                isFocused: isFocused.value,
                isDisabled: isDisabled.value,
                isActive: isActive.value,
                isSelectable: isSelectable.value,
                toggle: () => toggle(),
            };

            const rootClass = theme.value.root || undefined;
            const inListbox = props.selectable && selection.mode.value !== undefined;

            const elementAttrs: Record<string, unknown> = { class: rootClass };

            if (props.disabled) {
                elementAttrs['aria-disabled'] = 'true';
                elementAttrs['data-disabled'] = '';
            }
            if (isActive.value) {
                elementAttrs['aria-current'] = props.active === true ? 'true' : props.active;
                elementAttrs['data-active'] = '';
            }
            if (inListbox) {
                elementAttrs.role = 'option';
                elementAttrs['aria-selected'] = isSelected.value ? 'true' : 'false';
                elementAttrs.tabindex = isTabStop.value ? 0 : -1;
                elementAttrs.onFocusin = () => { isFocused.value = true; };
                elementAttrs.onFocusout = () => { isFocused.value = false; };
                elementAttrs['data-selected'] = isSelected.value ? '' : undefined;
                elementAttrs.onClick = onClick;
                // Keyboard activation only when listbox semantics are on.
                // In the "selectable but no mode" branch below we wire
                // click for item-owned event flow but NOT keydown — a
                // `preventDefault()` on Space/Enter inside a row without
                // listbox semantics would swallow keypresses for inner
                // content (form inputs, links, etc.).
                elementAttrs.onKeydown = onKeydown;
            } else if (props.selectable) {
                // Selectable but no selection-mode set on parent — still
                // wire click delegation so consumers using item-owned
                // event flow can listen via @click on the item. ARIA
                // listbox semantics stay off; keydown stays unwired.
                elementAttrs.onClick = onClick;
            }

            const children = slots.default?.(slotProps);
            // mergeProps order: vuecs-owned attrs (class, ARIA, listeners)
            // win over consumer attrs only for keys it actually controls —
            // mergeProps concatenates class + listener handlers so
            // consumer-supplied class / @click flow through. asChild does
            // the same merge into the cloned vnode so both render paths
            // honour `attrs` consistently.
            const mergedAttrs = mergeProps(attrs, elementAttrs);
            if (props.asChild) {
                const cloned = applyAsChild(children, mergedAttrs);
                if (cloned) return cloned;
            }
            return h(props.tag ?? props.as, mergedAttrs, children);
        };
    },
});
</script>
