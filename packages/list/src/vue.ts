import type VCList from './components/list/List.vue';
import type VCListBody from './components/list/ListBody.vue';
import type VCListItem from './components/list-item/ListItem.vue';
import type VCListLoading from './components/list/ListLoading.vue';
import type VCListEmpty from './components/list/ListEmpty.vue';

declare module 'vue' {
    export interface GlobalComponents {
        VCList: typeof VCList;
        VCListBody: typeof VCListBody;
        VCListItem: typeof VCListItem;
        VCListLoading: typeof VCListLoading;
        VCListEmpty: typeof VCListEmpty;
    }
}

export {};
