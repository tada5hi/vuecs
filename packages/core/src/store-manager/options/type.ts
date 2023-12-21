import type { ComponentsOptions } from '../../component';

export type StoreManagerOptions = {
    /**
     * presets.components.options
     */
    presets?: Record<string, ComponentsOptions>,
    /**
     * components.options
     */
    defaults?: ComponentsOptions
};
