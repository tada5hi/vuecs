// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsOverlays, {
    AlertDialogManager,
    VCAlertDialogProvider,
    useAlertDialog,
} from '../../src';

describe('AlertDialogManager', () => {
    it('queues a request and resolves true on settle(true)', async () => {
        const m = new AlertDialogManager();
        const p = m.confirm({ title: 'x' });
        expect(m.queue.value.length).toBe(1);

        m.settle(true);
        await expect(p).resolves.toBe(true);
        expect(m.queue.value.length).toBe(0);
    });

    it('resolves false on settle(false)', async () => {
        const m = new AlertDialogManager();
        const p = m.confirm();
        m.settle(false);
        await expect(p).resolves.toBe(false);
    });

    it('processes concurrent requests FIFO', async () => {
        const m = new AlertDialogManager();
        const p1 = m.confirm({ title: 'first' });
        const p2 = m.confirm({ title: 'second' });

        expect(m.queue.value.length).toBe(2);
        expect(m.queue.value[0]?.options.title).toBe('first');

        m.settle(true); // resolves the first
        m.settle(false); // resolves the second

        await expect(p1).resolves.toBe(true);
        await expect(p2).resolves.toBe(false);
    });

    it('clear() cancels every pending request as false', async () => {
        const m = new AlertDialogManager();
        const p1 = m.confirm();
        const p2 = m.confirm();

        m.clear();

        await expect(p1).resolves.toBe(false);
        await expect(p2).resolves.toBe(false);
        expect(m.queue.value.length).toBe(0);
    });

    it('resolves false WITHOUT enqueuing on the server (no window)', async () => {
        vi.stubGlobal('window', undefined);
        try {
            const m = new AlertDialogManager();
            const p = m.confirm({ title: 'x' });
            expect(m.queue.value.length).toBe(0);
            await expect(p).resolves.toBe(false);
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('is app-scoped — two managers keep isolated queues', () => {
        const a = new AlertDialogManager();
        const b = new AlertDialogManager();
        a.confirm({ title: 'a' });
        expect(a.queue.value.length).toBe(1);
        expect(b.queue.value.length).toBe(0);
        a.clear();
    });
});

describe('<VCAlertDialogProvider> host (app-scoped)', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Mount a harness that captures `useAlertDialog()` (injecting the app manager)
    // and renders the host (which injects the SAME app manager).
    function mountHost() {
        let confirm!: ReturnType<typeof useAlertDialog>;
        const Harness = defineComponent({
            setup() {
                confirm = useAlertDialog();
                return () => h(VCAlertDialogProvider);
            },
        });
        mount(Harness, {
            global: { plugins: [[vuecsOverlays, {}]] },
            attachTo: document.body,
        });
        return confirm;
    }

    it('renders the queued request and resolves true via the action button', async () => {
        const confirm = mountHost();
        await nextTick();

        const p = confirm({
            title: 'Delete project?', 
            confirmLabel: 'Delete', 
            cancelLabel: 'Keep', 
        });
        await nextTick();
        await nextTick();

        expect(document.body.textContent).toContain('Delete project?');

        const action = Array.from(document.body.querySelectorAll('button'))
            .find((b) => b.textContent === 'Delete');
        expect(action).not.toBeUndefined();
        action!.click();

        await expect(p).resolves.toBe(true);
    });

    it('resolves false via the cancel button', async () => {
        const confirm = mountHost();
        await nextTick();

        const p = confirm({ confirmLabel: 'Delete', cancelLabel: 'Keep' });
        await nextTick();
        await nextTick();

        const cancel = Array.from(document.body.querySelectorAll('button'))
            .find((b) => b.textContent === 'Keep');
        expect(cancel).not.toBeUndefined();
        cancel!.click();

        await expect(p).resolves.toBe(false);
    });

    it('throws when useAlertDialog() is called with no manager (plugin not installed)', () => {
        expect(() => useAlertDialog()).toThrow();
    });
});
