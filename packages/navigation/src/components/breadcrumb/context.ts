import type { BreadcrumbContext } from './types';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';



const BREADCRUMB_CONTEXT_KEY: InjectionKey<BreadcrumbContext> = Symbol('vcBreadcrumbContext');

export function provideBreadcrumbContext(ctx: BreadcrumbContext): void {
    provide(BREADCRUMB_CONTEXT_KEY, ctx);
}

export function useBreadcrumbContext(): BreadcrumbContext | null {
    return inject(BREADCRUMB_CONTEXT_KEY, null);
}
