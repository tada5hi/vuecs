import type { ShallowRef } from 'vue';
import { shallowRef, triggerRef } from 'vue';
import { isObject } from '../utils';
import type { ComponentDefaults, DefaultsManagerOptions } from './types';

export class DefaultsManager {
    private readonly defaultsRef: ShallowRef<Partial<ComponentDefaults>>;

    constructor(options: DefaultsManagerOptions = {}) {
        this.defaultsRef = shallowRef(options.defaults || {});
    }

    get defaults(): Partial<ComponentDefaults> {
        return this.defaultsRef.value;
    }

    setDefaults(defaults: Partial<ComponentDefaults> | undefined): void {
        const next = defaults || {};
        const isSameRef = this.defaultsRef.value === next;
        this.defaultsRef.value = next;
        if (isSameRef) {
            triggerRef(this.defaultsRef);
        }
    }

    /**
     * Per-component deep-merge of `partial` into the current defaults map.
     * Later-wins per `(componentName, key)`; `undefined` values in `partial`
     * are skipped so partial later layers don't accidentally clear a
     * preset's value (matches `resolveDefaults` in `@vuecs/core`).
     *
     * Used by `installDefaultsManager` on its second-and-later invocation
     * so install-order doesn't silently drop options (see #1591).
     */
    mergeDefaults(partial: Partial<ComponentDefaults> | undefined): void {
        if (!partial) return;
        const next: Record<string, any> = { ...this.defaultsRef.value };
        for (const [name, value] of Object.entries(partial)) {
            if (!isObject(value)) continue;
            const existing = next[name] || Object.create(null);
            const incoming = Object.fromEntries(
                Object.entries(value).filter(([, v]) => v !== undefined),
            );
            next[name] = { ...existing, ...incoming };
        }
        this.defaultsRef.value = next as Partial<ComponentDefaults>;
    }

    get<K extends keyof ComponentDefaults>(componentName: K): ComponentDefaults[K] | undefined {
        return (this.defaultsRef.value as ComponentDefaults)[componentName];
    }
}
