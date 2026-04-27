/**
 * Props for `<VCPresence>`. Vuecs-owned shape — kept independent of the
 * underlying `reka-ui` `PresenceProps` so the upstream type can evolve
 * without breaking vuecs consumers.
 */
export type VCPresenceProps = {
    /**
     * Whether the wrapped subtree is "present" right now. The component
     * keeps the children mounted while open, and waits for any in-flight
     * CSS animation (driven by `data-state="open|closed"` attributes on
     * the children) to finish before unmounting.
     */
    present: boolean;
    /**
     * Force the inner element to stay mounted regardless of `present`.
     * Useful when consumer code controls mount lifecycle elsewhere.
     */
    forceMount?: boolean;
};
