<script lang="ts">
import { computed, defineComponent, h } from 'vue';
import type { VNode } from 'vue';
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import VCAlertDialog from './AlertDialog.vue';
import VCAlertDialogContent from './AlertDialogContent.vue';
import VCAlertDialogTitle from './AlertDialogTitle.vue';
import VCAlertDialogDescription from './AlertDialogDescription.vue';
import VCAlertDialogCancel from './AlertDialogCancel.vue';
import VCAlertDialogAction from './AlertDialogAction.vue';
import { alertDialogThemeDefaults } from './theme';
import { alertDialogHardcodedDefaults, injectAlertDialogManager } from './use-alert-dialog';
import type { AlertDialogRequest } from './use-alert-dialog';

/**
 * Single host for the imperative `useAlertDialog()` API — place it once near the
 * app root (sibling of `<VCToaster>`). Injects the per-app `AlertDialogManager`
 * and renders the head request through the `<VCAlertDialog*>` parts.
 *
 * The footer uses `<VCAlertDialogCancel manual>` / `<VCAlertDialogAction manual>`.
 * `manual` suppresses Reka's auto-close — which can't distinguish confirm from
 * cancel — so the host's own `@click` drives the true / false resolution.
 * Cancel renders first so it is the first focusable element on open. Escape
 * (the only remaining `update:open=false` path, since the manual parts don't
 * close on click) resolves the shown request as cancelled.
 *
 * Known v1 limitation: when the queue drains to empty the content unmounts
 * without an exit animation (the enter animation still plays). Sequential
 * requests swap content in place.
 */
export default defineComponent({
    name: 'VCAlertDialogProvider',
    setup() {
        const manager = injectAlertDialogManager();
        const head = computed<AlertDialogRequest | undefined>(() => manager.queue.value[0]);
        const open = computed(() => manager.queue.value.length > 0);
        const defaults = useComponentDefaults('alertDialog', {}, alertDialogHardcodedDefaults);
        // Host owns only the footer layout class; the Cancel / Action parts
        // resolve their own `alertDialog` theme (the Action's `tone` is passed
        // per-request via `themeVariant`).
        const theme = useComponentTheme('alertDialog', {}, alertDialogThemeDefaults);

        // Resolve `req` only if it is still the head of the queue. Guards
        // against a stale interaction (e.g. a fast double-click landing before
        // the head advances) settling a request the control wasn't rendered
        // for — which, with 2+ queued confirms, would otherwise resolve the
        // wrong promise.
        function resolveRequest(req: AlertDialogRequest, value: boolean): void {
            if (head.value?.id !== req.id) return;
            manager.settle(value);
        }

        function onOpenChange(next: boolean): void {
            // Only Escape reaches here (outside-click is disabled by Reka and
            // the manual buttons don't close on click). Cancel the shown head.
            if (!next && head.value) resolveRequest(head.value, false);
        }

        function renderDefaultBody(req: AlertDialogRequest): VNode[] {
            const { options } = req;
            const children: (VNode | null)[] = [
                h(VCAlertDialogTitle, () => options.title ?? defaults.value.title),
                options.description ?
                    h(VCAlertDialogDescription, () => options.description) :
                    null,
                h('div', { class: theme.value.footer || undefined }, [
                    // Cancel first → first focusable on open. `manual` disables
                    // the auto-close so `@click` drives resolution. No
                    // `themeVariant`: Cancel is the neutral escape, and the
                    // theme's `tone` variant styles only the `action` slot — so
                    // tone is applied to the Action alone (a destructive confirm
                    // colors the Action, keeping Cancel visually neutral).
                    h(VCAlertDialogCancel, {
                        manual: true,
                        type: 'button',
                        onClick: () => resolveRequest(req, false),
                    }, () => options.cancelLabel ?? defaults.value.cancelLabel),
                    h(VCAlertDialogAction, {
                        manual: true,
                        type: 'button',
                        themeVariant: { tone: options.tone ?? 'primary' },
                        onClick: () => resolveRequest(req, true),
                    }, () => options.confirmLabel ?? defaults.value.confirmLabel),
                ]),
            ];
            return children.filter((c): c is VNode => c !== null);
        }

        function renderBody(req: AlertDialogRequest) {
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
