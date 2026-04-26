import {
    computed,
    getCurrentInstance,
    onUpdated,
    ref,
    triggerRef,
    unref,
} from 'vue';
import type { ComponentPublicInstance, Ref } from 'vue';

type ElementOrComponent = Element | ComponentPublicInstance | null | undefined;

function unrefElement(elRef: Ref<ElementOrComponent>): Element | null | undefined {
    const plain = unref(elRef) as ElementOrComponent;
    if (plain == null) {
        return plain as null | undefined;
    }
    if ('$el' in plain) {
        return (plain as ComponentPublicInstance).$el as Element;
    }
    return plain as Element;
}

/**
 * Re-exposes the inner element/component (via `forwardRef`) and the wrapper's
 * own props on the wrapper's `expose`. Lets a wrapper component delegate
 * imperative APIs and template refs to its child without manual plumbing.
 *
 * Mirrors reka-ui's `useForwardExpose` (MIT, https://github.com/unovue/reka-ui),
 * with an inlined `unrefElement` so `@vuecs/core` stays zero-dep.
 */
export function useForwardExpose() {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('[vuecs] useForwardExpose must be called inside setup()');
    }

    const currentRef = ref<ElementOrComponent>();
    const currentElement = computed(() => resolveCurrentElement());

    onUpdated(() => {
        if (currentElement.value !== resolveCurrentElement()) {
            triggerRef(currentRef);
        }
    });

    function resolveCurrentElement(): Element | null | undefined {
        const value = currentRef.value as ElementOrComponent;
        if (value && '$el' in value) {
            const el = (value as ComponentPublicInstance).$el as Node | null;
            if (el && (el.nodeName === '#text' || el.nodeName === '#comment')) {
                return (el as unknown as Element).nextElementSibling;
            }
        }
        return unrefElement(currentRef as Ref<ElementOrComponent>);
    }

    const localExpose: Record<string, unknown> = { ...(instance.exposed ?? {}) };
    const ret: Record<string, unknown> = {};

    for (const key in instance.props) {
        Object.defineProperty(ret, key, {
            enumerable: true,
            configurable: true,
            get: () => instance.props[key],
        });
    }

    if (Object.keys(localExpose).length > 0) {
        for (const key in localExpose) {
            Object.defineProperty(ret, key, {
                enumerable: true,
                configurable: true,
                get: () => localExpose[key],
            });
        }
    }

    Object.defineProperty(ret, '$el', {
        enumerable: true,
        configurable: true,
        get: () => instance.vnode.el,
    });

    instance.exposed = ret;

    function forwardRef(refValue: ElementOrComponent) {
        currentRef.value = refValue;
        if (!refValue) {
            return;
        }

        Object.defineProperty(ret, '$el', {
            enumerable: true,
            configurable: true,
            get: () => (refValue instanceof Element ? refValue : (refValue as ComponentPublicInstance).$el),
        });

        if (!(refValue instanceof Element) && !Object.hasOwn(refValue, '$el')) {
            const childExposed = (refValue as ComponentPublicInstance & { $: { exposed?: Record<string, unknown> } }).$.exposed;
            const merged: Record<string, unknown> = { ...ret };
            for (const key in childExposed) {
                Object.defineProperty(merged, key, {
                    enumerable: true,
                    configurable: true,
                    get: () => childExposed[key],
                });
            }
            instance.exposed = merged;
        }
    }

    return {
        forwardRef,
        currentRef,
        currentElement,
    };
}
