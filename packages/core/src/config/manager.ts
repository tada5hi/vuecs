import type { ShallowRef } from 'vue';
import { shallowRef, triggerRef } from 'vue';
import type { Config, ConfigManagerOptions } from './types';

const DEFAULTS: Config = {
    dir: 'ltr',
    locale: 'en-US',
};

export class ConfigManager {
    private readonly configRef: ShallowRef<ConfigManagerOptions['config']>;

    constructor(options: ConfigManagerOptions = {}) {
        this.configRef = shallowRef(options.config || {});
    }

    get config(): ConfigManagerOptions['config'] {
        return this.configRef.value;
    }

    setConfig(config: ConfigManagerOptions['config'] | undefined): void {
        const next = config || {};
        const isSameRef = this.configRef.value === next;
        this.configRef.value = next;
        if (isSameRef) {
            triggerRef(this.configRef);
        }
    }

    /** Returns the configured value or the framework default. Unwraps `MaybeRef`. */
    get<K extends keyof Config>(key: K): Config[K] {
        const raw = (this.configRef.value as Record<string, unknown>)?.[key];
        const value = (raw && typeof raw === 'object' && 'value' in raw) ?
            (raw as { value: unknown }).value :
            raw;
        if (value === undefined || value === null) {
            return DEFAULTS[key] as Config[K];
        }
        return value as Config[K];
    }
}
