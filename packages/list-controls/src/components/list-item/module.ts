import {
    evaluateFnOrValue,
    hasOwnProperty,
    isObject,
    useComponentTheme,
} from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { merge } from 'smob';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    toRef,
} from 'vue';
import type {
    ListEventFn,
    ListItemId,
    ListItemKey,
    ListLoadFn,
} from '../../type';
import type { 
    ListBaseSlotProps, 
    ListItemChildren, 
    ListItemSlotProps, 
    ListItemThemeClasses, 
} from '../type';

const themeDefaults = {
    classes: {
        root: 'vc-list-item',
        icon: '',
        iconWrapper: '',
        textWrapper: '',
        actionsWrapper: '',
        actionsExtraWrapper: '',
    },
};

function maybeWrapContent(input: VNodeChild, wrap: boolean, tag: string, className: string) {
    if (!wrap) {
        return input;
    }
    return h(tag, { class: className || undefined }, [input]);
}

export const VCListItem = defineComponent({
    name: 'VCListItem',
    props: {
        data: { type: null as unknown as PropType<any>, required: true },
        index: { type: Number, default: undefined },
        tag: { type: String, default: 'li' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListItemThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },

        // Icon options
        icon: { type: Boolean, default: true },
        iconTag: { type: String, default: 'i' },
        iconWrapper: { type: Boolean, default: true },
        iconWrapperTag: { type: String, default: 'div' },

        // Text options
        text: { type: Boolean, default: true },
        textContent: {
            type: [String, Function] as PropType<VNodeChild | ((item: any, props: ListItemSlotProps<any>) => VNodeChild)>,
            default: undefined,
        },
        textPropName: { type: String, default: 'name' },
        textWrapper: { type: Boolean, default: true },
        textWrapperTag: { type: String, default: 'div' },

        // Actions options
        actions: { type: Boolean, default: true },
        actionsWrapper: { type: Boolean, default: true },
        actionsWrapperTag: { type: String, default: 'div' },

        // Extra actions options
        actionsExtraWrapper: { type: Boolean, default: true },
        actionsExtraWrapperTag: { type: String, default: 'div' },

        // Passed from parent list
        busy: { type: Boolean, default: false },
        total: { type: Number, default: undefined },
        load: { type: Function as PropType<ListLoadFn>, default: undefined },
        meta: { type: Object, default: undefined },
        itemId: { type: Function as PropType<ListItemId<any>>, default: undefined },
        itemKey: { type: [String, Function] as PropType<ListItemKey<any>>, default: undefined },
        onCreated: { type: Function as PropType<ListEventFn<any>>, default: undefined },
        onDeleted: { type: Function as PropType<ListEventFn<any>>, default: undefined },
        onUpdated: { type: Function as PropType<ListEventFn<any>>, default: undefined },

        // Pre-built slot props from parent (internal)
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: undefined },
    },
    slots: Object as SlotsType<{
        default?: ListItemSlotProps<any>;
        actions?: ListItemSlotProps<any>;
        actionsExtra?: ListItemSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listItem', toRef(props, 'themeClass'), themeDefaults, toRef(props, 'themeVariant'));

        return () => {
            let itemData = props.data;

            const overrideUpdatedFn = (fn: ListEventFn<any>, item?: any): any => {
                if (typeof item === 'undefined') {
                    return fn(itemData);
                }

                if (isObject(item) && isObject(itemData)) {
                    itemData = merge(item, itemData);
                } else {
                    itemData = item;
                }

                return fn(itemData);
            };

            // Build slot props
            let slotPropsResolved: ListItemSlotProps<any>;
            if (props.slotProps) {
                const {
                    updated, 
                    deleted, 
                    ...original 
                } = props.slotProps;
                slotPropsResolved = {
                    ...original,
                    data: itemData,
                    index: props.index,
                };
                if (updated) {
                    slotPropsResolved.updated = (item?: any) => overrideUpdatedFn(updated, item);
                }
                if (deleted) {
                    slotPropsResolved.deleted = (item?: any) => deleted(item || itemData);
                }
            } else {
                slotPropsResolved = {
                    data: itemData,
                    index: props.index,
                    ...(props.busy ? { busy: props.busy } : {}),
                    ...(props.meta ? { meta: props.meta } : {}),
                    ...(props.total ? { total: props.total } : {}),
                    ...(props.load ? { load: props.load } : {}),
                };
                if (props.onUpdated) {
                    const fn = props.onUpdated;
                    slotPropsResolved.updated = (item?: any) => overrideUpdatedFn(fn, item);
                }
                if (props.onDeleted) {
                    const fn = props.onDeleted;
                    slotPropsResolved.deleted = (item?: any) => fn(item || itemData);
                }
            }

            const children: ListItemChildren = {};
            const resolved = theme.value;

            if (slots.default) {
                children.slot = slots.default(slotPropsResolved);
            } else {
                if (props.icon) {
                    children.icon = maybeWrapContent(
                        h(props.iconTag, { class: resolved.icon || undefined }),
                        props.iconWrapper,
                        props.iconWrapperTag,
                        resolved.iconWrapper,
                    );
                }

                if (props.text) {
                    let textNode: VNodeChild | undefined;

                    if (props.textContent) {
                        textNode = evaluateFnOrValue(props.textContent, itemData, slotPropsResolved);
                    } else if (
                        props.textPropName &&
                        isObject(itemData) &&
                        hasOwnProperty(itemData, props.textPropName)
                    ) {
                        textNode = itemData[props.textPropName] as VNodeChild;
                    }

                    if (textNode) {
                        children.text = maybeWrapContent(
                            textNode,
                            props.textWrapper,
                            props.textWrapperTag,
                            resolved.textWrapper,
                        );
                    }
                }

                if (props.actions) {
                    let actionsNode: VNodeChild | undefined;

                    if (slots.actions) {
                        actionsNode = slots.actions(slotPropsResolved);
                    }

                    if (actionsNode) {
                        children.actions = maybeWrapContent(
                            actionsNode,
                            props.actionsWrapper,
                            props.actionsWrapperTag,
                            resolved.actionsWrapper,
                        );
                    }

                    if (slots.actionsExtra) {
                        const actionsExtra = slots.actionsExtra(slotPropsResolved);
                        children.actionsExtra = maybeWrapContent(
                            actionsExtra,
                            props.actionsExtraWrapper,
                            props.actionsExtraWrapperTag,
                            resolved.actionsExtraWrapper,
                        );
                    }
                }
            }

            const content: VNodeChild = children.slot || [
                ...(children.icon ? [children.icon] : []),
                ...(children.text ? [children.text] : []),
                ...(children.actions ? [children.actions] : []),
                ...(children.actionsExtra ? [children.actionsExtra] : []),
            ];

            return h(
                props.tag,
                { class: resolved.root },
                [content],
            );
        };
    },
});
