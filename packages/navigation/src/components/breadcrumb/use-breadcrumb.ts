import type { BreadcrumbItem, BreadcrumbManager  } from './types';
import { inject, provide } from '@vuecs/core';
import { ref } from 'vue';
import type { App } from 'vue';

const BREADCRUMB_MANAGER_SYMBOL = Symbol.for('VCBreadcrumbManager');

export function createBreadcrumbManager(initial: BreadcrumbItem[] = []): BreadcrumbManager {
    // Snapshot the creation-time trail so `reset()` restores the documented
    // baseline even if the caller mutates the array they passed in later.
    const baseline = [...initial];
    const items = ref<BreadcrumbItem[]>([...baseline]);

    return {
        items,
        push: (item) => {
            items.value = [...items.value, item];
        },
        pop: () => {
            const next = items.value.slice();
            const removed = next.pop();

            items.value = next;

            return removed;
        },
        replace: (value) => {
            items.value = [...value];
        },
        reset: () => {
            items.value = [...baseline];
        },
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
