# Data Sources

`@vuecs/data` ships two **loader-backed state containers**:

- **`defineDataCollection()`** — a paginated/filtered list of entities. Its return shape is a deliberate structural superset of `@vuecs/list`'s `ListState & ListMutators`, so it binds straight to `<VCList :state>`.
- **`defineDataRecord()`** — a single entity, for detail views and edit forms.

Both sit on one shared async core: counter-backed `busy`, an `error` ref, token-guarded latest-wins loading, a `mutate()` wrapper for write gestures, and a `dehydrate()` / `hydrate` pair for SSR.

::: warning Experimental
`@vuecs/data` is marked `@experimental`. The surface may still change while the first consumer adapters land. It follows the same policy as `useSubmitButton()` — at least one minor before the API freezes.
:::

## Where it sits vs `defineList()`

The two are complements, split on one question: **do you already have the data, or do you fetch it?**

| | [`defineList()`](/components/list#state-container-definelist) | `defineDataCollection()` |
|---|---|---|
| Package | `@vuecs/list` | `@vuecs/data` |
| Data source | You own it — a `Ref`, a getter, a store slice | The container owns it; you supply a `load` adapter |
| Async | None. `busy` / `total` are values you pass in | Built in — `busy`, `error`, latest-wins, `mutate()` |
| Pagination | Whatever you put in the `meta` bag | `meta` bag + `load(next)` re-fires the adapter |
| SSR | Consumer-side | `dehydrate()` / `hydrate` |
| Binds to `<VCList :state>` | Yes | Yes (structural superset) |

Reach for `defineList()` when the data already lives somewhere else (a Pinia store, a parent component, a prop). Reach for `defineDataCollection()` when the component is the thing that fetches.

## Installation

```bash
npm install @vuecs/data
```

Peers: `vue` and `@vuecs/core`. There is **no runtime dependency on `@vuecs/list`** in either direction — the `<VCList :state>` binding works by shape.

## Collection quickstart

The `load` adapter is the only required option. vuecs does not pick your HTTP client or query builder — a hand-rolled `fetch` is a complete adapter:

```ts
import { defineDataCollection } from '@vuecs/data';

type User = {
    id: number;
    name: string;
    email: string;
};

// A plain type ALIAS, not an interface — see "Typing your meta bag" below.
type UserListMeta = {
    pagination: { limit: number; offset: number };
    search?: string;
};

const source = defineDataCollection<User, UserListMeta>({
    initialMeta: { pagination: { limit: 10, offset: 0 } },
    itemKey: 'id',

    load: async (meta) => {
        const params = new URLSearchParams({
            limit: String(meta.pagination.limit),
            offset: String(meta.pagination.offset),
        });

        if (meta.search) {
            params.set('q', meta.search);
        }

        const response = await fetch(`/api/users?${params}`);
        if (!response.ok) {
            throw new Error(`users: ${response.status}`);
        }

        const body = await response.json() as { data: User[]; total: number };

        // `total` is optional — until the server has reported one,
        // `source.total` falls back to `data.length`. Once reported, the
        // last known server total sticks: a later response that omits
        // `total` keeps it (a page fetch shouldn't wipe the count).
        return { data: body.data, total: body.total };
    },
});
```

With `autoLoad` left at its default (`true`), the first fetch fires on mount. The returned container exposes:

```ts
source.data      // ComputedRef<User[]>
source.busy      // ComputedRef<boolean>
source.total     // ComputedRef<number>   — last reported server total, else data.length
source.isEmpty   // ComputedRef<boolean>  — !busy && total === 0
source.error     // Ref<unknown>
source.meta      // UserListMeta          — a reactive plain bag, NOT a ref
```

### Binding to `<VCList>`

`<VCList :state>` accepts the source directly:

```vue
<script setup lang="ts">
import { defineDataCollection } from '@vuecs/data';

const source = defineDataCollection<User, UserListMeta>({ /* … as above */ });
</script>

<template>
    <VCList :state="source">
        <template #default>
            <VCListBody>
                <template #item="{ data: user }">
                    <VCListItem :data="user">
                        {{ user.name }}
                    </VCListItem>
                </template>
            </VCListBody>

            <VCListEmpty />
            <VCListLoading />
        </template>
    </VCList>
</template>
```

`<VCListEmpty>` and `<VCListLoading>` self-gate off the same container's `busy` / `data` state, so loading and empty states need no extra wiring.

### Wiring pagination

`load(next)` merges `next` into the meta bag and re-fires the adapter. `<VCPagination>` emits a `PaginationMeta` payload carrying the new `limit` / `offset`:

```vue
<script setup lang="ts">
import type { PaginationMeta } from '@vuecs/pagination';

const source = defineDataCollection<User, UserListMeta>({ /* … */ });
const { busy, meta, total } = source;

const onPage = (page: PaginationMeta) => source.load({
    // The object form is a SHALLOW top-level merge — pass the whole
    // `pagination` sub-object, not just the key you changed.
    pagination: { limit: page.limit, offset: page.offset },
});
</script>

<template>
    <VCPagination
        :total="total"
        :limit="meta.pagination.limit"
        :offset="meta.pagination.offset"
        :busy="busy"
        @load="onPage"
    />
</template>
```

Destructuring `total` / `busy` in `<script setup>` is deliberate: they are `ComputedRef`s living on a plain object, so Vue's template auto-unwrapping only kicks in once they are top-level bindings. Written inline you would need `source.total.value`. `meta` is a plain reactive object, so `meta.pagination.limit` reads directly.

### Two ways to write meta

```ts
// Object form — shallow top-level merge. Typed as the FULL `Meta`, so
// every required key must be present.
source.load({ pagination: { limit: 25, offset: 0 } });

// Updater form — wholesale replace. Keys the returned object omits are
// DELETED from the bag.
source.load((current) => ({ ...current, search: 'ada' }));

// Re-fire with the current meta unchanged.
source.refresh();
```

The updater form spread over `current` is the idiomatic way to touch one key when `Meta` has several required ones — the object form's type demands them all, even though the runtime merge is shallow.

There is deliberately no deep-merge policy on `meta`. Composing a query (filters, sort, includes) is your layer, not vuecs's; the bag is forwarded to `load` verbatim.

## Record quickstart

`defineDataRecord()` is the single-entity sibling. It drops the collection machinery (`total`, `isEmpty`, identity resolution, gate flags) and adds `ensure()` plus local mutators named for what they actually do.

```ts
import { defineDataRecord } from '@vuecs/data';

type UserRecordMeta = { id: number };

const source = defineDataRecord<User, UserRecordMeta>({
    initialMeta: { id: props.userId },

    load: async (meta) => {
        const response = await fetch(`/api/users/${meta.id}`);
        if (!response.ok) {
            throw new Error(`user ${meta.id}: ${response.status}`);
        }

        return { data: await response.json() as User };
    },
});

source.data    // ComputedRef<User | undefined>
source.busy    // ComputedRef<boolean>
source.error   // Ref<unknown>
source.meta    // UserRecordMeta — reactive plain bag
```

### `ensure()` — fetch only when unresolved

`ensure()` resolves immediately when the record is already present, coalesces onto an in-flight `load()` when one is running, and otherwise fires a fresh load. It is the "make sure this is resolved before I use it" call:

```ts
const openEditor = async () => {
    await source.ensure();
    // source.data.value is populated (or source.error holds the failure)
};
```

`ensure()` deliberately ignores a concurrent `mutate()` — a write in flight is not a load, so `ensure()` still fetches.

### `mutate()` — write gestures under the source's accounting

`mutate(fn)` runs any consumer async operation while raising `busy` and recording failures into `error`. Unlike `load()`, it **rethrows** — an explicit user gesture should surface its failure to the caller:

```ts
const save = async (patch: Partial<User>) => {
    const updated = await source.mutate(async () => {
        const response = await fetch(`/api/users/${source.meta.id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(patch),
        });

        if (!response.ok) {
            throw new Error(`save: ${response.status}`);
        }

        return await response.json() as User;
    });

    // Adopt the server's canonical record.
    source.set(updated);
};
```

Because `mutate` rethrows, wrap the call site in `try` / `catch` (or let it reject into an error boundary) — `source.error` is a mirror for rendering, not a substitute for handling.

### Local mutators: `set` / `merge` / `clear`

These write local state only. They are what a realtime `created` / `updated` / `deleted` handler applies:

```ts
source.set(record);              // replace wholesale
source.merge({ name: 'Ada' });   // deep-merge a patch (no-op when unresolved)
source.clear();                  // back to undefined
```

The names are deliberately *not* `create` / `update` / `delete`: the record variant has no `ListMutators` compatibility constraint, and the honest local-state names avoid implying an HTTP call.

### Adoption via `initialData`

When a parent already has the record (a prop, a row clicked in a list), seed it and skip the mount-time fetch:

```ts
const source = defineDataRecord<User>({
    initialData: props.user ?? undefined,   // autoLoad is skipped when set
    load: async () => ({ data: await fetchUser(props.userId) }),
});
```

::: tip `initialData` is aliased, not cloned
The source stores the value you pass by reference and never mutates it — but you should not mutate it either. Hand it a value you are done with, or clone at the call site.

`hydrate` is barely different: the collection copies the snapshot's *array* one level (the row objects inside stay shared), and the record adopts the snapshot's record object as-is. Either way, treat seeded state as **owned by the source** once handed over.
:::

## Semantics

### Latest-wins loading

Every `load()` takes a monotonic token. When a response arrives, it is applied **only if its token is still the latest** — a slow first request that resolves after a faster second one is discarded, state and rejection alike. `busy` is counter-backed rather than boolean, so overlapping `load()` and `mutate()` calls compose instead of stomping each other; it stays `true` until the last in-flight operation settles.

This is the fix for two failure modes the hand-rolled containers this package replaces both had: stale responses clobbering newer state, and `if (busy) return` guards silently dropping user input.

### The `error` contract

| Call | On start | On failure |
|---|---|---|
| `load()` / `refresh()` | clears `error` | **captures** into `error`; the promise resolves |
| `ensure()` | clears `error` *when it actually fetches* | as `load()` |
| `mutate(fn)` | leaves `error` alone | records into `error` and **rethrows** |

`load()` never rejects. That is what makes `autoLoad` safe — a mount-time fetch cannot produce an unhandled rejection. Render `source.error` for the failed-load state, and `catch` around `mutate()` for gestures.

### `autoLoad`

Defaults to `true`: one `load()` fires from `onMounted`. It is skipped when:

- a `hydrate` snapshot seeded state (SSR handoff — see below), or
- for `defineDataRecord`, when `initialData` was supplied.

`autoLoad` needs a component setup context. Constructing a source outside one (a module singleton, a store) dev-warns and does nothing — call `load()` yourself.

### Gate flags

`dedupCreated`, `filterDeleted`, and `mergeOnUpdated` all default to `false` and carry exactly the semantics they have in [`defineList()`](/components/list#mutation-pure-helpers-vs-bound-mutators):

| Flag | Effect |
|---|---|
| `dedupCreated` | `create(item)` is a no-op when the item's identity is already in `data` |
| `filterDeleted` | `delete(item)` is a no-op when the item is not in `data` |
| `mergeOnUpdated` | `update(item)` deep-merges into the existing row instead of replacing it |

Identity comes from the same ladder as `defineList` — `itemId` → `itemKey` → `.id`.

### Patch-merge semantics

Two paths merge rather than replace: `defineDataRecord`'s `merge(partial)`, and `defineDataCollection`'s `update(item)` when `mergeOnUpdated` is set. Both run through one configured merger:

- **Deep merge; the patch wins.** On a conflicting key the incoming value replaces the stored one — a realtime update must actually update. Keys the patch does not mention survive.
- **Arrays REPLACE, they do not concatenate.** Without this, repeated realtime patches would grow an array-valued field without bound.
- **Explicitly-`undefined` keys are skipped.** `merge({ name: undefined })` leaves `name` untouched. **Pass `null` to clear a value** — the same "only `undefined` falls through; `null` deliberately clears" doctrine the rest of vuecs uses for behavioral defaults.
- **Inputs are cloned.** The result shares no nested reference with your patch or with the record it replaced, and your patch object is never mutated in place.

Everything else — `set()`, `clear()`, `create()`, `delete()`, and `update()` without `mergeOnUpdated` — replaces wholesale and never clones.

### The structured-clone constraint

Cloning is implemented with `structuredClone`, so **anything you pass through a merging path must be structured-cloneable**:

- **Function-valued fields throw** (`DataCloneError`). Entity rows carrying callbacks need `set()` (or a plain `update()`), not `merge()`.
- **Class instances are flattened** into plain objects — methods and prototype are lost. `Date`, `RegExp`, `Map`, `Set`, and nested plain objects/arrays all survive intact.
- **Top-level reactive proxies are unwrapped automatically** (via `toRaw`), so handing `merge()` a `reactive()` form object works. A proxy nested *inside* a raw object is **not** unwrapped and still throws — keep raw entities in your source of truth.
- Cost is **O(record size) per merge**. Fine for entity-shaped rows; consider batching if a very large record is patched at high frequency.

### Mutator buffering during a load

A realtime event arriving mid-`load()` would otherwise be wiped out by the wholesale assignment of the response. So mutators called while a load is in flight are **buffered and drained FIFO after every in-flight load settles** — the response applies first, then the buffered operations in arrival order.

```ts
source.load();          // in flight
source.create(row);     // buffered
source.delete(other);   // buffered
// response applies → create(row) → delete(other)
```

This covers `create` / `update` / `delete` on the collection and `set` / `merge` / `clear` on the record. The drain **also runs when the load fails** — events are never silently lost. The gate flags make every drain case land correctly: `dedupCreated` swallows a create the response already included, `filterDeleted` swallows a delete for a row the response no longer has, and `mergeOnUpdated` re-merges a stale version incoming-wins.

Known v1 limitation: the buffer is unbounded while a load never settles.

### `total` auto-adjustment

When the server reported a `total`, `create()` and `delete()` adjust it by the **delta between array lengths** — never a hardcoded ±1. A `deleted` event for a row that is not on the current page therefore leaves `total` alone, instead of decrementing it toward a number that drifts further from truth with every off-page event.

When the loader never reported a total, `source.total` simply tracks `data.length` and no adjustment happens.

### Reactivity depth

The internal data ref is a **`shallowRef`**. Every mutation flow replaces the array (or record) wholesale, so per-row deep reactivity would buy nothing while costing a proxy per row, breaking loader row identity, and leaking reactive proxies out through `dehydrate()`.

The practical consequence: **rows are not deep-reactive**. Mutating a field in place does not re-render.

```ts
// ✗ no re-render
source.data.value[0].name = 'Ada';

