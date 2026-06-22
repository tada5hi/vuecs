<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { 
    Component, 
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
} from 'vue';
import { useList } from '../../composables';
import { applyAsChild, hasMeaningfulVNodes } from '../../utils';
import type { ListEmptyDefaults, ListEmptyThemeClasses } from '../../types';

const listEmptyProps = {
    /**
     * Wrapper element. Default `'div'` with `role="status"` so screen
     * readers announce the empty state when it appears. Accepts a string
     * tag or a component.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    /**
     * @deprecated Use `as` instead. Non-breaking alias — takes precedence
     * over `as` when set.
     */
    tag: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListEmptyThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListEmptyProps = ExtractPublicPropTypes<typeof listEmptyProps>;

type ListEmptySlotProps = { data: unknown[]; busy: boolean };

const behavioralDefaults: ListEmptyDefaults = { content: 'No data available...' };

export const listEmptyThemeDefaults: ComponentThemeDefinition<ListEmptyThemeClasses> = { classes: { root: 'vc-list-empty' } };

/**
 * `<VCListEmpty>` — empty-state placeholder. Renders as a sibling to
 * `<VCListBody>` (NOT inside the `<ul>`) when `data.length === 0 &&
 * !busy`. Reads `useList()` for state.
 *
 * Behavioral default for content text is configurable via
 * `app.use(vuecs, { defaults: { listEmpty: { content: t('list.empty') } } })`.
 */
export default defineComponent({
    name: 'VCListEmpty',
    props: listEmptyProps,
    slots: Object as SlotsType<{
        default: ListEmptySlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listEmpty', props, listEmptyThemeDefaults);
        const defaults = useComponentDefaults('listEmpty', props, behavioralDefaults);
        const { state } = useList('VCListEmpty');

        return () => {
            // Render condition: data empty AND not busy. The `!busy` guard
            // makes Default-Sibling loading (sibling spinner) the
            // exclusive state during first-load instead of stacking with
            // Empty.
            if (state.busy.value || state.data.value.length > 0) return null;

            const rootClass = theme.value.root || undefined;
            const slotProps: ListEmptySlotProps = {
                data: state.data.value,
                busy: state.busy.value,
            };
            const slotChildren = slots.default?.(slotProps);
            const hasSlotContent = hasMeaningfulVNodes(slotChildren);

            const attrs: Record<string, unknown> = {
                class: rootClass,
                role: 'status',
            };

            if (props.asChild && hasSlotContent) {
                const cloned = applyAsChild(slotChildren, attrs);
                if (cloned) return cloned;
            }
            const children = hasSlotContent ? slotChildren : [defaults.value.content];
            return h(props.tag ?? props.as, attrs, children);
        };
    },
});
</script>
