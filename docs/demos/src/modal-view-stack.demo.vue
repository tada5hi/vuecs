<script setup lang="ts">
import {
    VCModal,
    VCModalContent,
    VCModalTitle,
    useModal,
} from '@vuecs/overlays';
import { defineComponent, h } from 'vue';

const modal = useModal();

const ListView = defineComponent({
    setup() {
        return () => h('div', { class: 'flex flex-col gap-2' }, [
            h('p', { class: 'text-sm text-fg-muted' }, 'Pick an item to see its details:'),
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
            h('p', { class: 'text-sm' }, `You're looking at item #${props.id}.`),
            h('p', { class: 'text-xs text-fg-muted' }, 'Use the back arrow to return to the list.'),
        ]);
    },
});
</script>

<template>
    <button
        type="button"
        class="inline-flex w-fit items-center justify-center rounded-md bg-primary-600
            px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-700"
        @click="modal.open({ component: ListView, title: 'List' })"
    >
        Open list
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
</template>
