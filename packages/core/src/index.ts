import type { App, Plugin } from 'vue';
import { installThemeManager } from './theme';
import type { ThemeManagerOptions } from './theme';
import { installDefaultsManager } from './defaults';
import type {
    ComponentDefaults,
    DefaultsManagerOptions,
    Icon,
    IconsOptions,
} from './defaults';
import { installConfigManager } from './config';
import type { ConfigManagerOptions } from './config';

export * from './config';
export * from './theme';
export * from './defaults';
export * from './utils';
export * from './types';

export type CoreOptions = ThemeManagerOptions &
    DefaultsManagerOptions &
    IconsOptions &
    ConfigManagerOptions;

function mergeComponentDefaults(
    target: Record<string, any>,
    source: Partial<ComponentDefaults> | undefined,
): void {
    if (!source) return;
    for (const [name, value] of Object.entries(source)) {
        if (value && typeof value === 'object') {
            target[name] = { ...(target[name] || {}), ...value };
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

    const merged: Record<string, any> = {};
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
