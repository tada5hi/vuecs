/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from 'smob';

export class Store {
    protected data : Record<string, Record<string, any>>;

    constructor() {
        this.data = {};
    }

    /**
     * Set options for all groups.
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
     * Set options for a specific group.
     *
     * @param group
     * @param options
     */
    setOptions(group: string, options: Record<string, any>) {
        if (typeof this.data[group] === 'undefined') {
            this.data[group] = {};
        }

        this.data[group] = options;
    }

    hasOptions(group: string) : boolean {
        return hasOwnProperty(this.data, group);
    }

    getOptions(group: string) : Record<string, any> {
        if (typeof this.data[group] !== 'undefined') {
            return this.data[group];
        }

        return {};
    }

    hasOption(group: string, option: string) : boolean {
        return typeof this.data[group] !== 'undefined' &&
            hasOwnProperty(this.data[group], option);
    }

    getOption(group: string, option: string) {
        if (typeof this.data[group] === 'undefined') {
            return undefined;
        }

        return this.data[group][option];
    }
}
