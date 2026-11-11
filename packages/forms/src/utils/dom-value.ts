import type { Directive } from 'vue';

type ValueElement = globalThis.HTMLInputElement | globalThis.HTMLTextAreaElement;

type DomValue = string | null | undefined;

/**
 * Input types whose `.value` reflects the `value` attribute (the HTML "default"
 * and "default/on" value modes) instead of holding a separate current value.
 * Removing the attribute would clear their value.
 */
const ATTRIBUTE_VALUE_TYPES = new Set([
    'hidden',
    'submit',
    'image',
    'reset',
    'button',
    'checkbox',
    'radio',
]);

/**
 * The value a text control shows: a forwarded native `value` attribute wins
 * over the model, as it did when both were merged into the vnode's props.
 */
export function resolveDomValue(attrs: Record<string, unknown>, model: DomValue): DomValue {
    if (!Object.hasOwn(attrs, 'value')) {
        return model;
    }

    const forwarded = attrs.value;

    return forwarded === null || forwarded === undefined ? null : String(forwarded);
}

/** The forwarded attributes without `value`, which only `vDomValue` may set. */
export function withoutValue(attrs: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'value'));
}

function apply(el: ValueElement, value: DomValue): void {
    const next = value ?? '';

    // a write that matches would move the caret to the end while typing
    if (el.value !== next) {
        el.value = next;
    }
}

/**
 * Sets a text control's value as a DOM property only, the way `v-model` does.
 * A `value` vnode prop is mirrored into the `value` attribute by Vue's runtime,
 * so a typed or bound value (a password, a key) would sit in the markup.
 */
export const vDomValue: Directive<ValueElement, DomValue> = {
    mounted(el, { value }) {
        // always written: the control then holds its own value, not its default
        el.value = value ?? '';

        // a hydrated control keeps the server's default, which a form reset would restore
        if (el.tagName === 'TEXTAREA') {
            el.defaultValue = '';
        } else if (!ATTRIBUTE_VALUE_TYPES.has((el as globalThis.HTMLInputElement).type)) {
            // only where `.value` is separate from the attribute; for a hidden
            // input (and the like) the attribute is the value
            el.removeAttribute('value');
        }
    },
    updated(el, { value }) {
        apply(el, value);
    },
    // server markup keeps the initial value, as `v-model`'s does
    getSSRProps({ value }) {
        return { value: value ?? '' };
    },
};
