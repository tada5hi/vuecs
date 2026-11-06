import type { TreeContext } from './types';
import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';


const TREE_CONTEXT_KEY: InjectionKey<TreeContext> = Symbol.for('VCTreeContext');

export function provideTreeContext(context: TreeContext): void {
    provide(TREE_CONTEXT_KEY, context);
}

/**
 * Strict inject — `<VCTreeItem>` is only meaningful inside a `<VCTree>`
 * (reka's own `TreeItem` throws without its root context too).
 */
export function useTree(): TreeContext {
    const context = inject(TREE_CONTEXT_KEY, null);

    if (!context) {
        throw new Error('[vuecs/tree] <VCTreeItem> must be rendered inside a <VCTree>.');
    }

    return context;
}
