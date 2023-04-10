/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from 'smob';

export class ComponentStore {
    protected data : Record<string, Record<string, any>>;

    constructor() {
        this.data = {};
    }

    /**
     * Set options for all components.
     *
     * @param items
     */
    setAll(items: Record<string, Record<string, any>>) {
        const keys = Object.keys(items);
        for (let i = 0; i < keys.length; i++) {
            this.setOptions(keys[i], items[keys[i]]);
        }
    }

    /**
     * Set options for a specific component.
     *
     * @param component
     * @param options
     */
    setOptions(component: string, options: Record<string, any>) {
        if (typeof this.data[component] === 'undefined') {
            this.data[component] = {};
        }

        this.data[component] = {
            ...this.data[component],
            ...options,
        };
    }

    getOptions(component: string) : Record<string, any> {
        if (typeof this.data[component] !== 'undefined') {
            return this.data[component];
        }

        return {};
    }

    hasOption(component: string, option: string) : boolean {
        return typeof this.data[component] !== 'undefined' &&
            hasOwnProperty(this.data[component], option);
    }

    getOption(component: string, option: string) {
        if (typeof this.data[component] === 'undefined') {
            return undefined;
        }

        return this.data[component][option];
    }
}
