import type { App, Plugin } from 'vue';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { CoreOptions } from '@vuecs/core';

import '../assets/aspect-ratio.css';
import '../assets/avatar.css';
import '../assets/badge.css';
import '../assets/separator.css';
import '../assets/tag.css';
import './vue';

import {
    VCAspectRatio,
    VCAvatar,
    VCBadge,
    VCSeparator,
    VCTag,
    VCTags,
    VCVisuallyHidden,
} from './components';

export * from './components';

export type Options = CoreOptions;

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);

    Object.entries({
        VCSeparator,
        VCTag,
        VCTags,
        VCAvatar,
        VCAspectRatio,
        VCVisuallyHidden,
        VCBadge,
    }).forEach(([name, component]) => {
        app.component(name, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
