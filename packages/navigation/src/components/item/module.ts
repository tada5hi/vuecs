/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { LinkProperties } from '@vuecs/link';
import { VCLink } from '@vuecs/link';
import type { PropType, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    resolveComponent,
    toRef,
} from 'vue';
import { injectNavigationManager } from '../../manager';
import type { NavigationItemNormalized } from '../../types';
import { buildComponentOptions, isAbsoluteURL } from '../../helpers';
import { ElementType, SlotName } from '../../constants';

export const VCNavItem = defineComponent({
    props: {
        data: {
            type: Object as PropType<NavigationItemNormalized>,
            required: true,
        },
    },
    setup(props, { slots }) {
        const itemsNode = resolveComponent('VCNavItems');

        const options = buildComponentOptions();
        const manager = injectNavigationManager();

        const data = toRef(props, 'data');

        const select = async (
            value: NavigationItemNormalized,
        ) => {
            await manager.select(data.value.level, value);
        };

        const toggle = async (
            value: NavigationItemNormalized,
        ) => {
            await manager.toggle(data.value.level, value);
        };

        return () => {
            const buildItem = () : VNodeChild => {
                // type: separator
                if (data.value.type === ElementType.SEPARATOR) {
                    const hasSlot = hasNormalizedSlot(SlotName.SEPARATOR, slots);
                    if (hasSlot) {
                        return normalizeSlot(SlotName.SEPARATOR, {
                            data: data.value,
                        }, slots);
                    }

                    return h(options.separatorTag, {
                        class: options.separatorClass,
                    }, data.value.name);
                }

                // type: group
                if (
                    !data.value.children ||
                    data.value.children.length === 0
                ) {
                    const hasSlot = hasNormalizedSlot(SlotName.LINK, slots);
                    if (hasSlot) {
                        return normalizeSlot(SlotName.LINK, {
                            data: data.value,
                            select,
                            isActive: data.value.active,
                        }, slots);
                    }
                    const linkProps : LinkProperties = {
                        active: data.value.active,
                        disabled: false,
                        prefetch: true,
                    };

                    if (data.value.url) {
                        if (
                            isAbsoluteURL(data.value.url) ||
                                        data.value.url.startsWith('#')
                        ) {
                            linkProps.href = data.value.url;
                            if (data.value.urlTarget) {
                                linkProps.target = data.value.urlTarget;
                            }
                        } else {
                            linkProps.to = data.value.url;
                        }
                    }

                    return h(VCLink, {
                        class: [
                            options.linkClass,
                            (data.value.url &&
                                    data.value.url === '/' ?
                                [options.linkRootClass] :
                                []
                            ),
                        ],
                        ...linkProps,
                        onClicked() {
                            if (!data.value.url) {
                                return select.call(null, data.value);
                            }

                            return undefined;
                        },
                        onClick() {
                            return select.call(null, data.value);
                        },
                    }, {
                        default: () => [
                            ...(data.value.icon ?
                                [h('i', { class: data.value.icon })] :
                                []
                            ),
                            h(
                                options.linkTextTag,
                                { class: options.linkTextClass },
                                [data.value.name],
                            ),
                        ],
                    });
                }

                if (hasNormalizedSlot(SlotName.SUB, slots)) {
                    return normalizeSlot(SlotName.SUB, {
                        data: data.value,
                        select,
                        toggle,
                    }, slots);
                }

                let title : VNodeChild;
                if (hasNormalizedSlot(SlotName.SUB_TITLE, slots)) {
                    title = normalizeSlot(SlotName.SUB_TITLE, {
                        data: data.value,
                        select,
                        toggle,
                    });
                } else {
                    title = h('div', {
                        class: options.subGroupTitleClass,
                        onClick($event: any) {
                            $event.preventDefault();

                            return toggle(data.value);
                        },
                    }, [[
                        ...(data.value.icon ?
                            [h('i', { class: data.value.icon })] :
                            []
                        ),
                        h(options.linkTextTag, {
                            class: options.linkTextClass,
                        }, [
                            data.value.name,
                        ]),
                    ]]);
                }

                if (!data.value.displayChildren) {
                    return title;
                }

                let vNodes : VNodeChild;

                if (hasNormalizedSlot(SlotName.SUB_ITEMS, slots)) {
                    vNodes = normalizeSlot(SlotName.SUB_ITEMS, {
                        data: data.value,
                        select,
                        toggle,
                    });
                } else {
                    vNodes = h(itemsNode, {
                        level: data.value.level,
                        data: data.value.children,
                    });
                }

                return [
                    title,
                    vNodes,
                ];
            };

            return h(options.itemTag, {
                class: [
                    options.itemClass,
                    {
                        active: data.value.active || data.value.displayChildren,
                    },
                ],
            }, [
                buildItem(),
            ]);
        };
    },
});
