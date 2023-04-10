/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum Component {
    List = 'list',
    ListFooter = 'listFooter',
    ListHeader = 'listHeader',
    ListItem = 'listItem',
    ListItems = 'listItems',
    ListLoading = 'listLoading',
    ListNoMore = 'listNoMore',
    ListTitle = 'listTitle',
    ItemActionToggle = 'itemActionToggle',
}

export enum SlotName {
    DEFAULT = 'default',
    FOOTER = 'footer',
    HEADER = 'header',
    HEADER_TITLE = 'header-title',
    ITEMS = 'items',
    LOADING = 'loading',
    NO_MORE = 'no-more',
    ITEM = 'item',
    ITEM_ACTIONS = 'item-actions',
    ITEM_ACTIONS_EXTRA = 'item-actions-extra',
}
