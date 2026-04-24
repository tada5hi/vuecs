import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues } from '@vuecs/core';
import md5 from 'md5';
import type { PropType } from 'vue';
import { 
    computed, 
    defineComponent, 
    h, 
} from 'vue';

export type GravatarThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        gravatar?: ThemeElementDefinition<GravatarThemeClasses>;
    }
}

const themeDefaults = { classes: { root: '' } };

export const VCGravatar = defineComponent({
    name: 'VCGravatar',
    inheritAttrs: false,
    props: {
        themeClass: { type: Object as PropType<ThemeClassesOverride<GravatarThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
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
        const theme = useComponentTheme('gravatar', props, themeDefaults);

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
            class: theme.value.root || undefined,
            ...ctx.attrs,
        });
    },
});
