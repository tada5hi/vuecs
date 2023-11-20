/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { DefineComponent, VNodeProps, VNodeTypes } from 'vue';
import {
    computed, defineComponent, h, resolveDynamicComponent,
} from 'vue';

export const VLLink = defineComponent({
    name: 'VLLink',
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
            type: String,
            default: undefined,
        },
    },
    emits: ['click', 'clicked'],
    setup(props, { emit, slots }) {
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

        const isRouterLink = computed(() => computedTag.value !== 'a');

        const computedHref = computed(() => {
            if (props.href) {
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

            return {
                ...(props.to ? { to: props.to } : {}),
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
