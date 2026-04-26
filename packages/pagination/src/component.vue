<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
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
import type { PropType } from 'vue';
import type { PaginationMeta, PaginationThemeClasses } from './type';
import {
    calculateOffset,
    calculatePage,
    calculatePagesTotal,
} from './utils';

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
    },
    props: {
        total: { type: Number, default: 0 },
        limit: { type: Number, default: 0 },
        offset: { type: Number, default: 0 },
        busy: { type: Boolean, default: false },
        tag: { type: String, default: 'ul' },
        itemTag: { type: String, default: 'li' },
        iconTag: { type: String, default: 'i' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<PaginationThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
        // When true, edge controls (First/Prev at page 1, Next/Last at the
        // last page) are unrendered instead of rendered-disabled. Defaults
        // false so consumers see a stable button row across pages —
        // matching modern UI library conventions and Reka's own defaults.
        // Does NOT apply to the `busy` state (loading should not make
        // pagination disappear).
        hideDisabled: { type: Boolean, default: false },
    },
    emits: ['load'],
    setup(props, { emit }) {
        const theme = useComponentTheme('pagination', props, {
            classes: {
                root: 'vc-pagination',
                item: 'vc-pagination-item',
                link: 'vc-pagination-link',
                linkActive: 'active',
                ellipsis: 'vc-pagination-ellipsis',
                prevIcon: '',
                nextIcon: '',
                firstIcon: '',
                lastIcon: '',
            },
        });

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
                    <component
                        :is="iconTag"
                        v-if="theme.firstIcon"
                        :class="theme.firstIcon"
                    />
                    <template v-else-if="theme.prevIcon">
                        <component
                            :is="iconTag"
                            :class="theme.prevIcon"
                        />
                        <component
                            :is="iconTag"
                            :class="theme.prevIcon"
                        />
                    </template>
                    <template v-else>
                        &laquo;
                    </template>
                </PaginationFirst>
            </component>
            <component
                :is="itemTag"
                v-if="showStartControls"
                :class="theme.item || undefined"
            >
                <PaginationPrev :class="theme.link || undefined">
                    <component
                        :is="iconTag"
                        v-if="theme.prevIcon"
                        :class="theme.prevIcon"
                    />
                    <template v-else>
                        &lsaquo;
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
                    <component
                        :is="iconTag"
                        v-if="theme.nextIcon"
                        :class="theme.nextIcon"
                    />
                    <template v-else>
                        &rsaquo;
                    </template>
                </PaginationNext>
            </component>
            <component
                :is="itemTag"
                v-if="showEndControls"
                :class="theme.item || undefined"
            >
                <PaginationLast :class="theme.link || undefined">
                    <component
                        :is="iconTag"
                        v-if="theme.lastIcon"
                        :class="theme.lastIcon"
                    />
                    <template v-else-if="theme.nextIcon">
                        <component
                            :is="iconTag"
                            :class="theme.nextIcon"
                        />
                        <component
                            :is="iconTag"
                            :class="theme.nextIcon"
                        />
                    </template>
                    <template v-else>
                        &raquo;
                    </template>
                </PaginationLast>
            </component>
        </template>
    </PaginationRoot>
</template>
