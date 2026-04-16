import { StoreName } from '../store';
import type { StoreManager } from '../store-manager';
import { injectStoreManager } from '../store-manager';
import { hasOwnProperty } from '../utils';
import type { ComponentOptionBuildContext, ComponentOptions, ComponentOptionsManagerContext } from './type';
import {
    isComponentOptionInputConfig,
    isComponentOptionInputConfigWithDefaults,
    isComponentOptionInputConfigWithPresets, 
    mergeOption,
} from './utils';

export class ComponentOptionsManager<T extends ComponentOptions> {
    protected readonly component: string;

    protected readonly storeManager : StoreManager;

    // ---------------------------------------------------------

    constructor(context: ComponentOptionsManagerContext) {
        this.component = context.name;
        this.storeManager = context.storeManager || injectStoreManager(context.storeManagerKey);
    }

    // ---------------------------------------------------------

    build<K extends keyof T>(
        context: ComponentOptionBuildContext<K, T[K]>,
    ): T[K] | undefined {
        let value : T[K] | undefined;

        const presetConfig : Record<string, boolean> = {};

        if (isComponentOptionInputConfigWithPresets(context.value)) {
            const keys = Object.keys(context.value.presets);
            for (const key of keys) {
                presetConfig[key] = context.value.presets[key];
            }

            if (typeof context.value.value !== 'undefined') {
                value = context.value.value;
            }
        }

        if (!isComponentOptionInputConfig(context.value)) {
            value = context.value;
        }

        if (typeof value === 'undefined') {
            if (!isComponentOptionInputConfigWithDefaults(context.value) || context.value.defaults) {
                const store = this.storeManager.use(StoreName.DEFAULT);
                if (store.hasOption(this.component, context.key as string)) {
                    value = store.getOption(this.component, context.key as string);
                }
            }
        }

        const keys = this.storeManager.keys();
        for (const key of keys) {
            if (key === StoreName.DEFAULT) {
                continue;
            }

            if (
                hasOwnProperty(presetConfig, key) &&
                !presetConfig[key]
            ) {
                continue;
            }

            const presetStore = this.storeManager.use(key);
            if (presetStore.hasOption(this.component, context.key as string)) {
                value = mergeOption(
                    context.key as string,
                    value,
                    presetStore.getOption(this.component, context.key as string),
                );
            }
        }

        if (typeof value === 'undefined') {
            return context.alt;
        }

        return value;
    }

    buildOrFail<K extends keyof T>(
        context: ComponentOptionBuildContext<K, T[K]>,
    ): T[K] {
        const target = this.build(context);

        if (
            typeof target === 'undefined' &&
            !hasOwnProperty(context, 'alt')
        ) {
            throw new Error(`A value for option ${context.key as string} of component ${this.component} is required.`);
        }

        return target as T[K];
    }

    get<K extends keyof T &(string | number)>(key: K) : T[K] | undefined {
        let value : T[K] | undefined;

        const keys = this.storeManager.keys();
        for (const key_ of keys) {
            const presetStore = this.storeManager.use(key_);
            if (presetStore.hasOption(this.component, key as string)) {
                value = mergeOption(
                    key as string,
                    value,
                    presetStore.getOption(this.component, key as string),
                );
            }
        }

        return value;
    }
}
