import type { ShallowRef } from 'vue';
import { 
    isRef, 
    shallowRef, 
    triggerRef, 
    unref, 
} from 'vue';
import type { Config, ConfigManagerOptions } from './types';

/**
 * Framework defaults declared by `@vuecs/core`. Child packages register
 * their own per-key defaults at install time via `manager.withDefaults()`,
 * which merges into this map without overwriting consumer-supplied
 * config (consumer wins).
 */
const CORE_DEFAULTS: Partial<Config> = {
    dir: 'ltr',
    locale: 'en-US',
};

export class ConfigManager {
    private readonly configRef: ShallowRef<ConfigManagerOptions['config']>;

    private readonly defaultsMap: Partial<Config>;

    /**
     * @param options.config — consumer-supplied config (wins over defaults).
     * @param options.defaults — pre-seeded defaults map. Used by
     *   `<VCConfigProvider>` to inherit a parent manager's registered
     *   defaults at construction time. Snapshot, not reactive — defaults
     *   registered on the parent AFTER the child mounts don't propagate.
     */
    constructor(options: ConfigManagerOptions & { defaults?: Partial<Config> } = {}) {
        this.configRef = shallowRef(options.config || {});
        this.defaultsMap = { ...CORE_DEFAULTS, ...options.defaults };
    }

    get config(): ConfigManagerOptions['config'] {
        return this.configRef.value;
    }

    /**
     * Snapshot of the current defaults map. Used by `<VCConfigProvider>` to
     * pass into a child manager's constructor for inheritance. The returned
     * object is a copy — mutating it doesn't affect the manager.
     */
    get defaults(): Partial<Config> {
        return { ...this.defaultsMap };
    }

    setConfig(config: ConfigManagerOptions['config'] | undefined): void {
        const next = config || {};
        const isSameRef = this.configRef.value === next;
        this.configRef.value = next;
        if (isSameRef) {
            triggerRef(this.configRef);
        }
    }

    /**
     * Register per-key defaults. Used by child packages on install
     * (e.g. `@vuecs/overlays` registers `scrollLockTarget: 'body'`).
     * Consumer-supplied config always wins — these only fill in keys
     * the consumer didn't pass.
     *
     * Subtree-scoped: calling `withDefaults` on a child manager (created
     * by `<VCConfigProvider>`) does NOT propagate to the parent — each
     * manager owns its own defaults map.
     */
    withDefaults(partial: Partial<Config>): void {
        Object.assign(this.defaultsMap, partial);
        triggerRef(this.configRef);
    }

    /**
     * Returns the configured value or the registered default. Unwraps
     * `MaybeRef` via Vue's `isRef`/`unref` so non-ref objects that happen
     * to expose a `.value` property (e.g. `HTMLInputElement`) are passed
     * through verbatim. Returns `undefined` for keys with no consumer
     * config and no registered default.
     */
    get<K extends keyof Config>(key: K): Config[K] | undefined {
        const raw = (this.configRef.value as Record<string, unknown>)?.[key];
        const value = isRef(raw) ? unref(raw) : raw;
        if (value === undefined || value === null) {
            return this.defaultsMap[key];
        }
        return value as Config[K];
    }
}
