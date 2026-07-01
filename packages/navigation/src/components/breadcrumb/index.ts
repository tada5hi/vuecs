export { default as VCBreadcrumb } from './Breadcrumb.vue';
export { default as VCBreadcrumbList } from './BreadcrumbList.vue';
export { default as VCBreadcrumbItem } from './BreadcrumbItem.vue';
export { default as VCBreadcrumbLink } from './BreadcrumbLink.vue';
export { default as VCBreadcrumbPage } from './BreadcrumbPage.vue';
export { default as VCBreadcrumbSeparator } from './BreadcrumbSeparator.vue';
export { default as VCBreadcrumbEllipsis } from './BreadcrumbEllipsis.vue';

export type {
    BreadcrumbProps,
    BreadcrumbItemSlotProps,
} from './Breadcrumb.vue';
export type { BreadcrumbListProps } from './BreadcrumbList.vue';
export type { BreadcrumbItemProps } from './BreadcrumbItem.vue';
export type { BreadcrumbLinkProps } from './BreadcrumbLink.vue';
export type { BreadcrumbPageProps } from './BreadcrumbPage.vue';
export type { BreadcrumbSeparatorProps } from './BreadcrumbSeparator.vue';
export type { BreadcrumbEllipsisProps } from './BreadcrumbEllipsis.vue';

export { provideBreadcrumbContext, useBreadcrumbContext } from './context';
export type { BreadcrumbContext } from './context';

export { breadcrumbBehavioralDefaults } from './defaults';

export { useBreadcrumbFromRegistry } from './use-breadcrumb-from-registry';
export { useBreadcrumbItems } from './use-breadcrumb-items';
export type { BreadcrumbMeta, UseBreadcrumbItemsOptions } from './use-breadcrumb-items';
export {
    createBreadcrumbManager,
    provideBreadcrumbManager,
    useBreadcrumb,
} from './use-breadcrumb';
export type { BreadcrumbManager } from './use-breadcrumb';
export {
    injectBreadcrumbLeafRegistry,
    provideBreadcrumbLeafRegistry,
    useBreadcrumbLeaf,
} from './use-breadcrumb-leaf';
export type { BreadcrumbLeafRegistry } from './use-breadcrumb-leaf';

export * from './theme';
export * from './types';
