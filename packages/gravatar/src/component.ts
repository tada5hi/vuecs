/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import md5 from 'md5';
import { computed, defineComponent, h } from 'vue';

export const VCGravatar = defineComponent({
    name: 'Gravatar',
    inheritAttrs: false,
    props: {
        email: {
            type: String,
            default: '',
        },
        hash: {
            type: String,
            default: '',
        },
        size: {
            type: Number,
            default: 80,
        },
        defaultImg: {
            type: String,
            default: 'retro',
        },
        rating: {
            type: String,
            default: 'g',
        },
        alt: {
            type: String,
            default: 'Avatar',
        },
        protocol: {
            type: String,
            default: '',
        },
        hostname: {
            type: String,
            default: 'www.gravatar.com',
        },
    },
    setup(props, ctx) {
        const url = computed(() => {
            const protocol = props.protocol.slice(-1) === ':' ?
                props.protocol :
                `${props.protocol}:`;
            const img = [
                `${protocol === ':' ? '' : protocol}//${props.hostname}/avatar/`,
                props.hash || md5(props.email.trim().toLowerCase()),
                `?s=${props.size}`,
                `&d=${props.defaultImg}`,
                `&r=${props.rating}`,
            ];
            return img.join('');
        });

        return () => h('img', {
            src: url.value,
            alt: props.alt,
            ...ctx.attrs,
        });
    },
});
