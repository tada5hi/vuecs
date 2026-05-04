import type { ComponentThemeDefinition } from '@vuecs/core';
import type { AvatarThemeClasses } from './types';

export const avatarThemeDefaults: ComponentThemeDefinition<AvatarThemeClasses> = {
    classes: {
        root: 'vc-avatar',
        image: 'vc-avatar-image',
        fallback: 'vc-avatar-fallback',
    },
};
