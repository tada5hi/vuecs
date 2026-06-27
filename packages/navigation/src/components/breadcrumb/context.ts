import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { BreadcrumbLeafHandle, BreadcrumbThemeClasses } from './types';

/**
 * Context shared from `<VCBreadcrumb>` to its descendant parts.
 *
 * `themeVariant` (e.g. `{ size: 'sm' }`) propagates to **every** part so a
 * single `<VCBreadcrumb :theme-variant>` resizes the whole trail without
 * repeating the prop. `themeClass` propagates only to parts on the shared
 * `breadcrumb` root key (`<ol>` / link / page / ellipsis); the `<li>` and
 * separator carry their own keys and inherit `themeVariant` only.
 *
 * Optional — parts render bare when mounted outside `<VCBreadcrumb>` (unit
 * tests / ad-hoc composition).
 */
export type BreadcrumbContext = {
    themeClass: () => ThemeClassesOverride<BreadcrumbThemeClasses> | undefined;
    themeVariant: () => VariantValues | undefined;
    /** Nearest-ancestor leaf-label override handle (see `useBreadcrumbLeaf`). */
    leaf: BreadcrumbLeafHandle;
};

const BREADCRUMB_CONTEXT_KEY: InjectionKey<BreadcrumbContext> = Symbol('vcBreadcrumbContext');

export function provideBreadcrumbContext(ctx: BreadcrumbContext): void {
    provide(BREADCRUMB_CONTEXT_KEY, ctx);
}

export function useBreadcrumbContext(): BreadcrumbContext | null {
    return inject(BREADCRUMB_CONTEXT_KEY, null);
}
