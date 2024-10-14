/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { EventEmitter } from '@posva/event-emitter';
import {
    findTierItem,
    findTierItems,
    isNavigationItemMatch, removeTierItems,
    replaceTierItem,
    replaceTierItems,
    resetItem,
    setNavigationExpansion,
} from './core';
import type { NavigationProvider } from './provider';
import type { NavigationBuildContext, NavigationItem } from './type';

type NavigationManagerContext = {
    provider: NavigationProvider;
};

export class NavigationManager extends EventEmitter<{
    updated: NavigationItem[],
    tierUpdated: [number, NavigationItem[]]
}> {
    protected provider : NavigationProvider;

    protected itemsActive : NavigationItem[];

    protected items : NavigationItem[];

    protected initialized : boolean;

    constructor(ctx: NavigationManagerContext) {
        super();

        this.provider = ctx.provider;

        this.items = [];
        this.itemsActive = [];

        this.initialized = false;
    }

    getTierItems(tier: number) {
        return findTierItems(this.items, tier);
    }

    async build(ctx: NavigationBuildContext) : Promise<void> {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.items = [];
        this.itemsActive = await this.getActiveItems(ctx);

        let tier = 0;

        let url: string | undefined;
        if (typeof ctx.url === 'string') {
            url = ctx.url;
        } else if (typeof ctx.route !== 'undefined') {
            url = ctx.route.fullPath;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const items = await this.provider
                .getItems(tier, this.itemsActive);

            if (!items || items.length === 0) {
                break;
            }

            // todo: deep or via normalization
            for (let i = 0; i < items.length; i++) {
                items[i].tier = tier;
            }

            let currentItem = findTierItem(tier, this.itemsActive);
            if (!currentItem) {
                if (url) {
                    const urlMatches = items.filter(
                        (item) => isNavigationItemMatch(item, { url }),
                    );
                    if (urlMatches.length > 0) {
                        [currentItem] = urlMatches;
                    }
                }

                if (!currentItem) {
                    const defaultItem = items
                        .filter((item) => item.default);
                    if (defaultItem.length > 0) {
                        currentItem = defaultItem;
                    } else {
                        [currentItem] = items;
                    }
                }

                currentItem.tier = tier;
                this.itemsActive.push(currentItem);
            }

            if (!currentItem) {
                continue;
            }

            this.itemsActive = replaceTierItem(tier, this.itemsActive, currentItem);

            await this.buildTier(tier);

            tier++;
        }

        this.emit('updated', this.items);
    }

    async select(tier: number, itemNew: NavigationItem) {
        const itemOld = findTierItem(tier, this.itemsActive);

        if (
            itemOld &&
            isNavigationItemMatch(itemOld, itemNew)
        ) {
            return;
        }

        this.itemsActive = this.itemsActive.filter(
            (el) => typeof el.tier === 'undefined' ||
                el.tier < tier,
        );

        itemNew.tier = tier;
        this.itemsActive.push(itemNew);

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const built = await this.buildTier(tier);
            if (!built) {
                break;
            }

            tier++;
        }
    }

    async toggle(tier: number, item: NavigationItem) {
        const isMatch = item.displayChildren || isNavigationItemMatch(
            findTierItem(tier, this.itemsActive),
            item,
        );

        if (isMatch) {
            this.itemsActive = removeTierItems(tier, this.itemsActive);
        } else {
            this.itemsActive = replaceTierItem(tier, this.itemsActive, { ...item });
        }

        await this.buildTier(tier, true);
    }

    protected async buildTier(tier: number, cached?: boolean) : Promise<boolean> {
        let items : NavigationItem[] | undefined;

        if (cached) {
            items = findTierItems(this.items, tier);
        } else {
            items = await this.provider.getItems(
                tier,
                this.itemsActive,
            );
        }

        if (!items || items.length === 0) {
            this.items = this.items.filter(
                (item) => typeof item.tier === 'undefined' || item.tier < tier,
            );

            this.emit('tierUpdated', tier, []);

            return false;
        }

        for (let i = 0; i < items.length; i++) {
            items[i].tier = tier;
            resetItem(items[i]);
        }

        const item = findTierItem(tier, this.itemsActive);
        if (item) {
            const expansion = setNavigationExpansion(items, item);
            items = expansion.items;
        }

        this.items = replaceTierItems(tier, this.items, items);

        this.emit('tierUpdated', tier, items);

        return true;
    }

    protected async getActiveItems(ctx: NavigationBuildContext) {
        let output: NavigationItem[] = [];

        if (typeof ctx.itemsActive !== 'undefined') {
            output = ctx.itemsActive;
        } else if (ctx.route) {
            if (typeof this.provider.getItemsActiveByRoute !== 'undefined') {
                output = await this.provider.getItemsActiveByRoute(ctx.route);
            } else if (typeof this.provider.getItemsActiveByURL !== 'undefined') {
                output = await this.provider.getItemsActiveByURL(ctx.route.fullPath);
            }
        } else if (
            ctx.url &&
            typeof this.provider.getItemsActiveByURL !== 'undefined'
        ) {
            output = await this.provider.getItemsActiveByURL(ctx.url);
        }

        if (output.length > 0) {
            for (let i = 0; i < output.length; i++) {
                if (typeof output[i].tier === 'undefined') {
                    output[i].tier = i;
                }
            }
        }

        return output;
    }
}
