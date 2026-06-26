import type { VNode, VNodeProps } from 'vue';

export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;

export type VNodeClass = string | string[] | Record<string, boolean> | VNodeClass[];
export type VNodeProperties = VNodeProps & {
    class?: VNodeClass,
    [key: string]: any
};

// ──────────────────────────────────────────────────────────────────────────
// Generic-component facade (issue #1601 / #1660)
// ──────────────────────────────────────────────────────────────────────────

/**
 * The call/return signature `vue-tsc` (Volar) recognizes for a generic
 * component — the exact shape it emits for a `<script setup generic="…">`
 * SFC, expressed by hand so a `defineComponent` render-function component
 * (vuecs's convention — see `.agents/conventions.md`) can stay generic
 * over a consumer-supplied entity type WITHOUT switching to
 * `<script setup>`.
 *
 * Volar reads the slot types off the `__ctx` member of the return type;
 * the `expose` / `setup` parameters mirror the compiler's emitted
 * signature so the cast survives the declaration-emit
 * (`vue-tsc --declaration`) → consume round-trip identically. `attrs` /
 * `emit` aren't inference channels, so they stay `unknown`.
 *
 * `Props` and `Slots` are the already-substituted shapes; the entity
 * type parameter (`<Row>`, `<Item>`, …) is introduced by the component
 * alias wrapping this — e.g.
 *
 *   type VCTableComponent = <Row = Record<string, unknown>>(
 *       ...args: Parameters<GenericComponentShape<TablePropsGeneric<Row>, TableSlots<Row>>>
 *   ) => ReturnType<GenericComponentShape<TablePropsGeneric<Row>, TableSlots<Row>>>;
 *
 * so generic inference flows from the call-site props (`:data` /
 * `:columns`) into the slot props (`#cell-…`, `#header-…`, `#expansion`,
 * `#default`, …).
 *
 * Promoted from `@vuecs/table` to `@vuecs/core` (#1660) so `@vuecs/table`,
 * `@vuecs/list`, and third-party component libraries share one helper
 * instead of duplicating it.
 */
export type GenericComponentShape<Props, Slots> = (
    props: Props,
    ctx?: {
        slots: Slots;
        attrs: unknown;
        emit: unknown;
    },
    expose?: (exposed: Record<string, never>) => void,
    setup?: Promise<{
        props: Props;
        expose: (exposed: Record<string, never>) => void;
        attrs: unknown;
        slots: Slots;
        emit: unknown;
    }>,
) => VNode & {
    __ctx?: {
        props: Props;
        expose: (exposed: Record<string, never>) => void;
        attrs: unknown;
        slots: Slots;
        emit: unknown;
    };
};