// ✓ replace the row
source.update({ ...source.data.value[0], name: 'Ada' });
```

The same applies to the `meta` bag, which is `shallowReactive` — replace whole sub-objects (`meta.pagination = { … }`) rather than writing nested fields.

## Typing your meta bag

Declare `Meta` as a **type alias**, not an interface:

```ts
// ✓ binds to <VCList :state>
type UserListMeta = {
    pagination: { limit: number; offset: number };
};

// ✗ compiles here, fails at the <VCList :state="source"> call site
interface UserListMeta {
    pagination: { limit: number; offset: number };
}
```

`<VCList>`'s `state` prop pins the meta type to `Record<string, unknown>`. TypeScript gives object **type aliases** an implicit index signature and **interfaces** none, so an interface-typed `Meta` is not assignable and the binding errors. This is a pre-existing `@vuecs/list` constraint, not something `@vuecs/data` introduces — the drift guard in `packages/data/test/types/list-compat.test-d.ts` pins the behaviour.

If you must keep an interface (because it is declaration-merged elsewhere), add the index signature yourself: `interface UserListMeta { [key: string]: unknown; … }`.

## SSR / hydration

`load()` is a plain promise with no lifecycle coupling, so it is callable from `setup`, `onServerPrefetch`, or a route guard. The handoff is `dehydrate()` on the server and `hydrate` on the client.

```ts
import { onServerPrefetch } from 'vue';
import { defineDataCollection } from '@vuecs/data';

