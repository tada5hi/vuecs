import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, SlotsType, VNodeArrayChildren } from 'vue';
import { defineComponent, h, toRef } from 'vue';
import type {
    ListEventFn,
    ListItemId,
    ListItemKey,
    ListLoadFn,
} from '../../type';
import { buildListBaseSlotProps } from '../list-base';
import type {
    ListBodyThemeClasses,
    ListFooterThemeClasses,
    ListHeaderThemeClasses,
    ListItemThemeClasses,
    ListLoadingThemeClasses,
    ListNoMoreThemeClasses,
    ListSlotProps,
    ListThemeClasses,
} from '../type';
import { VCListBody } from '../list-body/module';
import { VCListFooter } from '../list-footer/module';
import { VCListHeader } from '../list-header/module';
import { VCListLoading } from '../list-loading/module';
import { VCListNoMore } from '../list-no-more/module';

const themeDefaults: ListThemeClasses = { root: 'vc-list' };

export const VCList = defineComponent({
    name: 'VCList',
    props: {
        data: { type: Array as PropType<any[]>, default: () => [] },
        tag: { type: String, default: 'div' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListThemeClasses>>, default: undefined },

        // Sub-component themes
        headerThemeClass: { type: Object as PropType<ThemeClassesOverride<ListHeaderThemeClasses>>, default: undefined },
        footerThemeClass: { type: Object as PropType<ThemeClassesOverride<ListFooterThemeClasses>>, default: undefined },
        bodyThemeClass: { type: Object as PropType<ThemeClassesOverride<ListBodyThemeClasses>>, default: undefined },
        itemThemeClass: { type: Object as PropType<ThemeClassesOverride<ListItemThemeClasses>>, default: undefined },
        loadingThemeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
        noMoreThemeClass: { type: Object as PropType<ThemeClassesOverride<ListNoMoreThemeClasses>>, default: undefined },

        // Section visibility
        header: { type: Boolean, default: true },
        footer: { type: Boolean, default: true },
        body: { type: Boolean, default: true },
        loading: { type: Boolean, default: true },
        noMore: { type: Boolean, default: true },

        // List state
        busy: { type: Boolean, default: false },
        total: { type: Number, default: undefined },
        load: { type: Function as PropType<ListLoadFn>, default: undefined },
        meta: { type: Object, default: undefined },

        // Item matching
        itemId: { type: Function as PropType<ListItemId<any>>, default: undefined },
        itemKey: { type: [String, Function] as PropType<ListItemKey<any>>, default: undefined },

        // Item display options
        itemTag: { type: String, default: 'li' },
        itemIcon: { type: Boolean, default: true },
        itemText: { type: Boolean, default: true },
        itemTextPropName: { type: String, default: 'name' },
        itemActions: { type: Boolean, default: true },

        // No more content
        noMoreContent: { type: String, default: 'No more items available...' },

        // Events
        onCreated: { type: Function as PropType<ListEventFn<any>>, default: undefined },
        onDeleted: { type: Function as PropType<ListEventFn<any>>, default: undefined },
        onUpdated: { type: Function as PropType<ListEventFn<any>>, default: undefined },
    },
    slots: Object as SlotsType<{
        default?: ListSlotProps<any>;
        header?: any;
        footer?: any;
        body?: any;
        loading?: any;
        noMore?: any;
        item?: any;
        itemActions?: any;
        itemActionsExtra?: any;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('list', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const total = props.total ?? props.data.length;

            const slotPropsBase = buildListBaseSlotProps({
                busy: props.busy,
                total,
                load: props.load,
                meta: props.meta,
                data: props.data,
                itemId: props.itemId,
                itemKey: props.itemKey,
                onCreated: props.onCreated,
                onDeleted: props.onDeleted,
                onUpdated: props.onUpdated,
            });

            // Default slot bypasses all structure
            if (slots.default) {
                const listSlotProps: ListSlotProps<any> = {
                    ...slotPropsBase,
                    data: props.data,
                };
                return slots.default(listSlotProps);
            }

            const children: VNodeArrayChildren = [];

            if (props.header) {
                children.push(h(VCListHeader, {
                    theme: props.headerThemeClass,
                    slotProps: slotPropsBase,
                }, slots.header ? { default: slots.header } : {}));
            }

            if (props.body) {
                children.push(h(VCListBody, {
                    data: props.data,
                    busy: props.busy,
                    total,
                    load: props.load,
                    meta: props.meta,
                    itemId: props.itemId,
                    itemKey: props.itemKey,
                    onCreated: props.onCreated,
                    onDeleted: props.onDeleted,
                    onUpdated: props.onUpdated,
                    theme: props.bodyThemeClass,
                    itemThemeClass: props.itemThemeClass,
                    itemTag: props.itemTag,
                    itemIcon: props.itemIcon,
                    itemText: props.itemText,
                    itemTextPropName: props.itemTextPropName,
                    itemActions: props.itemActions,
                    slotProps: slotPropsBase,
                }, {
                    ...(slots.body ? { default: slots.body } : {}),
                    ...(slots.item ? { item: slots.item } : {}),
                    ...(slots.itemActions ? { itemActions: slots.itemActions } : {}),
                    ...(slots.itemActionsExtra ? { itemActionsExtra: slots.itemActionsExtra } : {}),
                }));
            }

            if (props.loading) {
                children.push(h(VCListLoading, {
                    busy: props.busy,
                    theme: props.loadingThemeClass,
                    slotProps: slotPropsBase,
                }, slots.loading ? { default: slots.loading } : {}));
            }

            if (props.noMore) {
                children.push(h(VCListNoMore, {
                    busy: props.busy,
                    total,
                    meta: props.meta,
                    content: props.noMoreContent,
                    theme: props.noMoreThemeClass,
                    slotProps: slotPropsBase,
                }, slots.noMore ? { default: slots.noMore } : {}));
            }

            if (props.footer) {
                children.push(h(VCListFooter, {
                    theme: props.footerThemeClass,
                    slotProps: slotPropsBase,
                }, slots.footer ? { default: slots.footer } : {}));
            }

            return h(
                props.tag,
                { class: theme.value.root },
                children,
            );
        };
    },
});
