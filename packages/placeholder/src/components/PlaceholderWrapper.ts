import {
    defineComponent, 
    h, 
    mergeProps,
} from 'vue';
import type { ExtractPublicPropTypes, SlotsType } from 'vue';
import {
    themableProps, 
    useComponentTheme, 
    useThemeProps,
} from '@vuecs/core';
import { placeholderWrapperThemeDefaults } from '../theme';
import type { PlaceholderWrapperThemeClasses } from '../types';

const placeholderWrapperProps = {
    /** When `true`, the `#loading` slot renders; otherwise `#default`. */
    loading: { type: Boolean, default: false },
    /** Render-as tag. Defaults to `'div'`. */
    tag: { type: String, default: 'div' },
    ...themableProps<PlaceholderWrapperThemeClasses>(),
};

export type PlaceholderWrapperProps = ExtractPublicPropTypes<typeof placeholderWrapperProps>;

/**
 * Conditional wrapper — renders `#loading` when `:loading` is true,
 * `#default` otherwise. Lets consumers swap a skeleton in / out
 * without writing `v-if` plumbing.
 *
 * ```vue
 * <VCPlaceholderWrapper :loading="busy">
 *   <template #loading>
 *     <VCPlaceholderTable :rows="5" :columns="7" />
 *   </template>
 *   <template #default>
 *     <MyTable :rows="rows" />
 *   </template>
 * </VCPlaceholderWrapper>
 * ```
 *
 * The wrapper itself emits a single root element so consumer styling
 * stays predictable. ARIA `aria-busy` is mirrored to the wrapper for
 * assistive-tech announcements.
 */
export const VCPlaceholderWrapper = defineComponent({
    name: 'VCPlaceholderWrapper',
    inheritAttrs: false,
    props: placeholderWrapperProps,
    slots: Object as SlotsType<{
        default(): unknown;
        loading(): unknown;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'placeholderWrapper',
            useThemeProps(props),
            placeholderWrapperThemeDefaults,
        );
        return () => h(
            props.tag,
            mergeProps(attrs, {
                class: theme.value.root || undefined,
                // W3C ARIA "Loading content" pattern: while loading,
                // expose the wrapper as a polite live region with
                // `aria-busy="true"`. The skeletons themselves stay
                // `aria-hidden` — AT consumers get a single "loading"
                // announcement rather than enumerating every bar.
                role: props.loading ? 'status' : undefined,
                'aria-live': props.loading ? 'polite' : undefined,
                'aria-busy': props.loading ? 'true' : undefined,
                'data-loading': props.loading ? '' : undefined,
            }),
            (props.loading ? slots.loading?.() : slots.default?.()) as never,
        );
    },
});