// Your SSR framework's serialized state store — Nuxt's `useState`,
// a Pinia store, `window.__INITIAL_STATE__`, … vuecs does not pick one.
const payload = useSnapshotStore();

const initialMeta = { pagination: { limit: 10, offset: 0 } };

// Derive the key from the serialized query so a different page or
// filter can't rehydrate the wrong snapshot.
const key = `users:${JSON.stringify(initialMeta)}`;

const source = defineDataCollection<User, UserListMeta>({
    initialMeta,
    hydrate: () => payload[key],
    load: fetchUsers,
});

onServerPrefetch(async () => {
    await source.load();
    payload[key] = source.dehydrate();
});
```

On the server, `payload[key]` is empty, so nothing hydrates; `onServerPrefetch` performs the fetch and stores the snapshot. On the client, the serialized snapshot seeds the state and `autoLoad` is skipped — no duplicate request on hydration.

Three details worth pinning:

- **`hydrate` is evaluated once, at construction.** Pass the lazy getter form (`() => payload[key]`) so the store is read at the right moment; the snapshot may also be passed directly.
- **The snapshot is authoritative for `meta`.** `hydrate` **replaces** the bag rather than merging onto `initialMeta`, so keys the snapshot dropped do not survive rehydration.
- **`dehydrate()` returns a fresh container with shared rows.** The array (and the meta object) are new, but the rows are the plain objects your loader returned — mutating a row in place would still reach the live source. Serialization is your contract: `JSON.stringify` is safe only when rows and meta are JSON-compatible (`Date` becomes a string, `Map`/`Set` collapse to `{}`, `undefined` properties are dropped, `BigInt` throws). If your values aren't plain JSON, run the snapshot through your own serializer before storing it.

`defineDataRecord` follows the same contract, with one difference worth knowing: its snapshot is `{ data?, meta }`, and only `meta` is a fresh object — `data` is the **live record reference itself**, not a copy. The practical rule is the same in both variants, just tighter here: serialize the snapshot, never mutate it in place.

## Boundaries

`@vuecs/data` owns the state container and nothing else. Deliberately out of scope, and staying that way:

- **HTTP client** — `load` is an opaque async adapter. `fetch`, `axios`, a generated SDK, all equivalent.
- **Query composition** — filters, sorting, includes, and how they serialize live in your query layer. The `meta` bag is forwarded verbatim.
- **Realtime / WebSockets** — no socket sugar. The mutators **are** the seam: a channel handler calls `source.create(payload)` / `update` / `delete` (or `set` / `merge` / `clear`), and the buffering rules above make a mid-load event land correctly.
- **Entity registries, realm scoping, emits** — consumer-side. Compose your emits around the mutator calls: `const onCreated = (e) => { source.create(e); emit('created', e); }`.
- **Cursor pagination** — offset/limit only for now; cursors ship when a consumer needs them.

## API reference

### `defineDataCollection(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `load` | `(meta: Meta) => Promise<{ data: T[]; total?: number; meta?: Partial<Meta> }>` | — | **Required.** The only adapter. Optional `meta` in the result patches the bag back (server-corrected pagination). |
| `initialMeta` | `Meta` | `{}` | Seed for the reactive meta bag. |
| `initialData` | `T[]` | `[]` | Seed rows. |
| `autoLoad` | `boolean` | `true` | Fire one `load()` from `onMounted`. |
| `hydrate` | `Snapshot \| (() => Snapshot \| null \| undefined)` | — | SSR/persistence seed; skips `autoLoad`. |
| `itemId` | `(item: T) => string \| number` | — | Identity resolver. |
| `itemKey` | `Extract<keyof T, string \| number> \| ((item: T) => Extract<keyof T, string \| number>)` | `'id'` fallback | Identity by key. Constrained to string / number keys — symbol keys are rejected (they can't be safely cast to a property accessor at runtime). |
| `dedupCreated` / `filterDeleted` / `mergeOnUpdated` | `boolean` | `false` | Gate flags — see above. |

| Member | Type | Description |
|---|---|---|
| `data` / `busy` / `total` / `isEmpty` | `ComputedRef` | Read-only views. `total` falls back to `data.length` until a server total has been reported, then keeps the last reported value. |
| `meta` | `Meta` | Reactive plain bag (`shallowReactive`). |
| `error` | `Ref<unknown>` | Last captured failure. |
| `load(next?)` | `Promise<void>` | Merge meta + re-fire. Never rejects. |
| `refresh()` | `Promise<void>` | `load()` with meta unchanged. |
| `mutate(fn)` | `Promise<R>` | Run a write under busy/error accounting. Rethrows. |
| `create` / `update` / `delete` | `(item: T) => void` | Local mutators; buffered during a load. |
| `applyCreate` / `applyUpdate` / `applyDelete` | `(current: T[], item: T) => T[]` | Pure next-array builders. |
| `findIndex` / `getItemKey` / `flags` | — | Identity + flag introspection (part of the `ListState` contract). |
| `dehydrate()` | `{ data, total?, meta }` | JSON-able snapshot. |

### `defineDataRecord(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `load` | `(meta: Meta) => Promise<{ data: T \| undefined; meta?: Partial<Meta> }>` | — | **Required.** |
| `initialMeta` | `Meta` | `{}` | Seed for the meta bag. |
| `initialData` | `T` | — | Adoption path; skips `autoLoad`. Aliased, not cloned. |
| `autoLoad` | `boolean` | `true` | |
| `hydrate` | `Snapshot \| (() => Snapshot \| null \| undefined)` | — | |

| Member | Type | Description |
|---|---|---|
| `data` | `ComputedRef<T \| undefined>` | |
| `busy` / `error` / `meta` | — | As the collection variant. |
| `load(next?)` / `refresh()` | `Promise<void>` | |
| `ensure()` | `Promise<void>` | Fetch only when unresolved; coalesces onto an in-flight load. |
| `set` / `merge` / `clear` | — | Local mutators; buffered during a load. |
| `mutate(fn)` | `Promise<R>` | Rethrows. |
| `dehydrate()` | `{ data?, meta }` | JSON-able snapshot. |

## See also

- [List](/components/list) — the `<VCList :state>` binding and `defineList()`
- [Pagination](/components/pagination) — the `@load` payload wired above
- [Composables](/guide/composables) — the rest of vuecs's composable families
