import type {
    DefineComponent,
    ExtractPublicPropTypes,
    PropType,
    VNodeProps,
    VNodeTypes,
} from 'vue';
import {
    computed,
    defineComponent,
    h,
    resolveDynamicComponent,
    toRef,
} from 'vue';
import type { LinkQuery } from './types';
import { isObject } from './utils';

const linkProps = {
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
    query: { type: Object as PropType<LinkQuery> },
};

export type LinkProps = ExtractPublicPropTypes<typeof linkProps>;

export const VCLink = defineComponent({
    name: 'VCLink',
    props: linkProps,
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
                for (const key of keys) {
                    url.searchParams.set(key, query[key]);
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
            ...(isRouterLink.value ? {} : { target: props.target }),
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
                'data-active': props.active ? '' : undefined,
                'data-disabled': props.disabled ? '' : undefined,
                ...computedAttrs.value,
                ...computedProps.value,
                onClick,
            };

            return vNodeProps;
        };

        // Resolve the rendered component INSIDE the render fn so it
        // reacts to `to`/`disabled` changes — previously the switch
        // ran once at setup and cached the choice, so toggling
        // `:disabled` couldn't swap `<router-link>` → `<a>`.
        const resolvedComponent = computed<string | VNodeTypes>(() => {
            switch (computedTag.value) {
                case 'router-link': return routerLink;
                case 'nuxt-link': return nuxtLink;
                default: return 'a';
            }
        });

        return () => {
            const component = resolvedComponent.value;
            if (typeof component === 'string') {
                return h(
                    component,
                    buildVNodeProps(),
                    [
                        (typeof slots.default === 'function' ? slots.default() : []),
                    ],
                );
            }
            return h(
                component as DefineComponent,
                buildVNodeProps(),
                { default: () => (typeof slots.default === 'function' ? slots.default() : []) },
            );
        };
    },
});
