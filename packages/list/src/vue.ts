import type VCList from './components/list/List.vue';
import type VCListHeader from './components/list/ListHeader.vue';
import type VCListBody from './components/list/ListBody.vue';
import type VCListItem from './components/list/ListItem.vue';
import type VCListFooter from './components/list/ListFooter.vue';
import type VCListLoading from './components/list/ListLoading.vue';
import type VCListNoMore from './components/list/ListNoMore.vue';

declare module 'vue' {
    export interface GlobalComponents {
        VCList: typeof VCList;
        VCListHeader: typeof VCListHeader;
        VCListBody: typeof VCListBody;
        VCListItem: typeof VCListItem;
        VCListFooter: typeof VCListFooter;
        VCListLoading: typeof VCListLoading;
        VCListNoMore: typeof VCListNoMore;
    }
}

export {};
