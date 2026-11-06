import type { CoreOptions } from '@vuecs/core';

import type { gravatarProps } from './props';
import type { ExtractPublicPropTypes } from 'vue';
import '../assets/gravatar.css';

export type Options = CoreOptions;

export type GravatarThemeClasses = {
    /** Outer wrapper — composed onto `<VCAvatar>`'s `root` slot. */
    root: string;
};

export type GravatarFallbackSlotProps = {
    class: string;
};

export type GravatarProps = ExtractPublicPropTypes<typeof gravatarProps>;
