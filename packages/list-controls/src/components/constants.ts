export enum Component {
    List = 'list',
    ListFooter = 'listFooter',
    ListHeader = 'listHeader',
    ListItem = 'listItem',
    ListBody = 'listBody',
    ListLoading = 'listLoading',
    ListNoMore = 'listNoMore',
}

export enum SlotName {
    DEFAULT = 'default',
    FOOTER = 'footer',
    HEADER = 'header',
    BODY = 'body',
    LOADING = 'loading',
    NO_MORE = 'noMore',
    ITEM = 'item',
    /** Alias for ITEM — provides naming consistency with DEFAULT at the list level. */
    ITEM_DEFAULT = 'itemDefault',
    ITEM_ACTIONS = 'itemActions',
    ITEM_ACTIONS_EXTRA = 'itemActionsExtra',
}

export enum CSSClassDefault {
    LIST = 'vc-list',
    LIST_BODY = 'vc-list-body',
    LIST_FOOTER = 'vc-list-footer',
    LIST_HEADER = 'vc-list-header',
    LIST_ITEM = 'vc-list-item',
    LIST_LOADING = 'vc-list-loading',
    LIST_NO_MORE = 'vc-list-no-more',
}
