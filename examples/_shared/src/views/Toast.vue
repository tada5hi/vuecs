<script setup lang="ts">
import {
    VCToastProvider,
    VCToaster,
    useToast,
} from '@vuecs/overlays';
import { defineComponent, h } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const toast = useToast();

function showSuccess() {
    toast.add({
        title: 'Saved',
        description: 'Your changes were saved successfully.',
        color: 'success',
    });
}

function showError() {
    toast.add({
        title: 'Upload failed',
        description: 'Network error — please retry.',
        color: 'error',
        duration: 8000,
    });
}

function showInfo() {
    toast.add({
        title: 'Background sync started',
        description: 'We\'ll let you know when it\'s done.',
        color: 'info',
        variant: 'soft',
    });
}

function showWithAction() {
    // `onClick` receives the toast's id + queue API — no closure capture.
    toast.add({
        title: 'Item moved to trash',
        description: 'You can still restore it for a few seconds.',
        color: 'neutral',
        duration: 10000,
        action: {
            label: 'Undo',
            onClick: (id, t) => {
                t.dismiss(id);
                t.add({
                    title: 'Restored',
                    color: 'success',
                });
            },
        },
    });
}

function showPersistent() {
    toast.add({
        title: 'New feature available',
        description: 'This stays until dismissed.',
        color: 'primary',
        duration: Infinity,
    });
}

function showRichInline() {
    // `title` and `description` accept () => h(...) for inline rich
    // content — no need to override the canonical layout via the global
    // <VCToaster> slot.
    toast.add({
        title: () => h('span', [
            'Released ',
            h('code', { style: 'font-family: monospace;' }, 'v2.1.0'),
        ]),
        description: () => h('span', [
            'See the ',
            // `preventDefault` so the demo link doesn't scroll the page
            // when clicked — in a real app this would be a route or URL.
            h('a', {
                href: '#',
                style: 'text-decoration: underline;',
                onClick: (e: globalThis.Event) => e.preventDefault(),
            }, 'changelog'),
            ' for details.',
        ]),
        color: 'info',
        variant: 'soft',
    });
}

// Per-entry custom layout — replaces the canonical title+desc+action
// for THIS toast only. Other toasts in the same queue still use the
// default canonical layout.
const ProgressToast = defineComponent({
    name: 'DemoProgressToast',
    props: {
        entry: { type: Object, required: true },
        dismiss: { type: Function, required: true },
        progress: { type: Number, default: 0 },
    },
    setup(props) {
        return () => h('div', { style: 'display: flex; flex-direction: column; gap: 0.5rem; min-width: 14rem;' }, [
            h('strong', 'Uploading roadmap.pdf'),
            h('div', { style: 'height: 0.25rem; border-radius: 9999px; background: var(--vc-color-bg-muted); overflow: hidden;' }, [
                h('div', { style: `height: 100%; width: ${props.progress}%; background: var(--vc-color-primary-600); transition: width 200ms ease;` }),
            ]),
            h('span', { style: 'font-size: 0.75rem; color: var(--vc-color-fg-muted);' }, `${props.progress}% complete`),
        ]);
    },
});

function showCustomComponent() {
    const id = toast.add({
        component: ProgressToast,
        componentProps: { progress: 0 },
        duration: Infinity,
        color: 'primary',
        variant: 'soft',
        closable: false,
    });
    // Mutate progress in place via `update()`.
    let pct = 0;
    const timer = setInterval(() => {
        pct += 20;
        if (pct >= 100) {
            clearInterval(timer);
            toast.update(id, {
                component: undefined,
                title: 'Upload complete',
                description: 'roadmap.pdf is now available.',
                color: 'success',
                duration: 4000,
                closable: true,
            });
            return;
        }
        toast.update(id, { componentProps: { progress: pct } });
    }, 400);
}

function clearAll() {
    toast.clear();
}
</script>

<template>
    <VCToastProvider :duration="5000">
        <div class="vc-demo-toast-grid">
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-success"
                @click="showSuccess"
            >
                Show success
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-error"
                @click="showError"
            >
                Show error
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-info"
                @click="showInfo"
            >
                Show info (soft)
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-neutral"
                @click="showWithAction"
            >
                Show with undo action
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-primary"
                @click="showPersistent"
            >
                Show persistent
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-info"
                @click="showRichInline"
            >
                Show with inline link
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-primary"
                @click="showCustomComponent"
            >
                Show custom component
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-clear"
                @click="clearAll"
            >
                Clear all
            </button>
        </div>
        <VCToaster
            position="top-right"
            :theme-variant="themeVariant"
        />
    </VCToastProvider>
</template>

<style scoped>
.vc-demo-toast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.5rem;
    max-width: 36rem;
}
.vc-demo-toast-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    color: #fff;
}
.vc-demo-toast-btn-success { background-color: var(--vc-color-success-600); }
.vc-demo-toast-btn-success:hover { background-color: var(--vc-color-success-700); }
.vc-demo-toast-btn-error { background-color: var(--vc-color-error-600); }
.vc-demo-toast-btn-error:hover { background-color: var(--vc-color-error-700); }
.vc-demo-toast-btn-info { background-color: var(--vc-color-info-600); }
.vc-demo-toast-btn-info:hover { background-color: var(--vc-color-info-700); }
.vc-demo-toast-btn-neutral {
    background-color: var(--vc-color-bg-muted);
    color: var(--vc-color-fg);
    border: 1px solid var(--vc-color-border);
}
.vc-demo-toast-btn-neutral:hover { background-color: var(--vc-color-bg); }
.vc-demo-toast-btn-primary { background-color: var(--vc-color-primary-600); }
.vc-demo-toast-btn-primary:hover { background-color: var(--vc-color-primary-700); }
.vc-demo-toast-btn-clear {
    background-color: transparent;
    color: var(--vc-color-fg-muted);
    border: 1px solid var(--vc-color-border);
}
.vc-demo-toast-btn-clear:hover {
    background-color: var(--vc-color-bg-muted);
    color: var(--vc-color-fg);
}
</style>
