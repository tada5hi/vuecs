import { 
    describe, 
    expect, 
    it, 
    vi, 
} from 'vitest';
import { defineComponent, h } from 'vue';
import { useModal } from '../../src';

const View1 = defineComponent({ name: 'View1', render: () => h('div', '1') });
const View2 = defineComponent({ name: 'View2', render: () => h('div', '2') });
const View3 = defineComponent({ name: 'View3', render: () => h('div', '3') });

describe('useModal', () => {
    it('starts closed with empty stack', () => {
        const m = useModal();
        expect(m.isOpen.value).toBe(false);
        expect(m.depth.value).toBe(0);
        expect(m.currentView.value).toBeUndefined();
        expect(m.hasHistory.value).toBe(false);
    });

    it('open() with a view sets the stack and opens', () => {
        const m = useModal();
        m.open({ component: View1 });
        expect(m.isOpen.value).toBe(true);
        expect(m.depth.value).toBe(1);
        expect(m.currentView.value?.component).toBe(View1);
    });

    it('open() with no view falls back to initialView', () => {
        const m = useModal({ initialView: { component: View1 } });
        m.open();
        expect(m.depth.value).toBe(1);
        expect(m.currentView.value?.component).toBe(View1);
    });

    it('open() without view or initialView still opens', () => {
        const m = useModal();
        m.open();
        expect(m.isOpen.value).toBe(true);
        expect(m.depth.value).toBe(0);
    });

    it('close() clears the stack and fires onClose', () => {
        const onClose = vi.fn();
        const m = useModal({ onClose });
        m.open({ component: View1 });
        m.pushView({ component: View2 });
        m.close();
        expect(m.isOpen.value).toBe(false);
        expect(m.depth.value).toBe(0);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('pushView() adds to the stack and opens if needed', () => {
        const m = useModal();
        m.pushView({ component: View1 });
        expect(m.isOpen.value).toBe(true);
        expect(m.depth.value).toBe(1);

        m.pushView({ component: View2 });
        expect(m.depth.value).toBe(2);
        expect(m.currentView.value?.component).toBe(View2);
        expect(m.hasHistory.value).toBe(true);
    });

    it('popView() goes back when there is history', () => {
        const m = useModal();
        m.pushView({ component: View1 });
        m.pushView({ component: View2 });
        m.pushView({ component: View3 });

        m.popView();
        expect(m.depth.value).toBe(2);
        expect(m.currentView.value?.component).toBe(View2);

        m.popView();
        expect(m.depth.value).toBe(1);
        expect(m.currentView.value?.component).toBe(View1);
    });

    it('popView() at the bottom of the stack closes the modal', () => {
        const onClose = vi.fn();
        const m = useModal({ onClose });
        m.pushView({ component: View1 });

        m.popView();
        expect(m.isOpen.value).toBe(false);
        expect(m.depth.value).toBe(0);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('does NOT fire onClose when close() is called on an already-closed modal', () => {
        const onClose = vi.fn();
        const m = useModal({ onClose });
        // Already closed — close() should be a no-op, not re-fire onClose.
        m.close();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('does NOT fire onClose when popView() runs on an empty stack', () => {
        const onClose = vi.fn();
        const m = useModal({ onClose });
        // No views pushed yet, modal is closed → popView falls through to
        // close() but onClose must not double-fire.
        m.popView();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('does NOT fire onClose on duplicate setOpen(false)', () => {
        const onClose = vi.fn();
        const m = useModal({ onClose });
        m.open({ component: View1 });
        m.setOpen(false);
        expect(onClose).toHaveBeenCalledOnce();
        // Second false — should be a no-op, not re-fire onClose.
        m.setOpen(false);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('replaceView() swaps the entire stack', () => {
        const m = useModal();
        m.pushView({ component: View1 });
        m.pushView({ component: View2 });
        m.replaceView({ component: View3 });
        expect(m.depth.value).toBe(1);
        expect(m.currentView.value?.component).toBe(View3);
    });

    it('replaceView() opens the modal if it was closed', () => {
        const m = useModal();
        m.replaceView({ component: View1 });
        expect(m.isOpen.value).toBe(true);
    });

    it('setOpen(true|false) drives the v-model contract', () => {
        const m = useModal({ initialView: { component: View1 } });
        m.setOpen(true);
        expect(m.isOpen.value).toBe(true);
        expect(m.depth.value).toBe(1);

        m.setOpen(false);
        expect(m.isOpen.value).toBe(false);
        expect(m.depth.value).toBe(0);
    });

    it('hasHistory toggles correctly across pushView / popView', () => {
        const m = useModal();
        m.pushView({ component: View1 });
        expect(m.hasHistory.value).toBe(false);
        m.pushView({ component: View2 });
        expect(m.hasHistory.value).toBe(true);
        m.popView();
        expect(m.hasHistory.value).toBe(false);
    });
});
