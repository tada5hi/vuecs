/**
 * Returns true if either scoped or unscoped named slot exists
 *
 * @returns {Array|undefined} VNodes
 *
 * @param names
 * @param $scopedSlots
 * @param $slots
 */
export declare function hasNormalizedSlot(names: string[] | string, $scopedSlots?: Record<string, any>, $slots?: Record<string, any>): boolean;
/**
 * Returns VNodes for named slot either scoped or unscoped
 *
 * @param names
 * @param {String} scope
 * @param $scopedSlots
 * @param $slots
 *
 * @returns {Array|undefined} VNodes
 */
export declare function normalizeSlot(names: string[] | string, scope?: Record<string, any>, $scopedSlots?: Record<string, any>, $slots?: Record<string, any>): any;
//# sourceMappingURL=normalize-slot.d.ts.map