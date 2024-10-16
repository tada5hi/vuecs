/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { EventEmitter } from '@posva/event-emitter';
import {
    findBestItemMatches,
    findItemWithLevel,
    findItemsWithLevel,
    isTraceEqual,
    normalizeItems,
    removeItemsWithLevel,
    replaceLevelItem,
    replaceLevelItems,
    resetItemsByTrace,
} from '../helpers';
import type { NavigationItemNormalized, NavigationItemsFn } from '../types';
import type { NavigationManagerBuildOptions, NavigationManagerOptions } from './types';

export class NavigationManager extends EventEmitter<{
    updated: NavigationItemNormalized[],
    tierUpdated: [number, NavigationItemNormalized[]]
}> {
    protected itemsActive : NavigationItemNormalized[];

    protected items : NavigationItemNormalized[];

    protected itemsFn : NavigationItemsFn;

    protected built : boolean;

    constructor(options: NavigationManagerOptions) {
        super();

        let itemsFn : NavigationItemsFn;
        if (typeof options.items === 'function') {
            itemsFn = options.items;
        } else {
            itemsFn = async ({ level }) => {
                if (level > 0) {
                    return [];
                }

                return options.items as NavigationItemNormalized[];
            };
        }

        this.itemsFn = itemsFn;
        this.items = [];
        this.itemsActive = [];

        this.built = false;
    }

    getItems(tier?: number) {
        if (typeof tier === 'undefined') {
            return this.items;
        }

        return this.items.filter((item) => item.level === tier);
    }

    async build(options: NavigationManagerBuildOptions) : Promise<NavigationItemNormalized[]> {
        if (this.built) {
            return this.items;
        }

        this.built = true;

        this.items = [];
        this.itemsActive = [];

        let parent : NavigationItemNormalized | undefined;
        let level = 0;

        while (true) {
            const raw = await this.itemsFn({ level, parent });
            if (!raw || raw.length === 0) {
                break;
            }

            const items = normalizeItems(raw, { level });

            const matches = findBestItemMatches(items, {
                path: options.path,
            });

            const [match] = matches;

            if (!match) {
                break;
            }

            this.itemsActive.push(match);

            await this.buildLevel(level);

            parent = match;

            level++;
        }

        this.emit('updated', this.items);

        return this.items;
    }

    async select(level: number, itemNew: NavigationItemNormalized) {
        const itemOld = findItemWithLevel(level, this.itemsActive);

        if (
            itemOld &&
            isTraceEqual(itemOld.trace, itemNew.trace)
        ) {
            return;
        }

        this.itemsActive = this.itemsActive.filter(
            (el) => el.level < level,
        );
        this.itemsActive.push(itemNew);

        const startLevel = level;
        while (true) {
            const built = await this.buildLevel(
                level,
                startLevel === level,
            );
            if (!built) {
                break;
            }

            level++;
        }
    }

    async toggle(level: number, item: NavigationItemNormalized) {
        let isMatch : boolean;
        if (item.displayChildren) {
            isMatch = true;
        } else {
            const itemOld = findItemWithLevel(level, this.itemsActive);
            isMatch = !!itemOld && isTraceEqual(item.trace, itemOld.trace);
        }

        if (isMatch) {
            this.itemsActive = removeItemsWithLevel(level, this.itemsActive);
        } else {
            this.itemsActive = replaceLevelItem(level, this.itemsActive, item);
        }

        await this.buildLevel(level, true);
    }

    protected async buildLevel(level: number, cached?: boolean) : Promise<boolean> {
        let items : NavigationItemNormalized[] | undefined;

        if (cached) {
            items = findItemsWithLevel(this.items, level);
        } else {
            const parent = findItemWithLevel(level - 1, this.itemsActive);
            const raw = await this.itemsFn({
                level,
                parent,
            });

            items = raw && raw.length > 0 ?
                normalizeItems(raw, { level }) :
                [];
        }

        if (!items || items.length === 0) {
            this.items = this.items.filter(
                (item) => item.level < level,
            );

            this.emit('tierUpdated', level, []);

            return false;
        }

        let trace : string[] = [];
        const item = findItemWithLevel(level, this.itemsActive);
        if (item) {
            trace = item.trace;
        }

        resetItemsByTrace(items, trace);

        this.items = replaceLevelItems(level, this.items, items);

        this.emit('tierUpdated', level, items);

        return true;
    }
}
