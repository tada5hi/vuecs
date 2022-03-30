/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement, VNode } from 'vue';
import { ListItemToggleActionContext } from './type';

export function buildListItemToggleAction<
    T extends Record<string, any>,
>(
    instance: Record<string, any>,
    h: CreateElement,
    context: ListItemToggleActionContext<T>,
) : VNode {
    const itemPropName = context.itemPropName || 'id';

    return h('button', {
        attrs: {
            disabled: context.busy,
        },
        class: {
            'btn-dark': instance[context.propName] !== context.item[itemPropName],
            'btn-warning': instance[context.propName] === context.item[itemPropName],
        },
        staticClass: 'btn btn-xs',
        on: {
            click($event: any) {
                $event.preventDefault();

                if (Array.isArray(instance[context.propName])) {
                    const index = instance[context.propName].indexOf(context.item[itemPropName]);
                    if (index === -1) {
                        instance[context.propName].push(context.item[itemPropName]);
                    } else {
                        instance[context.propName].splice(index, 1);
                    }
                } else if (instance[context.propName] === context.item[itemPropName]) {
                    instance[context.propName] = null;
                } else {
                    instance[context.propName] = context.item[itemPropName];
                }
            },
        },
    }, [
        h('i', {
            class: {
                'fa fa-plus': instance[context.propName] !== context.item[itemPropName],
                'fa fa-minus': instance[context.propName] === context.item[itemPropName],
            },
        }),
    ]);
}
