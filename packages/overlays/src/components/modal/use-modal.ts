import type { ModalView, UseModalOptions, UseModalReturn } from './types';
import { computed, ref, shallowRef } from 'vue';


/**
 * View-stack-aware modal state. Used in tandem with `<VCModal>`'s compound
 * components for flows like "list view → push detail view → pop back" without
 * stacking modals or fighting z-index.
 *
 * Originally proposed in https://github.com/tada5hi/vuecs/issues/1480.
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
    const isOpen = ref(false);
    const stack = shallowRef<ModalView[]>([]);

    const setStack = (next: ModalView[]) => {
        stack.value = next;
    };

    const currentView = computed(() => stack.value[stack.value.length - 1]);
    const depth = computed(() => stack.value.length);
    const hasHistory = computed(() => stack.value.length > 1);

    const open = (view?: ModalView) => {
        if (view) {
            setStack([view]);
        } else if (stack.value.length === 0 && options.initialView) {
            setStack([options.initialView]);
        }

        isOpen.value = true;
    };

    const close = () => {
        // Guard against double-fire: if already closed, don't re-invoke
        // onClose. Triggers: setOpen(false) on an already-closed modal,
        // popView() on an empty stack, duplicate update:open emissions.
        const wasOpen = isOpen.value;

        isOpen.value = false;
        setStack([]);

        if (wasOpen) {
            options.onClose?.();
        }
    };

    const pushView = (view: ModalView) => {
        setStack([...stack.value, view]);

        if (!isOpen.value) {
            isOpen.value = true;
        }
    };

    const popView = () => {
        if (stack.value.length <= 1) {
            close();

            return;
        }

        setStack(stack.value.slice(0, -1));
    };

    const replaceView = (view: ModalView) => {
        setStack([view]);

        if (!isOpen.value) {
            isOpen.value = true;
        }
    };

    const setOpen = (next: boolean) => {
        if (next) {
            open();
        } else {
            close();
        }
    };

    return {
        isOpen,
        currentView,
        hasHistory,
        depth,
        open,
        close,
        pushView,
        popView,
        replaceView,
        setOpen,
    };
}
