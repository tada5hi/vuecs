<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { VCIcon } from '@vuecs/icon';
import {
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
    PaginationRoot,
} from 'reka-ui';
import { computed, defineComponent } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { PaginationDefaults, PaginationMeta, PaginationThemeClasses } from './type';
import {
    calculateOffset,
    calculatePage,
    calculatePagesTotal,
} from './utils';

const paginationProps = {
    /** Total number of items to paginate. Forwarded to Reka `total`. */
    total: { type: Number, default: 0 },
    /** Items per page. Vuecs convention: semantic rename of Reka `itemsPerPage`; mapped via `limit || 1`. */
    limit: { type: Number, default: 0 },
    /** Current offset (item index). Vuecs internal — drives computed currentPage; not a Reka prop. */
    offset: { type: Number, default: 0 },
    /** Disable interaction and emission. Vuecs convention: semantic rename of Reka `disabled`. */
    busy: { type: Boolean, default: false },
    /** Root element tag. Vuecs convention: defaults to `ul` (overrides Reka's `nav`) for list-style markup. */
    tag: { type: String, default: 'ul' },
    /** Per-item element tag. Vuecs internal — drives `<component :is>`; no Reka equivalent. */
    itemTag: { type: String, default: 'li' },
    /** Theme slot-class overrides. Vuecs theme concern, never forwarded to Reka. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<PaginationThemeClasses>>, default: undefined },
    /** Theme variant values. Vuecs theme concern, never forwarded to Reka. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    /** When true, edge controls are unrendered (vs rendered-disabled) at page boundaries. Does not apply to `busy`. */
    hideDisabled: { type: Boolean, default: false },
    /** Icon name (Iconify format) for the First button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    firstIcon: { type: String, default: undefined },
    /** Icon name (Iconify format) for the Previous button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    prevIcon: { type: String, default: undefined },
    /** Icon name (Iconify format) for the Next button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    nextIcon: { type: String, default: undefined },
    /** Icon name (Iconify format) for the Last button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    lastIcon: { type: String, default: undefined },
    /** Text label for the First button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    firstLabel: { type: String, default: undefined },
    /** Text label for the Previous button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    prevLabel: { type: String, default: undefined },
    /** Text label for the Next button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    nextLabel: { type: String, default: undefined },
    /** Text label for the Last button. `undefined` falls through to the DefaultsManager; `''` suppresses. */
    lastLabel: { type: String, default: undefined },
};

export type PaginationProps = ExtractPublicPropTypes<typeof paginationProps>;

const behavioralDefaults: PaginationDefaults = {
    firstIcon: '',
    prevIcon: '',
    nextIcon: '',
    lastIcon: '',
    firstLabel: 'First',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    lastLabel: 'Last',
};

export const paginationThemeDefaults: ComponentThemeDefinition<PaginationThemeClasses> = {
    classes: {
        root: 'vc-pagination',
        item: 'vc-pagination-item',
        link: 'vc-pagination-link',
        linkActive: 'active',
        ellipsis: 'vc-pagination-ellipsis',
    },
};

export default defineComponent({
    name: 'VCPagination',
    components: {
        PaginationEllipsis,
        PaginationFirst,
        PaginationLast,
        PaginationList,
        PaginationListItem,
        PaginationNext,
        PaginationPrev,
        PaginationRoot,
        VCIcon,
    },
    props: paginationProps,
    emits: ['load'],
    setup(props, { emit }) {
        const theme = useComponentTheme('pagination', props, paginationThemeDefaults);

        const defaults = useComponentDefaults('pagination', props, behavioralDefaults);

        const currentPage = computed(() => (
            props.total && props.limit ?
                calculatePage({ limit: props.limit, offset: props.offset }) :
                1
        ));

        const pageCount = computed(() => (
            props.total && props.limit ?
                calculatePagesTotal({ limit: props.limit, total: props.total }) :
                1
        ));

        const showStartControls = computed(() => !props.hideDisabled || currentPage.value > 1);
        const showEndControls = computed(() => !props.hideDisabled || currentPage.value < pageCount.value);

        const pageItemClass = (active: boolean): string | undefined => {
            const parts: string[] = [];
            if (theme.value.link) parts.push(theme.value.link);
            if (active && theme.value.linkActive) parts.push(theme.value.linkActive);
            return parts.length ? parts.join(' ') : undefined;
        };

        const ellipsisClass = computed<string | undefined>(() => {
            const parts: string[] = [];
            if (theme.value.link) parts.push(theme.value.link);
            if (theme.value.ellipsis) parts.push(theme.value.ellipsis);
            return parts.length ? parts.join(' ') : undefined;
        });

        const onPageUpdate = (newPage: number) => {
            if (props.busy || newPage === currentPage.value) return;
            const meta: PaginationMeta = {
                page: newPage,
                offset: calculateOffset({ page: newPage, limit: props.limit }),
                limit: props.limit,
                total: pageCount.value,
            };
            emit('load', meta);
        };

        return {
            theme,
            defaults,
            currentPage,
            showStartControls,
            showEndControls,
            pageItemClass,
            ellipsisClass,
            onPageUpdate,
        };
    },
});
</script>

