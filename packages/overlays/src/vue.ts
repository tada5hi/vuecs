import type VCContextMenu from './components/context-menu/ContextMenu.vue';
import type VCContextMenuContent from './components/context-menu/ContextMenuContent.vue';
import type VCContextMenuGroup from './components/context-menu/ContextMenuGroup.vue';
import type VCContextMenuItem from './components/context-menu/ContextMenuItem.vue';
import type VCContextMenuLabel from './components/context-menu/ContextMenuLabel.vue';
import type VCContextMenuSeparator from './components/context-menu/ContextMenuSeparator.vue';
import type VCContextMenuTrigger from './components/context-menu/ContextMenuTrigger.vue';
import type VCDropdownMenu from './components/dropdown-menu/DropdownMenu.vue';
import type VCDropdownMenuArrow from './components/dropdown-menu/DropdownMenuArrow.vue';
import type VCDropdownMenuContent from './components/dropdown-menu/DropdownMenuContent.vue';
import type VCDropdownMenuGroup from './components/dropdown-menu/DropdownMenuGroup.vue';
import type VCDropdownMenuItem from './components/dropdown-menu/DropdownMenuItem.vue';
import type VCDropdownMenuLabel from './components/dropdown-menu/DropdownMenuLabel.vue';
import type VCDropdownMenuSeparator from './components/dropdown-menu/DropdownMenuSeparator.vue';
import type VCDropdownMenuTrigger from './components/dropdown-menu/DropdownMenuTrigger.vue';
import type VCModal from './components/modal/Modal.vue';
import type VCModalClose from './components/modal/ModalClose.vue';
import type VCModalContent from './components/modal/ModalContent.vue';
import type VCModalDescription from './components/modal/ModalDescription.vue';
import type VCModalTitle from './components/modal/ModalTitle.vue';
import type VCModalTrigger from './components/modal/ModalTrigger.vue';
import type VCPopover from './components/popover/Popover.vue';
import type VCPopoverArrow from './components/popover/PopoverArrow.vue';
import type VCPopoverClose from './components/popover/PopoverClose.vue';
import type VCPopoverContent from './components/popover/PopoverContent.vue';
import type VCPopoverTrigger from './components/popover/PopoverTrigger.vue';
import type VCTooltip from './components/tooltip/Tooltip.vue';
import type VCTooltipArrow from './components/tooltip/TooltipArrow.vue';
import type VCTooltipContent from './components/tooltip/TooltipContent.vue';
import type VCTooltipProvider from './components/tooltip/TooltipProvider.vue';
import type VCTooltipTrigger from './components/tooltip/TooltipTrigger.vue';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCModal: typeof VCModal,
        VCModalTrigger: typeof VCModalTrigger,
        VCModalContent: typeof VCModalContent,
        VCModalTitle: typeof VCModalTitle,
        VCModalDescription: typeof VCModalDescription,
        VCModalClose: typeof VCModalClose,
        VCPopover: typeof VCPopover,
        VCPopoverTrigger: typeof VCPopoverTrigger,
        VCPopoverContent: typeof VCPopoverContent,
        VCPopoverArrow: typeof VCPopoverArrow,
        VCPopoverClose: typeof VCPopoverClose,
        VCTooltipProvider: typeof VCTooltipProvider,
        VCTooltip: typeof VCTooltip,
        VCTooltipTrigger: typeof VCTooltipTrigger,
        VCTooltipContent: typeof VCTooltipContent,
        VCTooltipArrow: typeof VCTooltipArrow,
        VCDropdownMenu: typeof VCDropdownMenu,
        VCDropdownMenuTrigger: typeof VCDropdownMenuTrigger,
        VCDropdownMenuContent: typeof VCDropdownMenuContent,
        VCDropdownMenuItem: typeof VCDropdownMenuItem,
        VCDropdownMenuLabel: typeof VCDropdownMenuLabel,
        VCDropdownMenuSeparator: typeof VCDropdownMenuSeparator,
        VCDropdownMenuGroup: typeof VCDropdownMenuGroup,
        VCDropdownMenuArrow: typeof VCDropdownMenuArrow,
        VCContextMenu: typeof VCContextMenu,
        VCContextMenuTrigger: typeof VCContextMenuTrigger,
        VCContextMenuContent: typeof VCContextMenuContent,
        VCContextMenuItem: typeof VCContextMenuItem,
        VCContextMenuLabel: typeof VCContextMenuLabel,
        VCContextMenuSeparator: typeof VCContextMenuSeparator,
        VCContextMenuGroup: typeof VCContextMenuGroup,
    }
}
