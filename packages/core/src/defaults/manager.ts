import type { ShallowRef } from 'vue';
import { shallowRef, triggerRef } from 'vue';
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

    get<K extends keyof ComponentDefaults>(componentName: K): ComponentDefaults[K] | undefined {
        return (this.defaultsRef.value as ComponentDefaults)[componentName];
    }
}
