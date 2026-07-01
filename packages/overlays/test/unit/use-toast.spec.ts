// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsOverlays, { useToast } from '../../src';

describe('useToast (app-scoped)', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Capture `useToast()` from a component setup (its inject context) — the
    // returned API is bound to that app's ToastManager.
    function mountToast() {
        let api!: ReturnType<typeof useToast>;
        const Harness = defineComponent({
            setup() {
                api = useToast();
                return () => h('div');
            },
        });
        mount(Harness, {
            global: { plugins: [[vuecsOverlays, {}]] },
            attachTo: document.body,
        });
        return api;
    }

    it('add() enqueues and returns the id; dismiss() removes', () => {
        const toast = mountToast();
        const id = toast.add({ title: 'Saved' });
        expect(toast.entries.value.length).toBe(1);
        expect(toast.entries.value[0]?.id).toBe(id);

        toast.dismiss(id);
        expect(toast.entries.value.length).toBe(0);
    });

    it('clear() empties the queue', () => {
        const toast = mountToast();
        toast.add({ title: 'a' });
        toast.add({ title: 'b' });
        expect(toast.entries.value.length).toBe(2);

        toast.clear();
        expect(toast.entries.value.length).toBe(0);
    });

    it('is app-scoped — separate apps keep isolated queues', () => {
        const app1 = mountToast();
        const app2 = mountToast();
        app1.add({ title: 'only-in-app1' });
        expect(app1.entries.value.length).toBe(1);
        expect(app2.entries.value.length).toBe(0);
    });

    it('throws when useToast() is called with no manager (plugin not installed)', () => {
        expect(() => useToast()).toThrow();
    });
});
