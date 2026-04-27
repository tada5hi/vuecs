import type { App, Plugin } from 'vue';
import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { CoreOptions } from '@vuecs/core';

import './vue';
import {
    VCContextMenu,
    VCContextMenuContent,
    VCContextMenuGroup,
    VCContextMenuItem,
    VCContextMenuLabel,
    VCContextMenuSeparator,
    VCContextMenuTrigger,
    VCDropdownMenu,
    VCDropdownMenuArrow,
    VCDropdownMenuContent,
    VCDropdownMenuGroup,
    VCDropdownMenuItem,
    VCDropdownMenuLabel,
    VCDropdownMenuSeparator,
    VCDropdownMenuTrigger,
    VCModal,
    VCModalClose,
    VCModalContent,
    VCModalDescription,
    VCModalTitle,
    VCModalTrigger,
    VCPopover,
    VCPopoverArrow,
    VCPopoverClose,
    VCPopoverContent,
    VCPopoverTrigger,
    VCTooltip,
    VCTooltipArrow,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
} from './components';

export * from './components';

export type Options = CoreOptions;

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);
    installConfigManager(app, options);

    Object.entries({
        VCModal,
        VCModalTrigger,
        VCModalContent,
        VCModalTitle,
        VCModalDescription,
        VCModalClose,
        VCPopover,
        VCPopoverTrigger,
        VCPopoverContent,
        VCPopoverArrow,
        VCPopoverClose,
        VCTooltipProvider,
        VCTooltip,
        VCTooltipTrigger,
        VCTooltipContent,
        VCTooltipArrow,
        VCDropdownMenu,
        VCDropdownMenuTrigger,
        VCDropdownMenuContent,
        VCDropdownMenuItem,
        VCDropdownMenuLabel,
        VCDropdownMenuSeparator,
        VCDropdownMenuGroup,
        VCDropdownMenuArrow,
        VCContextMenu,
        VCContextMenuTrigger,
        VCContextMenuContent,
        VCContextMenuItem,
        VCContextMenuLabel,
        VCContextMenuSeparator,
        VCContextMenuGroup,
    }).forEach(([name, component]) => {
        app.component(name, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
