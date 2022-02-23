/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { CreateElement, VNode } from 'vue';
import { hasOwnProperty } from '../utils';

export type NavigationLinkProperties = {
    active?: boolean,
    disabled?: boolean,
    href?: string,
    prefetch?: boolean,
    target?: string,
    to?: string,
    [key: string]: any
};

export const NavigationLink = Vue.extend<any, any, any, NavigationLinkProperties>({
    name: 'NavigationLink',
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
    computed: {
        computedTag() {
            const hasRouter = !!this.$router;
            if (!hasRouter || (hasRouter && (this.disabled || !this.to))) {
                return 'a';
            }

            return this.$nuxt ? 'nuxt-link' : 'router-link';
        },
        computedHref() {
            if (this.href) {
                return this.href;
            }

            if (this.isRouterLink) {
                return null;
            }

            return '#';
        },
        computedProps() {
            if (!this.isRouterLink) {
                return {};
            }

            return {
                ...(this.to ? { to: this.to } : {}),
                ...(typeof this.prefetch !== 'undefined' ? { prefetch: this.prefetch } : {}),
            };
        },
        computedAttrs() {
            return {
                ...(this.href ? { href: this.href } : {}),
                ...(this.isRouterLink ? {} : {
                    target: this.target,
                }),
            };
        },
        isRouterLink() {
            return this.computedTag !== 'a';
        },
    },
    methods: {
        onClick(event: any) {
            const isEvent : boolean = hasOwnProperty(event, 'preventDefault') &&
                hasOwnProperty(event, 'stopPropagation') &&
                hasOwnProperty(event, 'stopImmediatePropagation');

            if (isEvent && this.disabled) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            } else {
                if (this.isRouterLink) {
                    this.$emit('click', event);
                }

                this.$emit('clicked', event);
            }

            if (
                isEvent &&
                !this.isRouterLink &&
                this.computedHref === '#'
            ) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        },
    },
    render(createElement: CreateElement) : VNode {
        return createElement(
            this.computedTag,
            {
                class: {
                    active: this.active,
                    disabled: this.disabled,
                },
                attrs: this.computedAttrs,
                props: this.computedProps,
                [this.isRouterLink ? 'nativeOn' : 'on']: {
                    click: this.onClick,
                },
            },
            this.$scopedSlots.default(),
        );
    },
});

export default NavigationLink;
