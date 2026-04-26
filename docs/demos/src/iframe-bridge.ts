/*
 * Iframe runtime — runs inside each demo and coordinates with the parent
 * docs page via postMessage:
 *
 *   parent → iframe { type: 'set-color-mode', mode: 'light' | 'dark' }
 *   iframe → parent { type: 'demo-resize', height: number }
 *
 * The parent (`Demo.vue`) listens for `demo-resize` to size the iframe to
 * its content; the iframe listens for `set-color-mode` to flip the
 * `.dark` class on `<html>` so design-system tokens swap correctly.
 *
 * Origin is intentionally `'*'` — the iframe is same-origin in production
 * (served from the same docs host), and dev runs on localhost. No
 * untrusted parties are involved.
 */

type ParentMessage = { type: 'set-color-mode', mode: 'light' | 'dark' };

let pendingHeight: number | null = null;
let rafHandle: number | null = null;

const postHeight = (): void => {
    if (typeof window === 'undefined' || window.parent === window) return;
    const next = document.documentElement.scrollHeight;
    if (next === pendingHeight) return;
    pendingHeight = next;
    if (rafHandle !== null) cancelAnimationFrame(rafHandle);
    rafHandle = requestAnimationFrame(() => {
        rafHandle = null;
        window.parent.postMessage({ type: 'demo-resize', height: next }, '*');
    });
};

const applyColorMode = (mode: 'light' | 'dark'): void => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    // Mode flip can change line-heights / icon dimensions; re-measure.
    postHeight();
};

const handleParentMessage = (event: MessageEvent<ParentMessage>): void => {
    const { data } = event;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'set-color-mode') {
        applyColorMode(data.mode);
    }
};

export function installIframeBridge(): void {
    if (typeof window === 'undefined' || window.parent === window) return;

    window.addEventListener('message', handleParentMessage);

    // Watch DOM size changes so animated mounts (overlays, transitions) keep
    // the parent iframe's height in sync.
    const ro = new ResizeObserver(postHeight);
    ro.observe(document.documentElement);

    // Fire an initial measurement once layout settles.
    requestAnimationFrame(postHeight);
}
