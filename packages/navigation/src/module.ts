/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { EventEmitter } from '@posva/event-emitter';
import {
    findBestItemMatches,
    findTierItem,
    findTierItems,
    removeTierItems,
    replaceTierItem,
    replaceTierItems,
    resetItemsByTrace,
} from './core';
import type { NavigationProvider } from './provider';
import type { NavigationItem, NavigationItemNormalized } from './type';
import { isTraceEqual, normalizeItems } from './utils';

type NavigationManagerContext = {
    provider: NavigationProvider;
};

export class NavigationManager extends EventEmitter<{
    updated: NavigationItem[],
    tierUpdated: [number, NavigationItem[]]
}> {
    protected provider : NavigationProvider;

    protected itemsActive : NavigationItemNormalized[];

    protected items : NavigationItemNormalized[];

    protected initialized : boolean;

    constructor(ctx: NavigationManagerContext) {
        super();

        this.provider = ctx.provider;

        this.items = [];
        this.itemsActive = [];

        this.initialized = false;
    }

    getTierItems(tier: number) {
        return this.items.filter((item) => item.tier === tier);
    }

    async build(path: string) : Promise<void> {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.items = [];
        this.itemsActive = [];

        let tier = 0;

        while (true) {
            const raw = await this.provider
                .getItems(tier, this.itemsActive);

            if (!raw || raw.length === 0) {
                break;
            }

            const items = normalizeItems(raw, { tier });

            const matches = findBestItemMatches(items, {
                url: path,
            });

            const [match] = matches;

            if (!match) {
                break;
            }

            this.itemsActive.push(match);

            await this.buildTier(tier);

            tier++;
        }

        this.emit('updated', this.items);
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
            const raw = await this.provider.getItems(
                tier,
                this.itemsActive,
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
