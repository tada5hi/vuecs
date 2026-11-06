/*
 * Iframe runtime — runs inside each demo and coordinates with the parent
 * docs page via postMessage:
 *
 *   parent → iframe { type: 'set-color-mode', mode: 'light' | 'dark' }
 *   parent → iframe { type: 'set-variants', values: { <variantName>: <value> } }
 *   parent → iframe { type: 'set-props',    values: { <propPath>: <value> } }
 *   parent → iframe { type: 'set-palette', primary?, neutral? }
 *   iframe → parent { type: 'demo-resize', height: number }
 *   iframe → parent { type: 'demo-variants', catalog, defaults }
 *   iframe → parent { type: 'demo-props',    catalog, defaults }
 *
 * The parents (`Demo.vue` for passive showcases, `Playground.vue` for
 * interactive sandboxes) both listen for `demo-resize` to size the
 * iframe to its content. Only `Playground.vue` listens for
 * `demo-variants` (renders variant dropdowns) and `demo-props` (renders
 * rich type-aware controls); `Demo.vue` ignores those — passive demos
 * have no toolbar. The iframe listens for `set-color-mode` to flip the
 * `.dark` class on `<html>`, for `set-variants` to update
 * `variantState`, and for `set-props` to update `propState` — both of
 * which any demo can `import` and bind to its component.
 *
 * Origin handling: outgoing `postMessage` calls use `location.origin` as
 * the targetOrigin (not `'*'`), so the message is delivered only when
 * the parent serves the iframe from the same origin — which is always
 * the case for the vuecs.dev docs deploy. Cross-origin embedders never
 * receive height or variant catalog data.
 *
 * Incoming messages from `window.parent` are gated on
 * `event.origin === location.origin` for the same reason: a malicious
 * page that iframes ours can't trigger color-mode/variant/palette
 * mutations. `event.source === window.parent` is also checked as a
 * defense-in-depth against same-origin sibling frames.
 */

export type PropBooleanSpec = {
    type: 'boolean',
    default: boolean,
    section?: string,
    label?: string,
};

export type PropEnumSpec = {
    type: 'enum',
    default: string,
    options: readonly string[],
    section?: string,
    label?: string,
};

export type PropNumberSpec = {
    type: 'number',
    default: number,
    min?: number,
    max?: number,
    step?: number,
    section?: string,
    label?: string,
};

export type PropStringSpec = {
    type: 'string',
    default: string,
    section?: string,
    label?: string,
    placeholder?: string,
};

export type PropSpec = PropBooleanSpec | PropEnumSpec | PropNumberSpec | PropStringSpec;

export type PropCatalog = Record<string, PropSpec>;

export type PropValues = Record<string, boolean | string | number>;

export type ParentMessage =    | { type: 'set-color-mode', mode: 'light' | 'dark' } |
    { type: 'set-variants', values: Record<string, string> } |
    { type: 'set-props', values: PropValues } |
    {
        type: 'set-palette',
        primary?: string,
        neutral?: string
    };

export type VariantCatalog = Record<string, readonly string[]>;

export type VariantValues = Record<string, string>;
