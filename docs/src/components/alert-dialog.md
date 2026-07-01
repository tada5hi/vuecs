# AlertDialog

Accessible **confirmation** dialog built on [Reka UI](https://reka-ui.com/)'s `AlertDialog` primitives. Unlike [Modal](/components/modal) (`role="dialog"`), `<VCAlertDialog>` renders with **`role="alertdialog"`** — the WAI-ARIA *Alert and Message Dialogs* pattern — disables outside-click dismissal, and exposes distinct **Cancel** / **Action** buttons. Use it for destructive or critical "are you sure?" flows.

Ships in two layers:

- **`<VCAlertDialog>` compound** — declarative markup, full control.
- **`useAlertDialog()`** — an imperative `await confirm(…)` that resolves `Promise<boolean>`, drained by a single `<VCAlertDialogProvider>` host (the same pattern as `useToast()` / `<VCToaster>`).

```bash
npm install @vuecs/overlays
```

## When to use which

| | Modal | AlertDialog |
|---|---|---|
| ARIA role | `dialog` | `alertdialog` (assertive announcement) |
| Outside click | closes (configurable via `closePolicy`) | **never** closes |
| Escape | closes | closes (unless `no-escape`) |
| Buttons | one generic `Close` (+ corner-X) | distinct `Cancel` + `Action`, no corner-X |
| Intent | general content / forms / flows | destructive / critical confirmation |

## Compound API

Each part is a thin wrapper over the matching Reka `AlertDialog` primitive, themed via `useComponentTheme('alertDialog', ...)`:

| Component | Wraps | Purpose |
|---|---|---|
| `VCAlertDialog` | `AlertDialogRoot` | Holds open state. v-models `open`. Always modal. |
| `VCAlertDialogTrigger` | `AlertDialogTrigger` | Button that opens the dialog. |
| `VCAlertDialogContent` | `AlertDialogPortal` + `AlertDialogOverlay` + `AlertDialogContent` | Backdrop + focused panel (`role="alertdialog"`). `inline` skips the portal, `hideOverlay` skips the backdrop, `no-escape` makes Escape no longer cancel. |
| `VCAlertDialogTitle` | `AlertDialogTitle` | aria-labelledby target. |
| `VCAlertDialogDescription` | `AlertDialogDescription` | aria-describedby target. |
| `VCAlertDialogCancel` | `AlertDialogCancel` | Safe action. Closes; receives initial focus. |
| `VCAlertDialogAction` | `AlertDialogAction` | Confirm action. Colored by the `tone` variant; use `as-child` with `<VCButton>` for the full variant matrix. |

```vue
<script setup lang="ts">
import {
    VCAlertDialog,
    VCAlertDialogTrigger,
    VCAlertDialogContent,
    VCAlertDialogTitle,
    VCAlertDialogDescription,
    VCAlertDialogCancel,
    VCAlertDialogAction,
} from '@vuecs/overlays';
import { VCButton } from '@vuecs/button';

function onDelete() {
    // perform the destructive action
}
</script>

<template>
    <VCAlertDialog>
        <VCAlertDialogTrigger as-child>
            <VCButton color="error">Delete</VCButton>
        </VCAlertDialogTrigger>
        <VCAlertDialogContent>
            <VCAlertDialogTitle>Delete project?</VCAlertDialogTitle>
            <VCAlertDialogDescription>
                This permanently removes the project and all of its data.
            </VCAlertDialogDescription>
            <div class="vc-alert-dialog-footer">
                <VCAlertDialogCancel as-child>
                    <VCButton variant="ghost">Cancel</VCButton>
                </VCAlertDialogCancel>
                <VCAlertDialogAction as-child>
                    <VCButton color="error" @click="onDelete">Delete</VCButton>
                </VCAlertDialogAction>
            </div>
        </VCAlertDialogContent>
    </VCAlertDialog>
</template>
```

## Imperative API — `useAlertDialog()`

For the common "confirm in a click handler" case, skip the markup and `await` a result. Place **one** `<VCAlertDialogProvider />` near your app root (next to `<VCToaster />`), then call `useAlertDialog()` anywhere:

```vue
<!-- App.vue -->
<template>
    <RouterView />
    <VCAlertDialogProvider />
</template>
```

```ts
import { useAlertDialog } from '@vuecs/overlays';

const confirm = useAlertDialog();

async function remove(id: string) {
    const ok = await confirm({
        title: 'Delete project?',
        description: 'This cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Keep',
        tone: 'error',
    });
    if (ok) {
        await api.deleteProject(id);
    }
}
```

### `AlertDialogOptions`

| Option | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | `'Are you sure?'` | Falls through to `useComponentDefaults('alertDialog').title`. |
| `description` | `string` | — | Optional body text. |
| `confirmLabel` | `string` | `'Confirm'` | Action button label. |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label. |
| `tone` | `'neutral' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Colors the Action button. Use `'error'` for destructive confirms. |
| `noEscape` | `boolean` | `false` | When `true`, Escape no longer cancels — the user must pick a button. |
| `component` | `Component` | — | Escape hatch: render a custom body. Receives `confirm()` + `cancel()` callbacks (plus `componentProps`). |
| `componentProps` | `Record<string, unknown>` | — | Extra props for `component`. |

The call returns `Promise<boolean>` — `true` for **Action**, `false` for **Cancel** / **Escape**. Concurrent calls queue **FIFO** and are shown one at a time. Each label / title is also overridable app-wide via the `defaults` install option:

```ts
app.use(vuecs, {
    defaults: {
        alertDialog: { confirmLabel: 'Ja', cancelLabel: 'Nein' },
    },
});
```

::: tip App-scoped & SSR
The queue lives on a per-app manager (like `useToast()`), so it's SSR-safe (no cross-request leakage) and isolated per app. Because `useAlertDialog()` **injects** that manager, call it from a component `setup()` and capture the returned function — then reuse it in handlers (including store actions). For a call site outside setup (an axios interceptor), capture `confirm` once at app init via `app.runWithContext(() => useAlertDialog())` and pass it in. `confirm()` resolves `false` (without opening anything) on the server.
:::

## Gated / async confirmation

By default `<VCAlertDialogAction>` / `<VCAlertDialogCancel>` close the dialog the instant they're clicked (they're Reka `DialogClose`). For flows that must **validate before confirming** or **stay open during an async action** (spinner-then-close), add `manual`: the button no longer auto-closes, and its default slot receives a `confirm()` / `cancel()` trigger you call when ready.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCAlertDialog, VCAlertDialogContent, VCAlertDialogTitle, VCAlertDialogDescription, VCAlertDialogCancel, VCAlertDialogAction } from '@vuecs/overlays';
import { VCButton } from '@vuecs/button';

const open = ref(false);
const deleting = ref(false);

async function onDelete(confirm: () => void) {
    deleting.value = true;
    try {
        await api.deleteProject(id);
        confirm();            // close only after the request succeeds
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <VCAlertDialog v-model:open="open">
        <VCAlertDialogContent>
            <VCAlertDialogTitle>Delete project?</VCAlertDialogTitle>
            <VCAlertDialogDescription>This cannot be undone.</VCAlertDialogDescription>
            <div class="vc-alert-dialog-footer">
                <VCAlertDialogCancel as-child>
                    <VCButton variant="ghost">Cancel</VCButton>
                </VCAlertDialogCancel>
                <VCAlertDialogAction manual as-child v-slot="{ confirm }">
                    <VCButton color="error" :loading="deleting" @click="onDelete(confirm)">
                        Delete
                    </VCButton>
                </VCAlertDialogAction>
            </div>
        </VCAlertDialogContent>
    </VCAlertDialog>
</template>
```

Without `manual`, the dialog closes the moment the button is clicked — before `deleteProject` resolves. With `manual`, it stays open (showing the `:loading` spinner) until you call `confirm()`. The same `manual` + `cancel()` pattern applies to `<VCAlertDialogCancel>`.

> The imperative `useAlertDialog()` currently resolves before your action runs (`if (await confirm()) { await work() }`); an async-aware `onConfirm` for the imperative host is a planned follow-up. Until then, use the `manual` declarative pattern above for spinner-in-dialog flows.

## Theming

One theme key, `alertDialog`, with slots `overlay` / `content` / `header` / `title` / `description` / `body` / `footer` / `trigger` / `cancel` / `action`. Variants: `size` (`xs` / `sm` / `md` / `lg`, sizes the panel) and `tone` (six semantic colors, colors the `action` button). Shipped in all three themes (`@vuecs/theme-tailwind`, `@vuecs/theme-bootstrap`, `@vuecs/theme-bulma`).
