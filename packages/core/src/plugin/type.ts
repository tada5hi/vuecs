/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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
