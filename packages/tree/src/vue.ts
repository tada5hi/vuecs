import type {
    VCTree,
    VCTreeItem,
    VCTreeItemTrigger,
} from './components';

declare module 'vue' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
    export interface GlobalComponents {
        VCTree: typeof VCTree;
        VCTreeItem: typeof VCTreeItem;
        VCTreeItemTrigger: typeof VCTreeItemTrigger;
    }
}
