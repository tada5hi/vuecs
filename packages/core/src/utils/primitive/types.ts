import type { Component } from 'vue';

// The trailing `{} & string` keeps autocomplete on the known tags while
// allowing any other string (custom elements, future HTML5 tags). Same
// idiom upstream Reka uses.
type AnyString = string & Record<never, never>;

export type AsTag =    | 'a' |
    'button' |
    'div' |
    'form' |
    'h2' |
    'h3' |
    'img' |
    'input' |
    'label' |
    'li' |
    'nav' |
    'ol' |
    'p' |
    'span' |
    'svg' |
    'ul' |
    'template' |
    AnyString;

export interface PrimitiveProps {
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     */
    asChild?: boolean;
    /**
     * The element or component this component should render as. Can be overwritten by `asChild`.
     * @defaultValue "div"
     */
    as?: AsTag | Component;
}
