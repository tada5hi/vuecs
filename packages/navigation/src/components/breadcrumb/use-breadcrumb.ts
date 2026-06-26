import { inject, provide } from '@vuecs/core';
import { ref } from 'vue';
import type { App, Ref } from 'vue';
import type { BreadcrumbItem } from './types';

const BREADCRUMB_MANAGER_SYMBOL = Symbol.for('VCBreadcrumbManager');

/**
 * Opt-in imperative breadcrumb trail. Derivation (registry / route-meta /
 * explicit `:items`) is the default + recommended path — reach for the
 * manager only for genuinely non-route-driven flows (wizard / stack-style
 * UIs) where you push and pop the trail by hand.
 *
 * Bind the reactive `items` into a breadcrumb: destructure so the template
 * unwraps the ref —
 * `const { items, push, pop } = useBreadcrumb()` → `<VCBreadcrumb :items="items">`.
 */
export type BreadcrumbManager = {
    /** Reactive trail. Destructure before binding so the template unwraps it. */
    items: Ref<BreadcrumbItem[]>;
    /** Append a crumb (descend into a child). */
    push: (item: BreadcrumbItem) => void;
    /** Remove and return the last crumb (ascend to the parent). */
    pop: () => BreadcrumbItem | undefined;
    /** Replace the whole trail. */
    replace: (items: BreadcrumbItem[]) => void;
    /** Reset to the initial trail passed at creation. */
    reset: () => void;
};

export function createBreadcrumbManager(initial: BreadcrumbItem[] = []): BreadcrumbManager {
    const items = ref<BreadcrumbItem[]>([...initial]);
    return {
        items,
        push: (item) => { items.value = [...items.value, item]; },
        pop: () => {
            const next = items.value.slice();
            const removed = next.pop();
            items.value = next;
            return removed;
        },
        replace: (value) => { items.value = [...value]; },
        reset: () => { items.value = [...initial]; },
    };
}

/**
 * Provide an **app-scoped** breadcrumb manager (one per app via
 * `provide`/`inject`, NOT a module singleton — a singleton would leak the
 * trail across concurrent SSR requests). Called from the package
 * `install()`; also callable directly to seed an initial trail.
 */
export function provideBreadcrumbManager(
    manager: BreadcrumbManager = createBreadcrumbManager(),
    app?: App,
): BreadcrumbManager {
    provide(BREADCRUMB_MANAGER_SYMBOL, manager, app);
    return manager;
}

/** Inject the app-scoped breadcrumb manager. Throws when none is installed. */
export function useBreadcrumb(app?: App): BreadcrumbManager {
    const manager = inject<BreadcrumbManager>(BREADCRUMB_MANAGER_SYMBOL, app);
    if (!manager) {
        throw new Error('A breadcrumb manager has not been provided. Did you `app.use(VCNavigation)`?');
    }
    return manager;
}
