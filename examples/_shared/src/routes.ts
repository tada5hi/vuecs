import type { Component } from 'vue';

export type SharedRoute = {
    /** URL path (e.g. `/button`). Mirrors the docs site's component slug. */
    path: string;
    /** Stable route name. Match the dash-cased VC component name (e.g. `button`, `form-checkbox`). */
    name: string;
    /** Human-readable label shown in navigation. */
    label: string;
    /** Lazy-imported Vue SFC under `./views/`. */
    view: () => Promise<Component>;
};

/**
 * Canonical demo route list. Consumed by every example app to build
 * its router config and by the docs site for cross-referencing.
 */
export const sharedRoutes: SharedRoute[] = [
    {
        path: '/alert',
        name: 'alert',
        label: 'Alert',
        view: () => import('./views/Alert.vue').then((m) => m.default),
    },
    {
        path: '/aspect-ratio',
        name: 'aspect-ratio',
        label: 'Aspect Ratio',
        view: () => import('./views/AspectRatio.vue').then((m) => m.default),
    },
    {
        path: '/avatar',
        name: 'avatar',
        label: 'Avatar',
        view: () => import('./views/Avatar.vue').then((m) => m.default),
    },
    {
        path: '/badge',
        name: 'badge',
        label: 'Badge',
        view: () => import('./views/Badge.vue').then((m) => m.default),
    },
    {
        path: '/button',
        name: 'button',
        label: 'Button',
        view: () => import('./views/Button.vue').then((m) => m.default),
    },
    {
        path: '/card',
        name: 'card',
        label: 'Card',
        view: () => import('./views/Card.vue').then((m) => m.default),
    },
    {
        path: '/collapse',
        name: 'collapse',
        label: 'Collapse',
        view: () => import('./views/Collapse.vue').then((m) => m.default),
    },
    {
        path: '/context-menu',
        name: 'context-menu',
        label: 'Context Menu',
        view: () => import('./views/ContextMenu.vue').then((m) => m.default),
    },
    {
        path: '/countdown',
        name: 'countdown',
        label: 'Countdown',
        view: () => import('./views/Countdown.vue').then((m) => m.default),
    },
    {
        path: '/dropdown-menu',
        name: 'dropdown-menu',
        label: 'Dropdown Menu',
        view: () => import('./views/DropdownMenu.vue').then((m) => m.default),
    },
    {
        path: '/form-checkbox',
        name: 'form-checkbox',
        label: 'Form Checkbox',
        view: () => import('./views/FormCheckbox.vue').then((m) => m.default),
    },
    {
        path: '/form-group',
        name: 'form-group',
        label: 'Form Group (severity)',
        view: () => import('./views/FormGroup.vue').then((m) => m.default),
    },
    {
        path: '/form-input',
        name: 'form-input',
        label: 'Form Input',
        view: () => import('./views/FormInput.vue').then((m) => m.default),
    },
    {
        path: '/form-number',
        name: 'form-number',
        label: 'Form Number',
        view: () => import('./views/FormNumber.vue').then((m) => m.default),
    },
    {
        path: '/form-pin',
        name: 'form-pin',
        label: 'Form Pin',
        view: () => import('./views/FormPin.vue').then((m) => m.default),
    },
    {
        path: '/form-radio',
        name: 'form-radio',
        label: 'Form Radio',
        view: () => import('./views/FormRadio.vue').then((m) => m.default),
    },
    {
        path: '/form-select',
        name: 'form-select',
        label: 'Form Select',
        view: () => import('./views/FormSelect.vue').then((m) => m.default),
    },
    {
        path: '/form-select-search',
        name: 'form-select-search',
        label: 'Form Select Search',
        view: () => import('./views/FormSelectSearch.vue').then((m) => m.default),
    },
    {
        path: '/form-select-search-multiple',
        name: 'form-select-search-multiple',
        label: 'Form Select Search (Multiple)',
        view: () => import('./views/FormSelectSearchMultiple.vue').then((m) => m.default),
    },
    {
        path: '/form-slider',
        name: 'form-slider',
        label: 'Form Slider',
        view: () => import('./views/FormSlider.vue').then((m) => m.default),
    },
    {
        path: '/form-switch',
        name: 'form-switch',
        label: 'Form Switch',
        view: () => import('./views/FormSwitch.vue').then((m) => m.default),
    },
    {
        path: '/form-tags',
        name: 'form-tags',
        label: 'Form Tags',
        view: () => import('./views/FormTags.vue').then((m) => m.default),
    },
    {
        path: '/form-textarea',
        name: 'form-textarea',
        label: 'Form Textarea',
        view: () => import('./views/FormTextarea.vue').then((m) => m.default),
    },
    {
        path: '/gravatar',
        name: 'gravatar',
        label: 'Gravatar',
        view: () => import('./views/Gravatar.vue').then((m) => m.default),
    },
    {
        path: '/hover-card',
        name: 'hover-card',
        label: 'Hover Card',
        view: () => import('./views/HoverCard.vue').then((m) => m.default),
    },
    {
        path: '/link',
        name: 'link',
        label: 'Link',
        view: () => import('./views/Link.vue').then((m) => m.default),
    },
    {
        path: '/list',
        name: 'list',
        label: 'List',
        view: () => import('./views/List.vue').then((m) => m.default),
    },
    {
        path: '/modal',
        name: 'modal',
        label: 'Modal',
        view: () => import('./views/Modal.vue').then((m) => m.default),
    },
    {
        path: '/modal-view-stack',
        name: 'modal-view-stack',
        label: 'Modal View Stack',
        view: () => import('./views/ModalViewStack.vue').then((m) => m.default),
    },
    {
        path: '/pagination',
        name: 'pagination',
        label: 'Pagination',
        view: () => import('./views/Pagination.vue').then((m) => m.default),
    },
    {
        path: '/placeholder',
        name: 'placeholder',
        label: 'Placeholder',
        view: () => import('./views/Placeholder.vue').then((m) => m.default),
    },
    {
        path: '/popover',
        name: 'popover',
        label: 'Popover',
        view: () => import('./views/Popover.vue').then((m) => m.default),
    },
    {
        path: '/separator',
        name: 'separator',
        label: 'Separator',
        view: () => import('./views/Separator.vue').then((m) => m.default),
    },
    {
        path: '/stepper',
        name: 'stepper',
        label: 'Stepper',
        view: () => import('./views/Stepper.vue').then((m) => m.default),
    },
    {
        path: '/table',
        name: 'table',
        label: 'Table',
        view: () => import('./views/Table.vue').then((m) => m.default),
    },
    {
        path: '/tag',
        name: 'tag',
        label: 'Tag',
        view: () => import('./views/Tag.vue').then((m) => m.default),
    },
    {
        path: '/timeago',
        name: 'timeago',
        label: 'Time Ago',
        view: () => import('./views/Timeago.vue').then((m) => m.default),
    },
    {
        path: '/toast',
        name: 'toast',
        label: 'Toast',
        view: () => import('./views/Toast.vue').then((m) => m.default),
    },
    {
        path: '/tooltip',
        name: 'tooltip',
        label: 'Tooltip',
        view: () => import('./views/Tooltip.vue').then((m) => m.default),
    },
    {
        path: '/visually-hidden',
        name: 'visually-hidden',
        label: 'Visually Hidden',
        view: () => import('./views/VisuallyHidden.vue').then((m) => m.default),
    },
];
