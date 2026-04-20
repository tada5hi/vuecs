import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, h, toRef } from 'vue';
import type { 
    ListBaseSlotProps, 
    ListBodySlotProps, 
    ListBodyThemeClasses, 
    ListItemThemeClasses,  
} from '../type';
import type { 
    ListEventFn, 
    ListItemId, 
    ListItemKey, 
    ListLoadFn, 
} from '../../type';
import { VCListItem } from '../list-item/module';

const themeDefaults: ListBodyThemeClasses = { root: 'vc-list-body' };

export const VCListBody = defineComponent({
    name: 'VCListBody',
    props: {
        data: { type: Array as PropType<any[]>, default: () => [] },
        tag: { type: String, default: 'ul' },
        busy: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListBodyThemeClasses>>, default: undefined },
        itemThemeClass: { type: Object as PropType<ThemeClassesOverride<ListItemThemeClasses>>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: undefined },
        // Item props passthrough
        itemTag: { type: String, default: 'li' },
        itemIcon: { type: Boolean, default: true },
        itemText: { type: Boolean, default: true },
        itemTextPropName: { type: String, default: 'name' },
        itemActions: { type: Boolean, default: true },
        // List base props
        total: { type: Number, default: undefined },
        load: { type: Function as PropType<ListLoadFn>, default: undefined },
        meta: { type: Object, default: undefined },
        itemId: { type: Function as PropType<ListItemId<any>>, default: undefined },
        itemKey: { type: [String, Function] as PropType<ListItemKey<any>>, default: undefined },
        onCreated: { type: Function as PropType<ListEventFn<any>>, default: undefined },
        onDeleted: { type: Function as PropType<ListEventFn<any>>, default: undefined },
        onUpdated: { type: Function as PropType<ListEventFn<any>>, default: undefined },
    },
    slots: Object as SlotsType<{
        default?: ListBodySlotProps<any>;
        item?: any;
        itemActions?: any;
        itemActionsExtra?: any;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listBody', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const bodySlotProps: ListBodySlotProps<any> = {
                data: props.data,
                ...(props.slotProps || {}),
            };

            if (slots.default) {
                return h(
                    props.tag,
                    { class: theme.value.root },
                    slots.default(bodySlotProps),
                );
            }

            if (props.data.length === 0) {
                return [];
            }

            return h(
                props.tag,
                { class: theme.value.root },
                props.data.map((item: any, index: number) => h(VCListItem, {
                    key: index,
                    data: item,
                    index,
                    tag: props.itemTag,
                    theme: props.itemThemeClass,
                    icon: props.itemIcon,
                    text: props.itemText,
                    textPropName: props.itemTextPropName,
                    actions: props.itemActions,
                    busy: props.busy,
                    total: props.total,
                    load: props.load,
                    meta: props.meta,
                    itemId: props.itemId,
                    itemKey: props.itemKey,
                    onCreated: props.onCreated,
                    onDeleted: props.onDeleted,
                    onUpdated: props.onUpdated,
                    slotProps: props.slotProps,
                }, {
                    ...(slots.item ? { default: slots.item } : {}),
                    ...(slots.itemActions ? { actions: slots.itemActions } : {}),
                    ...(slots.itemActionsExtra ? { actionsExtra: slots.itemActionsExtra } : {}),
                })),
            );
        };
    },
});
