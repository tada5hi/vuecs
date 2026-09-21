import type { TreeNode } from './types';

/**
 * Build a nested `TreeNode[]` from a flat list of delimited paths.
 *
 * ```ts
 * parseTreePaths(['users', 'users/employees', 'sources/ldap'])
 * // [
 * //   { id: 'users',   label: 'users',   children: [{ id: 'users/employees', label: 'employees' }] },
 * //   { id: 'sources', label: 'sources', children: [{ id: 'sources/ldap',    label: 'ldap' }] },
 * // ]
 * ```
 *
 * Each node's `id` is its **full path**, so it round-trips straight into a
 * `?path=` query parameter — which is the whole reason this helper exists
 * rather than leaving every consumer to hand-roll it.
 *
 * - Intermediate nodes are synthesised even when never listed (`sources`
 *   above).
 * - A path listed twice collapses into one node.
 * - First-seen order is preserved at every level.
 * - Empty segments (leading, trailing or doubled delimiters) are ignored.
 */
export function parseTreePaths(paths: string[], delimiter = '/'): TreeNode[] {
    const roots: TreeNode[] = [];
    const byId = new Map<string, TreeNode>();

    for (const path of paths) {
        const segments = path.split(delimiter).filter((segment) => segment.length > 0);

        let parent: TreeNode | undefined;
        let id = '';

        for (const segment of segments) {
            id = id.length > 0 ? `${id}${delimiter}${segment}` : segment;

            let node = byId.get(id);
            if (!node) {
                node = { id, label: segment };
                byId.set(id, node);

                if (parent) {
                    parent.children = parent.children ?? [];
                    parent.children.push(node);
                } else {
                    roots.push(node);
                }
            }

            parent = node;
        }
    }

    return roots;
}
