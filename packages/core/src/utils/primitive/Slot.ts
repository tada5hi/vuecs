import {
    Comment, 
    cloneVNode, 
    defineComponent, 
    mergeProps,
} from 'vue';
import { renderSlotFragments } from './render-slot-fragments';

/**
 * Internal helper component used by `Primitive` to implement the `asChild`
 * pattern — clones the first non-comment child of the default slot and merges
 * the wrapper's attrs onto it. Multi-child slots return every child unchanged
 * apart from the first, which carries the merged attrs.
 *
 * Mirrors reka-ui's `Slot` (MIT, https://github.com/unovue/reka-ui) so
 * `@vuecs/core` stays zero-dep beyond Vue. Not part of the public API of
 * `@vuecs/core` — keep usage internal to `Primitive`.
 */
export const Slot = defineComponent({
    name: 'VCPrimitiveSlot',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
        return () => {
            if (!slots.default) {
                return null;
            }

            const children = renderSlotFragments(slots.default());
            const firstNonCommentChildrenIndex = children.findIndex(
                (child) => child.type !== Comment,
            );
            if (firstNonCommentChildrenIndex === -1) {
                return children;
            }

            const firstNonCommentChildren = children[firstNonCommentChildrenIndex];

            // Remove `ref` from props **so cloneVNode doesn't re-normalize it
            // against Slot's `currentRenderingInstance`**. The consumer's
            // ref was already normalized into `vnode.ref` (top-level, with
            // the consumer's instance attached) when their render fn called
            // `h()`. If we left `props.ref` in place, mergeProps would carry
            // it into `extraProps`, and cloneVNode's
            //   `extraProps.ref ? normalizeRef(extraProps) : vnode.ref`
            // branch would re-bind the string ref to Slot's instance
            // instead of the consumer's. Deleting `props.ref` forces
            // cloneVNode to keep the original `vnode.ref` — preserving the
            // consumer's template-ref binding through the asChild clone.
            //
            // We mutate the original vnode's props in place (same as Reka).
            // Safe because Vue's compiler does not static-hoist vnodes that
            // carry `ref` (a ref is dynamic by definition), so these vnodes
            // are freshly produced by the consumer's render fn per pass.
            if (firstNonCommentChildren.props) {
                delete firstNonCommentChildren.props.ref;
            }

            // `mergeProps(attrs, child.props)` — child props take precedence
            // over wrapper attrs on conflict, so consumer class on the slot
            // child wins. `cloneVNode(node, attrs)` reverses that precedence;
            // we have to merge manually first.
            const mergedProps = firstNonCommentChildren.props ?
                mergeProps(attrs, firstNonCommentChildren.props) :
                attrs;
            const cloned = cloneVNode(
                { ...firstNonCommentChildren, props: {} },
                mergedProps,
            );

            if (children.length === 1) {
                return cloned;
            }

            children[firstNonCommentChildrenIndex] = cloned;
            return children;
        };
    },
});
