// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsOverlays, {
    VCConfirmDialog,
    useConfirm,
    useConfirmController,
} from '../../src';

const {
    queue, 
    settle, 
    clear, 
} = useConfirmController();

describe('useConfirm queue', () => {
    afterEach(() => {
        clear();
    });

    it('queues a request and resolves true on settle(true)', async () => {
        const confirm = useConfirm();
        const p = confirm({ title: 'x' });
        expect(queue.value.length).toBe(1);

        settle(true);
        await expect(p).resolves.toBe(true);
        expect(queue.value.length).toBe(0);
    });

    it('resolves false on settle(false)', async () => {
        const confirm = useConfirm();
        const p = confirm();
        settle(false);
        await expect(p).resolves.toBe(false);
    });

    it('processes concurrent requests FIFO', async () => {
        const confirm = useConfirm();
        const p1 = confirm({ title: 'first' });
        const p2 = confirm({ title: 'second' });

        expect(queue.value.length).toBe(2);
        expect(queue.value[0]?.options.title).toBe('first');

        settle(true); // resolves the first
        settle(false); // resolves the second

        await expect(p1).resolves.toBe(true);
        await expect(p2).resolves.toBe(false);
    });

    it('clear() cancels every pending request as false', async () => {
        const confirm = useConfirm();
        const p1 = confirm();
        const p2 = confirm();

        clear();

        await expect(p1).resolves.toBe(false);
        await expect(p2).resolves.toBe(false);
        expect(queue.value.length).toBe(0);
    });

    it('resolves false WITHOUT enqueuing on the server (no window)', async () => {
        // SSR guard: keeps the process-wide singleton queue empty during
        // server render, so it can never leak one request into another.
        vi.stubGlobal('window', undefined);
        try {
            const confirm = useConfirm();
            const p = confirm({ title: 'x' });
            expect(queue.value.length).toBe(0);
            await expect(p).resolves.toBe(false);
        } finally {
            vi.unstubAllGlobals();
        }
    });
});

describe('<VCConfirmDialog> host', () => {
    afterEach(() => {
        clear();
        document.body.innerHTML = '';
    });

    it('renders the queued request and resolves true via the action button', async () => {
        mount(VCConfirmDialog, {
            global: { plugins: [[vuecsOverlays, {}]] },
            attachTo: document.body,
        });
        await nextTick();

        const confirm = useConfirm();
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
        mount(VCConfirmDialog, {
            global: { plugins: [[vuecsOverlays, {}]] },
            attachTo: document.body,
        });
        await nextTick();

        const confirm = useConfirm();
        const p = confirm({ confirmLabel: 'Delete', cancelLabel: 'Keep' });
        await nextTick();
        await nextTick();

        const cancel = Array.from(document.body.querySelectorAll('button'))
            .find((b) => b.textContent === 'Keep');
        expect(cancel).not.toBeUndefined();
        cancel!.click();

        await expect(p).resolves.toBe(false);
    });
});
