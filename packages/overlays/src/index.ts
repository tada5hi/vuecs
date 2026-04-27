import type { App, Plugin } from 'vue';
import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { CoreOptions } from '@vuecs/core';

import './vue';
import { registerOverlayConfigDefaults } from './config';
import {
    VCContextMenu,
    VCContextMenuCheckboxItem,
    VCContextMenuContent,
    VCContextMenuGroup,
    VCContextMenuItem,
    VCContextMenuItemIndicator,
    VCContextMenuLabel,
    VCContextMenuRadioGroup,
    VCContextMenuRadioItem,
    VCContextMenuSeparator,
    VCContextMenuSub,
    VCContextMenuSubContent,
    VCContextMenuSubTrigger,
    VCContextMenuTrigger,
    VCDropdownMenu,
    VCDropdownMenuArrow,
    VCDropdownMenuCheckboxItem,
    VCDropdownMenuContent,
    VCDropdownMenuGroup,
    VCDropdownMenuItem,
    VCDropdownMenuItemIndicator,
    VCDropdownMenuLabel,
    VCDropdownMenuRadioGroup,
    VCDropdownMenuRadioItem,
    VCDropdownMenuSeparator,
    VCDropdownMenuSub,
    VCDropdownMenuSubContent,
    VCDropdownMenuSubTrigger,
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
    VCPresence,
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
    const config = installConfigManager(app, options);
    registerOverlayConfigDefaults(config);

    Object.entries({
        VCPresence,
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
        VCDropdownMenuCheckboxItem,
        VCDropdownMenuRadioGroup,
        VCDropdownMenuRadioItem,
        VCDropdownMenuItemIndicator,
        VCDropdownMenuLabel,
        VCDropdownMenuSeparator,
        VCDropdownMenuGroup,
        VCDropdownMenuSub,
        VCDropdownMenuSubTrigger,
        VCDropdownMenuSubContent,
        VCDropdownMenuArrow,
        VCContextMenu,
        VCContextMenuTrigger,
        VCContextMenuContent,
        VCContextMenuItem,
        VCContextMenuCheckboxItem,
        VCContextMenuRadioGroup,
        VCContextMenuRadioItem,
        VCContextMenuItemIndicator,
        VCContextMenuLabel,
        VCContextMenuSeparator,
        VCContextMenuGroup,
        VCContextMenuSub,
        VCContextMenuSubTrigger,
        VCContextMenuSubContent,
    }).forEach(([name, component]) => {
        app.component(name, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
