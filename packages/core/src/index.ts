import type { CoreOptions } from './types';
import type { App, Plugin } from 'vue';
import { installThemeManager } from './theme';

import { installDefaultsManager } from './defaults';
import type { ComponentDefaults, Icon } from './defaults';
import { installConfigManager } from './config';

import { isObject } from './utils';

export * from './config';
export * from './theme';
export * from './defaults';
export * from './utils';
export * from './types';

function mergeComponentDefaults(
    target: Record<string, any>,
    source: Partial<ComponentDefaults> | undefined,
): void {
    if (!source) {
        return;
    }

    for (const [name, value] of Object.entries(source)) {
        if (isObject(value)) {
            const existing = target[name] || Object.create(null);
            // Filter out `undefined` so a partial later layer doesn't
            // implicitly clear a preset's value. The defaults pipeline
            // uses `undefined` to mean "fall through to lower layer";
            // explicit "disable" uses `''` instead.
            const incoming = Object.fromEntries(
                Object.entries(value).filter(([, v]) => v !== undefined),
            );

            target[name] = { ...existing, ...incoming };
        }
    }
}

function resolveDefaults(
    icons: Icon[] | undefined,
    consumerDefaults: Partial<ComponentDefaults> | undefined,
): Partial<ComponentDefaults> {
    if (!icons || icons.length === 0) {
        return consumerDefaults || {};
    }

    // Prototype-free target avoids `__proto__` / `constructor` poisoning when
    // merging keys from external presets / consumer config.
    const merged: Record<string, any> = Object.create(null);

    for (const icon of icons) {
        mergeComponentDefaults(merged, icon.defaults);
    }

    mergeComponentDefaults(merged, consumerDefaults);

    return merged as Partial<ComponentDefaults>;
}

export function install(app: App, options: CoreOptions = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, { defaults: resolveDefaults(options.icons, options.defaults) });
    installConfigManager(app, options);
}

export default { install } satisfies Plugin<[CoreOptions?]>;