<template>
    <PaginationRoot
        :as="tag"
        :total="total"
        :items-per-page="limit || 1"
        :sibling-count="1"
        :show-edges="true"
        :page="currentPage"
        :disabled="busy"
        :class="theme.root || undefined"
        @update:page="onPageUpdate"
    >
        <template #default="{ page: rekaPage }">
            <component
                :is="itemTag"
                v-if="showStartControls"
                :class="theme.item || undefined"
            >
                <PaginationFirst :class="theme.link || undefined">
                    <slot
                        v-if="$slots.first"
                        name="first"
                    />
                    <template v-else>
                        <VCIcon
                            v-if="defaults.firstIcon"
                            :name="defaults.firstIcon"
                        />
                        <span v-if="defaults.firstLabel">{{ defaults.firstLabel }}</span>
                    </template>
                </PaginationFirst>
            </component>
            <component
                :is="itemTag"
                v-if="showStartControls"
                :class="theme.item || undefined"
            >
                <PaginationPrev :class="theme.link || undefined">
                    <slot
                        v-if="$slots.prev"
                        name="prev"
                    />
                    <template v-else>
                        <VCIcon
                            v-if="defaults.prevIcon"
                            :name="defaults.prevIcon"
                        />
                        <span v-if="defaults.prevLabel">{{ defaults.prevLabel }}</span>
                    </template>
                </PaginationPrev>
            </component>
            <PaginationList
                v-slot="{ items }"
                as-child
            >
                <!-- One consistent root element (the itemTag) per
                     iteration. Switching between PaginationListItem and
                     PaginationEllipsis at the OUTER level (v-if/v-else on
                     the wrapper component) interacts badly with reka-ui's
                     Slot: Slot clones the "first non-comment child" and
                     when that child's type changes between renders Vue's
                     reconciliation can leak stale DOM from the previous
                     branch (reproducible by jumping page 1 → last page
                     and seeing duplicate page numbers). Keeping the
                     wrapper uniform and switching INSIDE keeps Slot
                     stable.

                     Stable per-item key: page items key by their value
                     (so "page 5" follows the same DOM node across renders
                     even when the visible window shifts); ellipses key by
                     iteration index (no stable identity). -->
                <component
                    :is="itemTag"
                    v-for="(item, idx) in items"
                    :key="item.type === 'page' ? `p${item.value}` : `e${idx}`"
                    :class="theme.item || undefined"
                >
                    <PaginationListItem
                        v-if="item.type === 'page'"
                        :value="item.value"
                        :class="pageItemClass(item.value === rekaPage)"
                    >
                        {{ item.value }}
                    </PaginationListItem>
                    <!-- Compose link + ellipsis classes so the ellipsis
                         inherits the button's size/border/spacing while
                         theme.ellipsis carries any ellipsis-specific
                         overrides (e.g. muted text, no hover). -->
                    <PaginationEllipsis
                        v-else
                        :class="ellipsisClass"
                    />
                </component>
            </PaginationList>
            <component
                :is="itemTag"
                v-if="showEndControls"
                :class="theme.item || undefined"
            >
                <PaginationNext :class="theme.link || undefined">
                    <slot
                        v-if="$slots.next"
                        name="next"
                    />
                    <template v-else>
                        <VCIcon
                            v-if="defaults.nextIcon"
                            :name="defaults.nextIcon"
                        />
                        <span v-if="defaults.nextLabel">{{ defaults.nextLabel }}</span>
                    </template>
                </PaginationNext>
            </component>
            <component
                :is="itemTag"
                v-if="showEndControls"
                :class="theme.item || undefined"
            >
                <PaginationLast :class="theme.link || undefined">
                    <slot
                        v-if="$slots.last"
                        name="last"
                    />
                    <template v-else>
                        <VCIcon
                            v-if="defaults.lastIcon"
                            :name="defaults.lastIcon"
                        />
                        <span v-if="defaults.lastLabel">{{ defaults.lastLabel }}</span>
                    </template>
                </PaginationLast>
            </component>
        </template>
    </PaginationRoot>
</template>
