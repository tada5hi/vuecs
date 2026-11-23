import type { Ref } from 'vue';

/**
 * Context shared from `<VCFormRadioGroup>` to its descendant
 * `<VCFormRadio>` items — both the `:options`-rendered ones and
 * default-slot children.
 *
 * `segmented` switches every item to the segment face (label inside the
 * Reka radio button, no indicator, no sibling `<label>`). `size` carries
 * the group's `themeVariant.size` down (segmented groups only; `undefined`
 * otherwise) so the items' `formRadio` size variant follows the group; an
 * item's own `themeVariant.size` wins.
 */
export type FormRadioGroupContext = {
    segmented: Ref<boolean>;
    size: () => string | boolean | undefined;
};
