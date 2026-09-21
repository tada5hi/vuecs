/// <reference types="vite/client" />
import tree, { VCTree, parseTreePaths } from '@vuecs/tree';
import type { TreeNode } from '@vuecs/tree';
import {
    computed,
    createApp,
    h,
    ref,
    watch,
} from 'vue';
import type { CSSProperties, Component } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

/*
 * `@vuecs/tree`'s structural CSS is extracted into its own bundle at build
 * time — the JS entry does not auto-import it. Every other demo package is
 * pulled in from the shared `style.css`; this one is imported here so the
 * entry stays self-contained.
 */
import '@vuecs/tree/style.css';

/*
 * The flagship use case: a folder pane. `parseTreePaths` turns a flat list
 * of delimited paths into nested nodes whose `id` is the FULL path — so the
 * selected key drops straight into a `?path=` query parameter and reads back
 * out again without a lookup table.
 */
const FOLDER_PATHS = [
    'users',
    'users/employees',
    'users/admins',
    'sources',
    'sources/ldap',
];

const folders = parseTreePaths(FOLDER_PATHS);

/** Only present while the `lazy load` control is on. */
const LAZY_ROOT: TreeNode = { id: 'remote', label: 'remote' };

const LAZY_CHILDREN: TreeNode[] = [
    { id: 'remote/oauth2', label: 'oauth2' },
    { id: 'remote/openid', label: 'openid' },
];

const layoutStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
};

const panelStyle: CSSProperties = {
    border: '1px solid var(--vc-color-border)',
    borderRadius: 'var(--vc-radius-md)',
    padding: '0.75rem',
    minHeight: '9rem',
};

const echoStyle: CSSProperties = {
    margin: 0,
    fontSize: '0.8125rem',
};

const hintStyle: CSSProperties = {
    margin: 0,
    fontSize: '0.75rem',
    opacity: '0.7',
};

const app = createApp({
    setup() {
        // Selection is KEY-shaped, never item objects — and the shape
        // follows `:multiple` (a bare key or `null` in single mode, an
        // array in multi mode).
        const selection = ref<string | string[] | null>('users/employees');
        const expanded = ref<string[]>(['users']);

        // `cascade` requires `multiple` (a single-selection tree has no
        // subtree to propagate into), so turning it on implies it here
        // rather than leaving an inert control in the toolbar.
        const multiple = computed(() => Boolean(propState.value.multiple) || Boolean(propState.value.cascade));
        const cascade = computed(() => Boolean(propState.value.cascade));
        const lazy = computed(() => Boolean(propState.value.lazy));
        const disabled = computed(() => Boolean(propState.value.disabled));
        const showEmpty = computed(() => Boolean(propState.value.empty));

        watch(multiple, (value) => {
            const current = selection.value;

            if (value) {
                selection.value = typeof current === 'string' ? [current] : (current ?? []);

                return;
            }

            selection.value = Array.isArray(current) ? (current[0] ?? null) : current;
        });

        const items = computed<TreeNode[]>(() => {
            if (showEmpty.value) {
                return [];
            }

            return lazy.value ? [...folders, LAZY_ROOT] : folders;
        });

        const selectedKeys = computed<string[]>(() => {
            const current = selection.value;

            if (Array.isArray(current)) {
                return current;
            }

            return typeof current === 'string' ? [current] : [];
        });

        const loadChildren = (): Promise<TreeNode[]> => new Promise((resolve) => {
            setTimeout(() => resolve(LAZY_CHILDREN), 600);
        });

        return () => h('div', { style: layoutStyle }, [
            h('div', { style: panelStyle }, [
                // `<VCTree>` is exported as a generic-over-`Item` function
                // type, which isn't structurally a Vue `Component`. Template
                // usage is unaffected; a render-function call site casts.
                h(VCTree as unknown as Component, {
                    'items': items.value,
                    'selection': selection.value,
                    'onUpdate:selection': (value: string | string[] | null) => {
                        selection.value = value;
                    },
                    'expanded': expanded.value,
                    'onUpdate:expanded': (value: string[]) => {
                        expanded.value = value;
                    },
                    'multiple': multiple.value,
                    'cascade': cascade.value,
                    'disabled': disabled.value,
                    'hasChildren': lazy.value ?
                        (item: TreeNode) => item.id === LAZY_ROOT.id :
                        undefined,
                    'load': lazy.value ? loadChildren : undefined,
                }, { empty: () => 'No folders.' }),
            ]),
            h('p', { style: echoStyle }, [
                '?path=',
                h('code', {}, selectedKeys.value.length > 0 ? selectedKeys.value.join(',') : '—'),
            ]),
            h(
                'p',
                { style: hintStyle },
                'Click a row to select it · Shift+click extends a range · ←/→ collapse & expand · ↑/↓ move',
            ),
        ]);
    },
});
installVuecs(app);
app.use(tree);
app.mount('#app');

announceProps(
    {
        multiple: {
            type: 'boolean',
            default: false,
            section: 'Selection',
        },
        cascade: {
            type: 'boolean',
            default: false,
            // Implies `multiple` — see the note in setup() above.
            section: 'Selection',
        },
        lazy: {
            type: 'boolean',
            default: false,
            label: 'lazy load',
            section: 'Behavior',
        },
        disabled: {
            type: 'boolean',
            default: false,
            section: 'Behavior',
        },
        empty: {
            type: 'boolean',
            default: false,
            label: 'no items',
            section: 'State',
        },
    },
    {
        multiple: false,
        cascade: false,
        lazy: false,
        disabled: false,
        empty: false,
    },
);

installIframeBridge();
