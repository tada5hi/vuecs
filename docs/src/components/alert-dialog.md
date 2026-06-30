# AlertDialog

Accessible **confirmation** dialog built on [Reka UI](https://reka-ui.com/)'s `AlertDialog` primitives. Unlike [Modal](/components/modal) (`role="dialog"`), `<VCAlertDialog>` renders with **`role="alertdialog"`** — the WAI-ARIA *Alert and Message Dialogs* pattern — disables outside-click dismissal, and exposes distinct **Cancel** / **Action** buttons. Use it for destructive or critical "are you sure?" flows.

Ships in two layers:

- **`<VCAlertDialog>` compound** — declarative markup, full control.
- **`useConfirm()`** — an imperative `await confirm(…)` that resolves `Promise<boolean>`, drained by a single `<VCConfirmDialog>` host (the same pattern as `useToast()` / `<VCToaster>`).

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

## Imperative API — `useConfirm()`

For the common "confirm in a click handler" case, skip the markup and `await` a result. Place **one** `<VCConfirmDialog />` near your app root (next to `<VCToaster />`), then call `useConfirm()` anywhere:

```vue
<!-- App.vue -->
<template>
    <RouterView />
    <VCConfirmDialog />
</template>
```

```ts
import { useConfirm } from '@vuecs/overlays';

const confirm = useConfirm();

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

### `ConfirmOptions`

| Option | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | `'Are you sure?'` | Falls through to `useComponentDefaults('confirm').title`. |
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
        confirm: { confirmLabel: 'Ja', cancelLabel: 'Nein' },
    },
});
```

::: tip SSR
The queue is a process-wide singleton (same caveat as `useToast()`). A confirmation is always a client gesture — only call `confirm()` from client-side handlers, never from SSR setup.
:::

## Theming

One theme key, `alertDialog`, with slots `overlay` / `content` / `header` / `title` / `description` / `body` / `footer` / `trigger` / `cancel` / `action`. Variants: `size` (`xs` / `sm` / `md` / `lg`, sizes the panel) and `tone` (six semantic colors, colors the `action` button). Shipped in all three themes (`@vuecs/theme-tailwind`, `@vuecs/theme-bootstrap`, `@vuecs/theme-bulma`).
