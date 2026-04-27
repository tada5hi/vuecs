<script lang="ts">
import {
    VCContextMenu,
    VCContextMenuContent,
    VCContextMenuItem,
    VCContextMenuLabel,
    VCContextMenuSeparator,
    VCContextMenuTrigger,
    VCDropdownMenu,
    VCDropdownMenuCheckboxItem,
    VCDropdownMenuContent,
    VCDropdownMenuItem,
    VCDropdownMenuItemIndicator,
    VCDropdownMenuLabel,
    VCDropdownMenuRadioGroup,
    VCDropdownMenuRadioItem,
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
    VCPopoverContent,
    VCPopoverTrigger,
    VCTooltip,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
    useModal,
} from '@vuecs/overlays';
import { defineNuxtComponent } from '#app';
import { defineComponent, h, ref } from '#imports';

export default defineNuxtComponent({
    components: {
        VCContextMenu,
        VCContextMenuContent,
        VCContextMenuItem,
        VCContextMenuLabel,
        VCContextMenuSeparator,
        VCContextMenuTrigger,
        VCDropdownMenu,
        VCDropdownMenuCheckboxItem,
        VCDropdownMenuContent,
        VCDropdownMenuItem,
        VCDropdownMenuItemIndicator,
        VCDropdownMenuLabel,
        VCDropdownMenuRadioGroup,
        VCDropdownMenuRadioItem,
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
        VCPopoverContent,
        VCPopoverTrigger,
        VCTooltip,
        VCTooltipContent,
        VCTooltipProvider,
        VCTooltipTrigger,
    },
    setup() {
        const open = ref(false);
        const checked = ref(true);
        const radio = ref<string>('eu');
        const lastAction = ref('—');

        const modal = useModal();

        const ListView = defineComponent({
            setup() {
                return () => h('div', { class: 'flex flex-col gap-2' }, [
                    h('p', { class: 'text-sm text-fg-muted' }, 'Pick an item:'),
                    h('button', {
                        type: 'button',
                        class: 'rounded-md border border-border bg-bg-muted px-3 py-1.5 text-sm hover:bg-bg-elevated',
                        onClick: () => modal.pushView({
                            component: DetailView,
                            props: { id: 1 },
                            title: 'Item #1',
                        }),
                    }, 'Item 1'),
                    h('button', {
                        type: 'button',
                        class: 'rounded-md border border-border bg-bg-muted px-3 py-1.5 text-sm hover:bg-bg-elevated',
                        onClick: () => modal.pushView({
                            component: DetailView,
                            props: { id: 2 },
                            title: 'Item #2',
                        }),
                    }, 'Item 2'),
                ]);
            },
        });

        const DetailView = defineComponent({
            props: { id: { type: Number, required: true } },
            setup(props) {
                return () => h('div', { class: 'flex flex-col gap-2' }, [
                    h('p', { class: 'text-sm' }, `Looking at item #${props.id}.`),
                    h('p', { class: 'text-xs text-fg-muted' }, 'Use the back arrow to return.'),
                ]);
            },
        });

        return {
            open,
            checked,
            radio,
            lastAction,
            modal,
            ListView,
        };
    },
});
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-8">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <i class="fa fa-window-restore text-blue-500" /> Overlays
        </h3>

        <section class="space-y-2">
            <h4 class="text-lg font-semibold">
                Modal
            </h4>
            <div class="flex flex-wrap gap-3">
                <VCModal v-model:open="open">
                    <VCModalTrigger
                        class="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium
                            text-on-primary hover:bg-primary-700"
                    >
                        Open dialog
                    </VCModalTrigger>
                    <VCModalContent>
                        <VCModalTitle>Confirm action</VCModalTitle>
                        <VCModalDescription>
                            This will permanently delete the record.
                        </VCModalDescription>
                        <div class="flex justify-end gap-2">
                            <VCModalClose
                                class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm
                                    font-medium hover:bg-bg-muted"
                            >
                                Cancel
                            </VCModalClose>
                        </div>
                    </VCModalContent>
                </VCModal>

                <button
                    type="button"
                    class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium
                        hover:bg-bg-muted"
                    @click="modal.open({ component: ListView, title: 'List' })"
                >
                    Open useModal() view stack
                </button>

                <VCModal
                    :open="modal.isOpen.value"
                    @update:open="modal.setOpen"
                >
                    <VCModalContent>
                        <header class="flex items-center gap-2">
                            <button
                                v-if="modal.hasHistory.value"
                                type="button"
                                aria-label="Back"
                                class="inline-flex h-7 w-7 items-center justify-center rounded-md
                                    text-fg-muted hover:bg-bg-muted hover:text-fg"
                                @click="modal.popView()"
                            >
                                ←
                            </button>
                            <VCModalTitle>{{ modal.currentView.value?.title ?? 'Modal' }}</VCModalTitle>
                        </header>
                        <component
                            :is="modal.currentView.value.component"
                            v-if="modal.currentView.value"
                            v-bind="modal.currentView.value.props"
                        />
                    </VCModalContent>
                </VCModal>
            </div>
        </section>

        <section class="space-y-2">
            <h4 class="text-lg font-semibold">
                Popover
            </h4>
            <VCPopover>
                <VCPopoverTrigger
                    class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium
                        hover:bg-bg-muted"
                >
                    Open popover
                </VCPopoverTrigger>
                <VCPopoverContent
                    side="bottom"
                    :side-offset="8"
                >
                    <p class="text-sm">
                        Hello from a popover.
                    </p>
                    <VCPopoverArrow />
                </VCPopoverContent>
            </VCPopover>
        </section>

        <section class="space-y-2">
            <h4 class="text-lg font-semibold">
                Tooltip
            </h4>
            <VCTooltipProvider :delay-duration="200">
                <VCTooltip>
                    <VCTooltipTrigger
                        class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium
                            hover:bg-bg-muted"
                    >
                        Hover me
                    </VCTooltipTrigger>
                    <VCTooltipContent>Helpful hint</VCTooltipContent>
                </VCTooltip>
            </VCTooltipProvider>
        </section>

        <section class="space-y-2">
            <h4 class="text-lg font-semibold">
                DropdownMenu
            </h4>
            <VCDropdownMenu>
                <VCDropdownMenuTrigger
                    class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium
                        hover:bg-bg-muted"
                >
                    Actions ▾
                </VCDropdownMenuTrigger>
                <VCDropdownMenuContent>
                    <VCDropdownMenuLabel>Manage</VCDropdownMenuLabel>
                    <VCDropdownMenuItem @select="lastAction = 'edit'">
                        Edit
                    </VCDropdownMenuItem>
                    <VCDropdownMenuItem @select="lastAction = 'duplicate'">
                        Duplicate
                    </VCDropdownMenuItem>
                    <VCDropdownMenuSeparator />
                    <VCDropdownMenuCheckboxItem v-model="checked">
                        <VCDropdownMenuItemIndicator />
                        Show details
                    </VCDropdownMenuCheckboxItem>
                    <VCDropdownMenuSeparator />
                    <VCDropdownMenuLabel>Region</VCDropdownMenuLabel>
                    <VCDropdownMenuRadioGroup v-model="radio">
                        <VCDropdownMenuRadioItem value="us">
                            <VCDropdownMenuItemIndicator>•</VCDropdownMenuItemIndicator>
                            US
                        </VCDropdownMenuRadioItem>
                        <VCDropdownMenuRadioItem value="eu">
                            <VCDropdownMenuItemIndicator>•</VCDropdownMenuItemIndicator>
                            EU
                        </VCDropdownMenuRadioItem>
                        <VCDropdownMenuRadioItem value="ap">
                            <VCDropdownMenuItemIndicator>•</VCDropdownMenuItemIndicator>
                            APAC
                        </VCDropdownMenuRadioItem>
                    </VCDropdownMenuRadioGroup>
                </VCDropdownMenuContent>
            </VCDropdownMenu>
            <p class="text-xs text-fg-muted">
                Last action: <span class="font-mono">{{ lastAction }}</span>
                · Show details: <span class="font-mono">{{ checked }}</span>
                · Region: <span class="font-mono">{{ radio }}</span>
            </p>
        </section>

        <section class="space-y-2">
            <h4 class="text-lg font-semibold">
                ContextMenu
            </h4>
            <VCContextMenu>
                <VCContextMenuTrigger>
                    <div
                        class="flex h-32 w-72 items-center justify-center rounded-md border-2
                            border-dashed border-border bg-bg-muted text-sm text-fg-muted select-none"
                    >
                        Right-click in this box
                    </div>
                </VCContextMenuTrigger>
                <VCContextMenuContent>
                    <VCContextMenuLabel>Item options</VCContextMenuLabel>
                    <VCContextMenuItem @select="lastAction = 'open'">
                        Open
                    </VCContextMenuItem>
                    <VCContextMenuItem @select="lastAction = 'rename'">
                        Rename
                    </VCContextMenuItem>
                    <VCContextMenuSeparator />
                    <VCContextMenuItem @select="lastAction = 'delete'">
                        Delete
                    </VCContextMenuItem>
                </VCContextMenuContent>
            </VCContextMenu>
        </section>
    </div>
</template>
