import type VCContextMenu from './components/context-menu/ContextMenu.vue';
import type VCContextMenuCheckboxItem from './components/context-menu/ContextMenuCheckboxItem.vue';
import type VCContextMenuContent from './components/context-menu/ContextMenuContent.vue';
import type VCContextMenuGroup from './components/context-menu/ContextMenuGroup.vue';
import type VCContextMenuItem from './components/context-menu/ContextMenuItem.vue';
import type VCContextMenuItemIndicator from './components/context-menu/ContextMenuItemIndicator.vue';
import type VCContextMenuLabel from './components/context-menu/ContextMenuLabel.vue';
import type VCContextMenuRadioGroup from './components/context-menu/ContextMenuRadioGroup.vue';
import type VCContextMenuRadioItem from './components/context-menu/ContextMenuRadioItem.vue';
import type VCContextMenuSeparator from './components/context-menu/ContextMenuSeparator.vue';
import type VCContextMenuSub from './components/context-menu/ContextMenuSub.vue';
import type VCContextMenuSubContent from './components/context-menu/ContextMenuSubContent.vue';
import type VCContextMenuSubTrigger from './components/context-menu/ContextMenuSubTrigger.vue';
import type VCContextMenuTrigger from './components/context-menu/ContextMenuTrigger.vue';
import type VCDropdownMenu from './components/dropdown-menu/DropdownMenu.vue';
import type VCDropdownMenuArrow from './components/dropdown-menu/DropdownMenuArrow.vue';
import type VCDropdownMenuCheckboxItem from './components/dropdown-menu/DropdownMenuCheckboxItem.vue';
import type VCDropdownMenuContent from './components/dropdown-menu/DropdownMenuContent.vue';
import type VCDropdownMenuGroup from './components/dropdown-menu/DropdownMenuGroup.vue';
import type VCDropdownMenuItem from './components/dropdown-menu/DropdownMenuItem.vue';
import type VCDropdownMenuItemIndicator from './components/dropdown-menu/DropdownMenuItemIndicator.vue';
import type VCDropdownMenuLabel from './components/dropdown-menu/DropdownMenuLabel.vue';
import type VCDropdownMenuRadioGroup from './components/dropdown-menu/DropdownMenuRadioGroup.vue';
import type VCDropdownMenuRadioItem from './components/dropdown-menu/DropdownMenuRadioItem.vue';
import type VCDropdownMenuSeparator from './components/dropdown-menu/DropdownMenuSeparator.vue';
import type VCDropdownMenuSub from './components/dropdown-menu/DropdownMenuSub.vue';
import type VCDropdownMenuSubContent from './components/dropdown-menu/DropdownMenuSubContent.vue';
import type VCDropdownMenuSubTrigger from './components/dropdown-menu/DropdownMenuSubTrigger.vue';
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
import type VCPresence from './components/presence/Presence.vue';
import type VCTooltip from './components/tooltip/Tooltip.vue';
import type VCTooltipArrow from './components/tooltip/TooltipArrow.vue';
import type VCTooltipContent from './components/tooltip/TooltipContent.vue';
import type VCTooltipProvider from './components/tooltip/TooltipProvider.vue';
import type VCTooltipTrigger from './components/tooltip/TooltipTrigger.vue';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCPresence: typeof VCPresence,
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
        VCDropdownMenuCheckboxItem: typeof VCDropdownMenuCheckboxItem,
        VCDropdownMenuRadioGroup: typeof VCDropdownMenuRadioGroup,
        VCDropdownMenuRadioItem: typeof VCDropdownMenuRadioItem,
        VCDropdownMenuItemIndicator: typeof VCDropdownMenuItemIndicator,
        VCDropdownMenuLabel: typeof VCDropdownMenuLabel,
        VCDropdownMenuSeparator: typeof VCDropdownMenuSeparator,
        VCDropdownMenuGroup: typeof VCDropdownMenuGroup,
        VCDropdownMenuSub: typeof VCDropdownMenuSub,
        VCDropdownMenuSubTrigger: typeof VCDropdownMenuSubTrigger,
        VCDropdownMenuSubContent: typeof VCDropdownMenuSubContent,
        VCDropdownMenuArrow: typeof VCDropdownMenuArrow,
        VCContextMenu: typeof VCContextMenu,
        VCContextMenuTrigger: typeof VCContextMenuTrigger,
        VCContextMenuContent: typeof VCContextMenuContent,
        VCContextMenuItem: typeof VCContextMenuItem,
        VCContextMenuCheckboxItem: typeof VCContextMenuCheckboxItem,
        VCContextMenuRadioGroup: typeof VCContextMenuRadioGroup,
        VCContextMenuRadioItem: typeof VCContextMenuRadioItem,
        VCContextMenuItemIndicator: typeof VCContextMenuItemIndicator,
        VCContextMenuLabel: typeof VCContextMenuLabel,
        VCContextMenuSeparator: typeof VCContextMenuSeparator,
        VCContextMenuGroup: typeof VCContextMenuGroup,
        VCContextMenuSub: typeof VCContextMenuSub,
        VCContextMenuSubTrigger: typeof VCContextMenuSubTrigger,
        VCContextMenuSubContent: typeof VCContextMenuSubContent,
    }
}
