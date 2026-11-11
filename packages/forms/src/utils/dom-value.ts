import type { Directive } from 'vue';

type ValueElement = globalThis.HTMLInputElement | globalThis.HTMLTextAreaElement;

function apply(el: ValueElement, value: string | null | undefined): void {
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
export const vDomValue: Directive<ValueElement, string | null | undefined> = {
    mounted(el, { value }) {
        apply(el, value);
    },
    updated(el, { value }) {
        apply(el, value);
    },
    // server markup keeps the initial value, as `v-model`'s does
    getSSRProps({ value }) {
        return { value: value ?? '' };
    },
};
