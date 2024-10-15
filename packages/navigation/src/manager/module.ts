/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { EventEmitter } from '@posva/event-emitter';
import {
    findBestItemMatches,
    findTierItem,
    findTierItems,
    isTraceEqual,
    normalizeItems,
    removeTierItems,
    replaceTierItem,
    replaceTierItems,
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

    protected initialized : boolean;

    constructor(options: NavigationManagerOptions) {
        super();

        let itemsFn : NavigationItemsFn;
        if (typeof options.items === 'function') {
            itemsFn = options.items;
        } else {
            itemsFn = async (tier) => {
                if (tier > 0) {
                    return [];
                }

                return options.items as NavigationItemNormalized[];
            };
        }

        this.itemsFn = itemsFn;
        this.items = [];
        this.itemsActive = [];

        this.initialized = false;
    }

    getItems(tier?: number) {
        if (typeof tier === 'undefined') {
            return this.items;
        }

        return this.items.filter((item) => item.tier === tier);
    }

    async build(options: NavigationManagerBuildOptions) : Promise<NavigationItemNormalized[]> {
        if (this.initialized) {
            return this.items;
        }

        this.initialized = true;

        this.items = [];
        this.itemsActive = [];

        let parent : NavigationItemNormalized | undefined;
        let tier = 0;

        while (true) {
            const raw = await this.itemsFn(tier, parent);

            if (!raw || raw.length === 0) {
                break;
            }

            const items = normalizeItems(raw, { tier });

            const matches = findBestItemMatches(items, {
                path: options.path,
            });

            const [match] = matches;

            if (!match) {
                break;
            }

            this.itemsActive.push(match);

            await this.buildTier(tier);

            parent = match;

            tier++;
        }

        this.emit('updated', this.items);

        return this.items;
    }

    async select(tier: number, itemNew: NavigationItemNormalized) {
        const itemOld = findTierItem(tier, this.itemsActive);

        if (
            itemOld &&
            isTraceEqual(itemOld.trace, itemNew.trace)
        ) {
            return;
        }

        this.itemsActive = this.itemsActive.filter(
            (el) => el.tier < tier,
        );
        this.itemsActive.push(itemNew);

        while (true) {
            const built = await this.buildTier(tier);
            if (!built) {
                break;
            }

            tier++;
        }
    }

    async toggle(tier: number, item: NavigationItemNormalized) {
        let isMatch : boolean;
        if (item.displayChildren) {
            isMatch = true;
        } else {
            const itemOld = findTierItem(tier, this.itemsActive);
            isMatch = !!itemOld && isTraceEqual(item.trace, itemOld.trace);
        }

        if (isMatch) {
            this.itemsActive = removeTierItems(tier, this.itemsActive);
        } else {
            this.itemsActive = replaceTierItem(tier, this.itemsActive, item);
        }

        await this.buildTier(tier, true);
    }

    protected async buildTier(tier: number, cached?: boolean) : Promise<boolean> {
        let items : NavigationItemNormalized[] | undefined;

        if (cached) {
            items = findTierItems(this.items, tier);
        } else {
            const parent = findTierItem(tier - 1, this.itemsActive);
            const raw = await this.itemsFn(
                tier,
                parent,
            );

            items = raw && raw.length > 0 ?
                normalizeItems(raw, { tier }) :
                [];
        }

        if (!items || items.length === 0) {
            this.items = this.items.filter(
                (item) => item.tier < tier,
            );

            this.emit('tierUpdated', tier, []);

            return false;
        }

        let trace : string[] = [];
        const item = findTierItem(tier, this.itemsActive);
        if (item) {
            trace = item.trace;
        }

        resetItemsByTrace(items, trace);

        this.items = replaceTierItems(tier, this.items, items);

        this.emit('tierUpdated', tier, items);

        return true;
    }
}
