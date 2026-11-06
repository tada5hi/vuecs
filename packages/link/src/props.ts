import type { PropType } from 'vue';
import type { LinkQuery } from './types';

export const linkProps = {
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
