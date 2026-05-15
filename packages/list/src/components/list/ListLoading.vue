<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useList } from '../../composables';
import { applyAsChild } from '../../utils';
import type { ListLoadingThemeClasses } from '../../types';

const listLoadingProps = {
    /**
     * Wrapper element. Default `'div'` with `role="status"` +
     * `aria-live="polite"` so screen readers announce the loading state
     * when it appears.
     */
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    /**
     * Refresh-feedback mode. When `false` (default), shows only on
     * first-load (`busy && data.length === 0`). When `true`, shows
     * whenever `busy` regardless of data — pair with theme styling
     * that visually overlays the existing `<ul>` (themes can apply
     * `position: absolute; inset: 0;` via the `overlay.true` variant).
     */
    overlay: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListLoadingProps = ExtractPublicPropTypes<typeof listLoadingProps>;

type ListLoadingSlotProps = { busy: boolean; overlay: boolean };

export const listLoadingThemeDefaults: ComponentThemeDefinition<ListLoadingThemeClasses> = { classes: { root: 'vc-list-loading' } };

/**
 * `<VCListLoading>` — first-load loading placeholder. Renders as a
 * sibling to `<VCListBody>` (NOT inside the `<ul>`).
 *
 * Render condition:
 *  - Default: `busy && data.length === 0` (first-load only)
 *  - `:overlay`: `busy` (any time the list is fetching — pair with theme
 *    overlay positioning for refresh-feedback UI)
 *
 * The `:overlay` prop also forwards to the theme as a variant
 * (`overlay: true`), letting themes apply distinct visual treatment
 * (e.g. absolute positioning + backdrop) when in overlay mode.
 */
export default defineComponent({
    name: 'VCListLoading',
    props: listLoadingProps,
    slots: Object as SlotsType<{
        default: ListLoadingSlotProps;
    }>,
    setup(props, { slots }) {
        // Fold `:overlay` into themeVariant only when truthy — matches
        // the ListItem pattern. Folding the default `false` would write
        // `overlay: false` into every render and accidentally activate
        // any future `overlay.false` variant rule.
        const themedProps = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                const base = { ...(props.themeVariant ?? {}) };
                if (props.overlay) base.overlay = true;
                return base;
            },
        };
        const theme = useComponentTheme('listLoading', themedProps, listLoadingThemeDefaults);
        const { state } = useList('VCListLoading');

        return () => {
            if (!state.busy.value) return null;
            if (!props.overlay && state.data.value.length > 0) return null;

            const rootClass = theme.value.root || undefined;
            const slotProps: ListLoadingSlotProps = {
                busy: state.busy.value,
                overlay: props.overlay,
            };
            const children = slots.default?.(slotProps);
            const attrs: Record<string, unknown> = {
                class: rootClass,
                role: 'status',
                'aria-live': 'polite',
            };
            if (props.asChild) {
                const cloned = applyAsChild(children, attrs);
                if (cloned) return cloned;
            }
            return h(props.tag, attrs, children);
        };
    },
});
</script>
