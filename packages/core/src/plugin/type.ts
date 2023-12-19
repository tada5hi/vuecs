export type PluginBaseOptions = {
    /**
     * presets.components.options
     */
    presets?: Record<string, Record<string, Record<string, any>>>,
    /**
     * components.options
     */
    defaults?: Record<string, Record<string, any>>
};
