/**
 * The shape `parseTreePaths()` produces — and the default shape `<VCTree>`
 * understands without any accessor props (`id` satisfies the identity
 * ladder's `.id` fallback, `children` satisfies the `getChildren` fallback).
 */
export type TreeNode = {
    id: string,
    label: string,
    children?: TreeNode[]
};

/**
 * One node of the precomputed whole-tree index.
 *
 * `resolved` records whether `getChildren` returned an array at all. An
 * *unresolved* node (lazy children not fetched yet, or a genuine leaf) is a
 * **leaf for cascade purposes** — it keeps whatever explicit selection state
 * it was given rather than being derived from children it doesn't have.
 */
export type TreeIndexNode<Item> = {
    key: string,
    item: Item,
    parentKey?: string,
    childKeys: string[],
    /** 1-based, matching Reka's `aria-level`. */
    level: number,
    resolved: boolean,
    disabled: boolean
};

/**
 * A whole-tree index — every node, expanded or not.
 *
 * Deriving the cascade from this (rather than from the visible flattened
 * list) is what makes a collapsed parent update correctly; see the cascade
 * module header.
 */
export type TreeIndex<Item> = {
    nodes: Map<string, TreeIndexNode<Item>>,
    /** Pre-order DFS over the full tree. Reversed, it is a post-order walk. */
    order: string[],
    rootKeys: string[],
    /**
     * Item reference -> key. Lets the Reka-facing `getKey` resolve without
     * ever calling the consumer's `itemId` / `itemKey` resolver — Reka
     * invokes `getKey({})` on a phantom object in single-select mode, and a
     * consumer resolver like `(i) => i.id.toString()` would throw on it.
     */
    refKeys: WeakMap<object, string>
};

export type TreeIndexOptions<Item> = {
    isDisabled?: (item: Item) => boolean,
    /**
     * Guard against a cyclic `getChildren`. The duplicate-key check catches
     * a cycle that reuses keys; a cycle that mints fresh keys needs this.
     */
    maxDepth?: number
};

export type CascadeResult = {
    selected: Set<string>,
    indeterminate: Set<string>
};
