import {
    computed,
    ref,
    shallowRef,
} from 'vue';
import type { Component, ComputedRef, Ref } from 'vue';

export type ModalView<P extends Record<string, any> = Record<string, any>> = {
    /**
     * Distinguishing key. Used as the Vue render `key` so swapping views
     * remounts the content (state inside the previous view is discarded).
     */
    key?: string | number | symbol;
    /** Component to render in the modal body. */
    component: Component;
    /** Props passed to the rendered component. */
    props?: P;
    /** Optional title to render in `<VCModalTitle>` when no slot is provided. */
    title?: string;
};

export type UseModalOptions = {
    /** Initial view to push when the modal opens. Optional — open() can be called without a starting view. */
    initialView?: ModalView;
    /**
     * Called after the modal closes (after the view stack is cleared).
     * Use this for cleanup (resetting form state, refetching parent data, etc.).
     */
    onClose?: () => void;
};

export type UseModalReturn = {
    /** Reactive open/closed state. Bind to `<VCModal v-model:open>`. */
    isOpen: Ref<boolean>;
    /** Current top-of-stack view, or `undefined` when the stack is empty. */
    currentView: ComputedRef<ModalView | undefined>;
    /** True when `popView()` would do something (i.e. stack depth > 1). */
    hasHistory: ComputedRef<boolean>;
    /** Current stack depth. */
    depth: ComputedRef<number>;

    /** Open the modal. If `view` is supplied, it becomes the initial entry on the stack. */
    open: (view?: ModalView) => void;
    /** Close the modal and clear the stack. Fires `onClose`. */
    close: () => void;
    /** Push a view onto the stack. Opens the modal if it isn't open already. */
    pushView: (view: ModalView) => void;
    /** Pop the top view. If the stack would become empty, closes the modal instead. */
    popView: () => void;
    /** Replace the entire stack with a single view. Opens the modal if needed. */
    replaceView: (view: ModalView) => void;
    /** Programmatic update for v-model:open. */
    setOpen: (next: boolean) => void;
};

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
        isOpen.value = false;
        setStack([]);
        options.onClose?.();
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
