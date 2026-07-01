<script lang="ts">
import { computed, defineComponent, h } from 'vue';
import type { VNode } from 'vue';
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import VCAlertDialog from './AlertDialog.vue';
import VCAlertDialogContent from './AlertDialogContent.vue';
import VCAlertDialogTitle from './AlertDialogTitle.vue';
import VCAlertDialogDescription from './AlertDialogDescription.vue';
import { alertDialogThemeDefaults } from './theme';
import { confirmHardcodedDefaults, injectConfirmManager } from './use-confirm';
import type { ConfirmRequest } from './use-confirm';

/**
 * Single host for the imperative `useConfirm()` API — place it once near the
 * app root (sibling of `<VCToaster>`). Reads the module-level FIFO queue and
 * renders the head request through the `<VCAlertDialog*>` parts.
 *
 * The footer buttons are plain `<button>`s (not `<VCAlertDialogAction>` /
 * `<VCAlertDialogCancel>`, which would both close via Reka's `DialogClose` and
 * make Action vs Cancel indistinguishable). Cancel is rendered first so it is
 * the first focusable element — matching Reka's auto-focus and keeping an
 * accidental Enter off the destructive Action. Outside-click is disabled by
 * Reka, so the only `update:open=false` path is Escape (when not `noEscape`),
 * which resolves the request as cancelled.
 *
 * Known v1 limitation: when the queue drains to empty the content unmounts
 * without an exit animation (the enter animation still plays). Sequential
 * requests swap content in place.
 */
export default defineComponent({
    name: 'VCConfirmDialog',
    setup() {
        const manager = injectConfirmManager();
        const head = computed<ConfirmRequest | undefined>(() => manager.queue.value[0]);
        const open = computed(() => manager.queue.value.length > 0);
        const defaults = useComponentDefaults('confirm', {}, confirmHardcodedDefaults);

        // Resolve the shared `alertDialog` theme with the head request's tone
        // so the Action button picks up its color. Title / description /
        // overlay / content classes come from the Layer-1 parts' own
        // resolution; this instance only drives the host-rendered footer.
        const theme = useComponentTheme('alertDialog', {
            get themeClass() { return undefined; },
            get themeVariant() { return { tone: head.value?.options.tone ?? 'primary' }; },
        }, alertDialogThemeDefaults);

        // Resolve `req` only if it is still the head of the queue. Guards
        // against a stale interaction (e.g. a fast double-click landing before
        // the head advances) settling a request the control wasn't rendered
        // for — which, with 2+ queued confirms, would otherwise resolve the
        // wrong promise.
        function resolveRequest(req: ConfirmRequest, value: boolean): void {
            if (head.value?.id !== req.id) return;
            manager.settle(value);
        }

        function onOpenChange(next: boolean): void {
            // Only Escape reaches here (outside-click is disabled by Reka and
            // the buttons are plain, not DialogClose). Cancel the shown head.
            if (!next && head.value) resolveRequest(head.value, false);
        }

        function renderDefaultBody(req: ConfirmRequest): VNode[] {
            const { options } = req;
            const children: (VNode | null)[] = [
                h(VCAlertDialogTitle, () => options.title ?? defaults.value.title),
                options.description ?
                    h(VCAlertDialogDescription, () => options.description) :
                    null,
                h('div', { class: theme.value.footer || undefined }, [
                    // Cancel first → first focusable on open.
                    h('button', {
                        type: 'button',
                        class: theme.value.cancel || undefined,
                        onClick: () => resolveRequest(req, false),
                    }, options.cancelLabel ?? defaults.value.cancelLabel),
                    h('button', {
                        type: 'button',
                        class: theme.value.action || undefined,
                        onClick: () => resolveRequest(req, true),
                    }, options.confirmLabel ?? defaults.value.confirmLabel),
                ]),
            ];
            return children.filter((c): c is VNode => c !== null);
        }

        function renderBody(req: ConfirmRequest) {
            // Escape hatch — a fully custom body owns its own buttons.
            if (req.options.component) {
                return h(req.options.component, {
                    ...(req.options.componentProps ?? {}),
                    confirm: () => resolveRequest(req, true),
                    cancel: () => resolveRequest(req, false),
                });
            }
            return renderDefaultBody(req);
        }

        return () => {
            const current = head.value;
            return h(VCAlertDialog, {
                open: open.value,
                'onUpdate:open': onOpenChange,
            }, {
                default: () => (current ?
                    h(VCAlertDialogContent, {
                        key: current.id,
                        noEscape: current.options.noEscape,
                    }, { default: () => renderBody(current) }) :
                    null),
            });
        };
    },
});
</script>
