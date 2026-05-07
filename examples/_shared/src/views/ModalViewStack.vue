<script setup lang="ts">
import {
    VCModal,
    VCModalContent,
    VCModalTitle,
    useModal,
} from '@vuecs/overlays';
import { defineComponent, h } from 'vue';

const modal = useModal();

const itemBtnStyle = 'border-radius: 0.375rem; border: 1px solid var(--vc-color-border); ' +
    'background-color: var(--vc-color-bg-muted); padding: 0.375rem 0.75rem; ' +
    'font-size: 0.875rem; cursor: pointer;';
const colStyle = 'display: flex; flex-direction: column; gap: 0.5rem;';
const mutedSm = 'font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;';
const mutedXs = 'font-size: 0.75rem; color: var(--vc-color-fg-muted); margin: 0;';

const ListView = defineComponent({
    setup() {
        return () => h('div', { style: colStyle }, [
            h('p', { style: mutedSm }, 'Pick an item to see its details:'),
            h('button', {
                type: 'button',
                style: itemBtnStyle,
                onClick: () => modal.pushView({
                    component: DetailView,
                    props: { id: 1 },
                    title: 'Item #1',
                }),
            }, 'Item 1'),
            h('button', {
                type: 'button',
                style: itemBtnStyle,
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
        return () => h('div', { style: colStyle }, [
            h('p', { style: 'font-size: 0.875rem; margin: 0;' }, `You're looking at item #${props.id}.`),
            h('p', { style: mutedXs }, 'Use the back arrow to return to the list.'),
        ]);
    },
});
</script>

<template>
    <button
        type="button"
        class="vc-modal-stack-trigger"
        @click="modal.open({ component: ListView, title: 'List' })"
    >
        Open list
    </button>
    <VCModal
        :open="modal.isOpen.value"
        @update:open="modal.setOpen"
    >
        <VCModalContent>
            <header style="display: flex; align-items: center; gap: 0.5rem;">
                <button
                    v-if="modal.hasHistory.value"
                    type="button"
                    aria-label="Back"
                    class="vc-modal-stack-back"
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

<style scoped>
.vc-modal-stack-trigger {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    border: 0;
    background-color: var(--vc-color-primary-600);
    color: var(--vc-color-on-primary, #fff);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}
.vc-modal-stack-trigger:hover {
    background-color: var(--vc-color-primary-700);
}
.vc-modal-stack-back {
    display: inline-flex;
    height: 1.75rem;
    width: 1.75rem;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    border-radius: 0.375rem;
    color: var(--vc-color-fg-muted);
    cursor: pointer;
}
.vc-modal-stack-back:hover {
    background-color: var(--vc-color-bg-muted);
    color: var(--vc-color-fg);
}
</style>
