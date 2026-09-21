import type {
    VCTree,
    VCTreeItem,
    VCTreeItemTrigger,
} from './components';

declare module 'vue' {
    export interface GlobalComponents {
        VCTree: typeof VCTree;
        VCTreeItem: typeof VCTreeItem;
        VCTreeItemTrigger: typeof VCTreeItemTrigger;
    }
}
