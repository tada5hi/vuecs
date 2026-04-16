import type { VNodeClass } from '@vuecs/core';
import {
    evaluateFnOrValue,
    hasNormalizedSlot,
    hasOwnProperty,
    isObject,
    normalizeSlot,
} from '@vuecs/core';
import { merge } from 'smob';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import { SlotName } from '../constants';
import { buildListBaseSlotProps } from '../list-base';
import type { ListEventFn } from '../type';
import { normalizeListItemOptions } from './normalize';
import type { ListItemBuildOptionsInput, ListItemChildren, ListItemSlotProps } from './type';

function maybeWrapContent(input: VNodeChild, ctx: {
    wrap: boolean,
    class: VNodeClass,
    tag: string
}) {
    if (!ctx.wrap) {
        return input;
    }

    return h(ctx.tag, { class: ctx.class }, [input]);
}

export function buildListItem<T, M = any>(
    input: ListItemBuildOptionsInput<T, M>,
) : VNodeChild {
    const options = normalizeListItemOptions(input);

    if (process.env.NODE_ENV !== 'production') {
        if (!options.actions && input.actionsContent) {
            console.warn('[vuecs/list-controls] actionsContent is provided but actions is disabled. Set actions: true or remove actionsContent.');
        }
        if (!options.icon && input.iconClass && (Array.isArray(input.iconClass) ? input.iconClass.length > 0 : input.iconClass)) {
            console.warn('[vuecs/list-controls] iconClass is provided but icon is disabled. Set icon: true or remove iconClass.');
        }
        if (!options.text && input.textContent) {
            console.warn('[vuecs/list-controls] textContent is provided but text is disabled. Set text: true or remove textContent.');
        }
    }

    const overrideUpdatedFn = (fn: ListEventFn<T>, item?: T) : ListEventFn<T | undefined> => {
        if (typeof item === 'undefined') {
            return fn(options.data);
        }

        if (
            isObject(item) &&
            isObject(options.data)
        ) {
            options.data = merge(item, options.data) as T;
        } else {
            options.data = item;
        }

        return fn(options.data);
    };

    let slotProps : ListItemSlotProps<T>;
    if (options.slotPropsBuilt) {
        const {
            updated,
            deleted,
            ...original
        } = options.slotProps;

        slotProps = {
            ...original,
            data: options.data,
            index: options.index,
        };

        if (updated) {
            slotProps.updated = (item?: T) => overrideUpdatedFn(updated, item);
        }

        if (deleted) {
            slotProps.deleted = (item?: T) => deleted(item || options.data);
        }
    } else {
        const {
            updated,
            deleted,
            ...original
        } = buildListBaseSlotProps<T, M>({
            ...options,
            data: options.data,
        });

        slotProps = {
            ...original,
            data: options.data,
            index: options.index,
        };

        if (updated) {
            slotProps.updated = (item?: T) => overrideUpdatedFn(updated, item);
        }

        if (deleted) {
            slotProps.deleted = (item?: T) => deleted(item || options.data);
        }
    }

    const renderContent = (content?: VNodeChild) : VNodeChild => h(
        options.tag,
        mergeProps({ key: options.index }, { class: options.class }, options.props),
        [content || []],
    );

    const children : ListItemChildren = {};

    if (hasNormalizedSlot(SlotName.ITEM_DEFAULT, options.slotItems)) {
        children.slot = normalizeSlot(SlotName.ITEM_DEFAULT, slotProps, options.slotItems);
    } else if (hasNormalizedSlot(SlotName.ITEM, options.slotItems)) {
        children.slot = normalizeSlot(SlotName.ITEM, slotProps, options.slotItems);
    } else {
        if (options.icon) {
            children.icon = maybeWrapContent(
                h(options.iconTag, mergeProps({ class: options.iconClass }, options.iconProps)),
                {
                    wrap: options.iconWrapper,
                    tag: options.iconWrapperTag,
                    class: options.iconWrapperClass,
                },
            );
        }

        if (options.text) {
            let text: VNodeChild | undefined;

            if (options.textContent) {
                text = evaluateFnOrValue(options.textContent, options.data, slotProps);
            } else if (
                options.textPropName &&
                isObject(options.data) &&
                hasOwnProperty(options.data, options.textPropName)
            ) {
                text = options.data[options.textPropName] as VNodeChild;
            }

            if (text) {
                children.text = maybeWrapContent(text, {
                    wrap: options.textWrapper,
                    tag: options.textWrapperTag,
                    class: options.textWrapperClass,
                });
            }
        }

        if (options.actions) {
            let actions : VNodeChild | undefined;

            if (hasNormalizedSlot(SlotName.ITEM_ACTIONS, options.slotItems)) {
                actions = normalizeSlot(SlotName.ITEM_ACTIONS, slotProps, options.slotItems);
            } else if (options.actionsContent) {
                actions = evaluateFnOrValue(options.actionsContent, options.data, slotProps);
            }

            if (actions) {
                children.actions = maybeWrapContent(actions, {
                    wrap: options.actionsWrapper,
                    tag: options.actionsWrapperTag,
                    class: options.actionsWrapperClass,
                });
            }

            if (hasNormalizedSlot(SlotName.ITEM_ACTIONS_EXTRA, options.slotItems)) {
                const actionsExtra = normalizeSlot(SlotName.ITEM_ACTIONS_EXTRA, slotProps, options.slotItems);
                children.actionsExtra = maybeWrapContent(actionsExtra, {
                    wrap: options.actionsExtraWrapper,
                    tag: options.actionsExtraWrapperTag,
                    class: options.actionsExtraWrapperClass,
                });
            }
        }
    }

    if (options.content) {
        return renderContent(evaluateFnOrValue(options.content, options.data, slotProps, children));
    }

    if (children.slot) {
        return renderContent(children.slot);
    }

    const content : VNodeChild = [
        ...(children.icon ? [children.icon] : []) as VNodeArrayChildren,
        ...(children.text ? [children.text] : []) as VNodeArrayChildren,
        ...(children.actions ? [children.actions] : []) as VNodeArrayChildren,
        ...(children.actionsExtra ? [children.actionsExtra] : []) as VNodeArrayChildren,
    ];

    return renderContent(content);
}
