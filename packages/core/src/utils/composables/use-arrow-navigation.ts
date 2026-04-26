export type ArrowKeyOptions = 'horizontal' | 'vertical' | 'both';

export type ArrowNavigationOptions = {
    /** Restrict navigation to one axis. Default: `'both'`. */
    arrowKeyOptions?: ArrowKeyOptions;
    /** CSS selector that identifies collection items. Default: `'[data-vc-collection-item]'`. */
    attributeName?: string;
    /** Pre-resolved item array. Used when `parentElement` is unavailable. */
    itemsArray?: HTMLElement[];
    /** Wrap from last to first (and vice versa). Default: `true`. */
    loop?: boolean;
    /** Reading direction for horizontal arrows. Default: `'ltr'`. */
    dir?: 'ltr' | 'rtl';
    /** Call `event.preventDefault()` on a matching key. Default: `true`. */
    preventScroll?: boolean;
    /** Focus the resolved item before returning it. Default: `false`. */
    focus?: boolean;
    /** Skip navigation when the event originates from `<input>` / `<textarea>`. Default: `false`. */
    enableIgnoredElement?: boolean;
};

const ignoredElements = ['INPUT', 'TEXTAREA'] as const;

/**
 * Resolves the next focusable collection item for an arrow / Home / End key
 * event. Skips disabled elements (`disabled` attribute set to anything but
 * `"false"`).
 *
 * Mirrors reka-ui's `useArrowNavigation` (MIT, https://github.com/unovue/reka-ui).
 * Default `attributeName` is changed from `[data-reka-collection-item]` to
 * `[data-vc-collection-item]` to match vuecs's data-attribute namespace.
 */
export function useArrowNavigation(
    e: KeyboardEvent,
    currentElement: HTMLElement | null | undefined,
    parentElement: HTMLElement | null | undefined,
    options: ArrowNavigationOptions = {},
): HTMLElement | null {
    if (!currentElement) {
        return null;
    }
    if (options.enableIgnoredElement && ignoredElements.includes(currentElement.nodeName as typeof ignoredElements[number])) {
        return null;
    }

    const {
        arrowKeyOptions = 'both',
        attributeName = '[data-vc-collection-item]',
        itemsArray = [],
        loop = true,
        dir = 'ltr',
        preventScroll = true,
        focus = false,
    } = options;

    const right = e.key === 'ArrowRight';
    const left = e.key === 'ArrowLeft';
    const up = e.key === 'ArrowUp';
    const down = e.key === 'ArrowDown';
    const home = e.key === 'Home';
    const end = e.key === 'End';

    const goingVertical = up || down;
    const goingHorizontal = right || left;

    if (
        !home && !end &&
        ((!goingVertical && !goingHorizontal) ||
            (arrowKeyOptions === 'vertical' && goingHorizontal) ||
            (arrowKeyOptions === 'horizontal' && goingVertical))
    ) {
        return null;
    }

    const allCollectionItems = parentElement ?
        Array.from(parentElement.querySelectorAll<HTMLElement>(attributeName)) :
        itemsArray;

    if (!allCollectionItems.length) {
        return null;
    }

    if (preventScroll) {
        e.preventDefault();
    }

    let item: HTMLElement | null = null;
    if (goingHorizontal || goingVertical) {
        let goForward: boolean;
        if (goingVertical) {
            goForward = down;
        } else {
            goForward = dir === 'ltr' ? right : left;
        }
        item = findNextFocusableElement(allCollectionItems, currentElement, { goForward, loop });
    } else if (home) {
        item = allCollectionItems.at(0) ?? null;
    } else if (end) {
        item = allCollectionItems.at(-1) ?? null;
    }

    if (focus) {
        item?.focus();
    }
    return item;
}

function findNextFocusableElement(
    elements: HTMLElement[],
    currentElement: HTMLElement,
    options: { goForward: boolean; loop: boolean },
    iterations: number = !elements.includes(currentElement) ? elements.length + 1 : elements.length,
): HTMLElement | null {
    if (--iterations === 0) {
        return null;
    }
    const index = elements.indexOf(currentElement);
    let newIndex: number;
    if (index === -1) {
        newIndex = options.goForward ? 0 : elements.length - 1;
    } else {
        newIndex = options.goForward ? index + 1 : index - 1;
    }
    if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) {
        return null;
    }
    const adjustedIndex = (newIndex + elements.length) % elements.length;
    const candidate = elements[adjustedIndex];
    if (!candidate) {
        return null;
    }
    const isDisabled = candidate.hasAttribute('disabled') && candidate.getAttribute('disabled') !== 'false';
    if (isDisabled) {
        return findNextFocusableElement(elements, candidate, options, iterations);
    }
    return candidate;
}
