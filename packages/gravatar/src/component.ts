import type { GravatarFallbackSlotProps, GravatarThemeClasses } from './types';
import { gravatarProps } from './props';
import { extend, useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeElementDefinition } from '@vuecs/core';
import { VCAvatar } from '@vuecs/elements';

import md5 from 'md5';
import type { SlotsType } from 'vue';
import { computed, defineComponent, h } from 'vue';

import '../assets/gravatar.css';

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        gravatar?: ThemeElementDefinition<GravatarThemeClasses>;
    }
}

export const gravatarThemeDefaults: ComponentThemeDefinition<GravatarThemeClasses> = { classes: { root: '' } };

export const VCGravatar = defineComponent({
    name: 'VCGravatar',
    inheritAttrs: false,
    props: gravatarProps,
    slots: Object as SlotsType<{
        fallback: GravatarFallbackSlotProps;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('gravatar', props, gravatarThemeDefaults);

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

        return () => {
            // The structural `vc-gravatar` class hardcodes a 5rem baseline
            // to preserve the historical default for bare `<VCGravatar>`
            // usages. When `displaySize` is set, skip it — otherwise its
            // dimensions would win the cascade over the avatar size
            // variants (gravatar CSS loads after elements CSS in
            // consumer pipelines).
            const structuralRoot = props.displaySize === undefined ? 'vc-gravatar' : '';
            const composedRoot = [structuralRoot, theme.value.root].filter(Boolean).join(' ');

            return h(
                VCAvatar,
                {
                    ...attrs,
                    src: url.value,
                    alt: props.alt,
                    delayMs: props.delayMs,
                    size: props.displaySize,
                    themeClass: composedRoot ? { root: extend(composedRoot) } : undefined,
                },
                { fallback: (slotProps: { class: string }) => slots.fallback?.(slotProps) ?? '' },
            );
        };
    },
});
