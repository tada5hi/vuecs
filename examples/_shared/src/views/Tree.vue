<script setup lang="ts">
import { VCTree, parseTreePaths } from '@vuecs/tree';
import { computed, ref } from 'vue';

// ── 1. Folder pane ────────────────────────────────────────────────────────
// The use case the component exists for: a backend hands back a flat list of
// '/'-delimited paths, `parseTreePaths()` nests them, and every node's `id`
// IS its full path — so the bound selection round-trips straight into a
// `?path=` query parameter.
const paths = [
    'users',
    'users/employees',
    'users/employees/contractors',
    'users/admins',
    'groups',
    'groups/internal',
    'sources',
    'sources/ldap',
    'sources/oauth',
    'flows',
];

const folders = parseTreePaths(paths);

const selectedPath = ref<string | null>('users/employees');

// `:guides` draws the `|` / `+-` rails in the indent gutters. Off by default
// because it changes a row's inner DOM; toggled here so both reads are visible.
const guides = ref(true);
const expandedPaths = ref<string[]>(['users', 'sources']);

// ── 2. Cascade ────────────────────────────────────────────────────────────
// `:cascade` requires `:multiple`. Selecting a branch selects its whole
// subtree; a branch with only some children selected reports
// `aria-checked="mixed"` (and exposes `indeterminate` to the `#item` slot).
const permissions = parseTreePaths([
    'user/read',
    'user/write',
    'user/delete',
    'realm/read',
    'realm/write',
]);

const grantedPermissions = ref<string[]>(['user/read']);

// ── 3. Lazy children ──────────────────────────────────────────────────────
// `:has-children` marks a branch expandable BEFORE anything is fetched;
// `:load` runs the first time that branch is expanded.
type Directory = {
    id: string,
    label: string,
    children?: Directory[],
    lazy?: boolean
};

const directories: Directory[] = [
    {
        id: 'var',
        label: 'var',
        lazy: true,
    },
    {
        id: 'etc',
        label: 'etc',
        lazy: true,
    },
    {
        id: 'readme.md',
        label: 'readme.md',
    },
];

const loadErrors = ref<string[]>([]);

function hasChildren(item: Directory): boolean {
    return !!item.lazy;
}

function load(item: Directory): Promise<Directory[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: `${item.id}/log`,
                    label: 'log',
                },
                {
                    id: `${item.id}/cache`,
                    label: 'cache',
                },
            ]);
        }, 600);
    });
}

function onLoadError(payload: { key: string }): void {
    loadErrors.value = [...loadErrors.value, payload.key];
}

const grantedSummary = computed(() => (grantedPermissions.value.length > 0 ?
    grantedPermissions.value.join(', ') :
    'none'));
</script>

<template>
    <div class="vc-demo-stack">
        <section>
            <h3 class="vc-demo-h">
                Folder pane — <code>parseTreePaths()</code> + <code>v-model:selection</code>
            </h3>
            <label class="vc-demo-toggle">
                <input
                    v-model="guides"
                    type="checkbox"
                >
                <code>:guides</code> — draw connector rails
            </label>
            <div class="vc-demo-split">
                <div class="vc-demo-pane">
                    <VCTree
                        v-model:selection="selectedPath"
                        v-model:expanded="expandedPaths"
                        :items="folders"
                        :guides="guides"
                    />
                </div>

                <dl class="vc-demo-readout">
                    <dt>selection</dt>
                    <dd>
                        <code>{{ selectedPath ?? '—' }}</code>
                    </dd>
                    <dt>expanded</dt>
                    <dd>
                        <code>{{ expandedPaths.length ? expandedPaths.join(', ') : '—' }}</code>
                    </dd>
                </dl>
            </div>
            <p class="vc-demo-hint">
                Click a row to select it, the chevron to expand. Arrow keys move,
                <kbd>←</kbd>/<kbd>→</kbd> collapse and expand.
            </p>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Cascade — <code>:multiple</code> + <code>:cascade</code>
            </h3>
            <div class="vc-demo-split">
                <div class="vc-demo-pane">
                    <VCTree
                        v-model:selection="grantedPermissions"
                        :items="permissions"
                        :default-expanded="['user', 'realm']"
                        multiple
                        cascade
                    >
                        <template #item="{ item, selected, indeterminate, classes }">
                            <span
                                class="vc-demo-check"
                                :data-state="selected ? 'checked' : (indeterminate ? 'mixed' : 'unchecked')"
                                aria-hidden="true"
                            />
                            <span :class="classes.label">{{ item.label }}</span>
                        </template>
                    </VCTree>
                </div>

                <dl class="vc-demo-readout">
                    <dt>selection</dt>
                    <dd>
                        <code>{{ grantedSummary }}</code>
                    </dd>
                </dl>
            </div>
            <p class="vc-demo-hint">
                Selecting a parent selects its whole subtree; clearing one child drops the
                parent to the mixed state (<code>aria-checked="mixed"</code>).
            </p>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Lazy children — <code>:load</code> + <code>:has-children</code>
            </h3>
            <div class="vc-demo-pane vc-demo-pane-narrow">
                <VCTree
                    :items="directories"
                    :has-children="hasChildren"
                    :load="load"
                    @load-error="onLoadError"
                />
            </div>
            <p class="vc-demo-hint">
                <code>var</code> and <code>etc</code> report children before any are fetched.
                Expanding one resolves them after a short delay — the row carries
                <code>aria-busy="true"</code> while it loads.
            </p>
            <p
                v-if="loadErrors.length"
                class="vc-demo-hint"
            >
                Failed to load: <code>{{ loadErrors.join(', ') }}</code>
            </p>
        </section>
    </div>
</template>

<style scoped>
.vc-demo-stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 44rem;
}
.vc-demo-h {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: var(--vc-color-fg-muted);
}
.vc-demo-split {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;
}
.vc-demo-pane {
    flex: 1 1 16rem;
    min-width: 14rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.375rem;
    padding: 0.5rem;
}
.vc-demo-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0 0 0.5rem;
    font-size: 0.8125rem;
    color: var(--vc-color-fg-muted);
    cursor: pointer;
}
.vc-demo-pane-narrow {
    max-width: 20rem;
}
.vc-demo-readout {
    flex: 1 1 14rem;
    margin: 0;
    font-size: 0.75rem;
}
.vc-demo-readout dt {
    font-weight: 600;
    color: var(--vc-color-fg-muted);
}
.vc-demo-readout dd {
    margin: 0 0 0.5rem;
    word-break: break-all;
}
.vc-demo-hint {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--vc-color-fg-muted);
}

/*
 * Demo-only checkbox marker. `<VCTree>` paints the cascade state as ARIA
 * (`aria-checked="true|false|mixed"`) and exposes `selected` /
 * `indeterminate` to the `#item` slot; drawing a box from those is a call-site
 * concern, so it lives here rather than in the component.
 */
.vc-demo-check {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 0.875rem;
    height: 0.875rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.1875rem;
    background-color: var(--vc-color-bg);
}
.vc-demo-check[data-state="checked"],
.vc-demo-check[data-state="mixed"] {
    border-color: var(--vc-color-primary-600);
    background-color: var(--vc-color-primary-600);
}
.vc-demo-check[data-state="checked"]::after {
    content: "";
    width: 0.25rem;
    height: 0.5rem;
    border-right: 2px solid var(--vc-color-bg);
    border-bottom: 2px solid var(--vc-color-bg);
    transform: translateY(-1px) rotate(45deg);
}
.vc-demo-check[data-state="mixed"]::after {
    content: "";
    width: 0.5rem;
    height: 2px;
    background-color: var(--vc-color-bg);
}
</style>
