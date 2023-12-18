/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from '@vuecs/core';
import type {
    DefineComponent, PropType, VNodeProps, VNodeTypes,
} from 'vue';
import {
    computed,
    defineComponent,
    h,
    resolveDynamicComponent,
    toRef,
} from 'vue';
import type { LinkQuery } from './types';

export const VCLink = defineComponent({
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        href: {
            type: String,
            default: undefined,
        },
        prefetch: {
            type: Boolean,
            default: true,
        },
        target: {
            type: String,
            default: '_self',
        },
        to: {
            type: [String, Object] as PropType<string | Record<string, any>>,
            default: undefined,
        },
        query: {
            type: Object as PropType<LinkQuery>,
        },
    },
    emits: ['click', 'clicked'],
    setup(props, { emit, slots }) {
        const query = toRef(props, 'query');

        const routerLink = resolveDynamicComponent('RouterLink');
        const nuxtLink = resolveDynamicComponent('NuxtLink');

        const computedTag = computed(() => {
            const hasRouter = typeof routerLink !== 'string';

            if (!hasRouter || props.disabled || !props.to) {
                return 'a';
            }

            if (typeof nuxtLink !== 'string') {
                return 'nuxt-link';
            }

            return 'router-link';
        });

        const extendLinkWithQuery = (link: string, query: Record<string, any>) => {
            const keys = Object.keys(query);
            if (keys.length === 0) {
                return link;
            }

            let searchParams : URLSearchParams;
            if (link.includes('?')) {
                const url = new URL(link, 'http://localhost:3000');
                for (let i = 0; i < keys.length; i++) {
                    url.searchParams.set(keys[i], query[keys[i]]);
                }

                searchParams = url.searchParams;

                [link] = link.split('?');
            } else {
                searchParams = new URLSearchParams(query);
            }

            return `${link}?${searchParams.toString()}`;
        };

        const isRouterLink = computed(() => computedTag.value !== 'a');

        const computedHref = computed(() => {
            if (props.href) {
                if (
                    props.query &&
                    query.value
                ) {
                    return extendLinkWithQuery(props.href, query.value);
                }

                return props.href;
            }

            if (isRouterLink.value) {
                return null;
            }

            return '#';
        });

        const computedProps = computed(() => {
            if (!isRouterLink.value) {
                return {};
            }

            let to : Record<string, any> | string | undefined;

            if (
                props.query &&
                query.value
            ) {
                if (typeof props.to === 'string') {
                    to = extendLinkWithQuery(props.to, query.value);
                } else if (isObject(props.to)) {
                    to = {
                        ...props.to,
                        query: {
                            ...query.value,
                            ...(props.to.query ? { ...props.to.query } : {}),
                        },
                    };
                }
            } else {
                to = props.to;
            }

            return {
                ...(to ? { to } : {}),
                ...(typeof props.prefetch !== 'undefined' ? { prefetch: props.prefetch } : {}),
            };
        });

        const computedAttrs = computed(() => ({
            ...(props.href ? { href: props.href } : {}),
            ...(isRouterLink.value ? {} : {
                target: props.target,
            }),
        }));

        const buildVNodeProps = () => {
            const onClick = (event: Record<string, any>) => {
                const isEvent: boolean = typeof event.preventDefault !== 'undefined' &&
                    typeof event.stopPropagation !== 'undefined' &&
                    typeof event.stopImmediatePropagation !== 'undefined';

                if (isEvent && props.disabled) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                } else {
                    if (isRouterLink.value) {
                        emit('click', event);
                    }

                    emit('clicked', event);
                }

                if (
                    isEvent &&
                    !isRouterLink.value &&
                    computedHref.value === '#'
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }
            };

            const vNodeProps: VNodeProps & Record<string, any> = {
                class: {
                    active: props.active,
                    disabled: props.disabled,
                },
                ...computedAttrs.value,
                ...computedProps.value,
                onClick,
            };

            return vNodeProps;
        };

        let component : string | VNodeTypes;

        switch (computedTag.value) {
            case 'router-link':
                component = routerLink;
                break;
            case 'nuxt-link':
                component = nuxtLink;
                break;
            default:
                component = 'a';
        }

        if (typeof component === 'string') {
            return () => h(
                component as string,
                buildVNodeProps(),
                [
                    (typeof slots.default === 'function' ? slots.default() : []),
                ],
            );
        }

        return () => h(
            component as DefineComponent,
            buildVNodeProps(),
            {
                default: () => (typeof slots.default === 'function' ? slots.default() : []),
            },
        );
    },
});
