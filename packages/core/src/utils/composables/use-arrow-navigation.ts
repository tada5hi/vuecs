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
 * event. Skips both disabled and visually-hidden elements so collapsed
 * submenus and disabled links don't trap focus.
 *
 * Disabled detection accepts the native `disabled` attribute, `aria-disabled`,
 * `data-disabled`, and the `.disabled` class — `VCLink` (the navigation
 * consumer) renders disabled state as a class, so the reka-ui-style
 * attribute-only check would let arrow navigation land on disabled links.
 *
 * Visibility uses `Element.checkVisibility()` (Chromium 105+, Firefox 125+,
 * Safari 17.4+). When it isn't available (older browsers, jsdom under unit
 * tests) we treat elements as visible; production browsers get the correct
 * filtering, tests get the existing behavior.
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

    const collected = parentElement ?
        Array.from(parentElement.querySelectorAll<HTMLElement>(attributeName)) :
        itemsArray;

    // Filter out hidden items (e.g. inside a collapsed submenu) so arrow
    // navigation can't focus them. See the visibility helper below.
    const allCollectionItems = collected.filter(isVisibleElement);

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
    if (isDisabledElement(candidate)) {
        return findNextFocusableElement(elements, candidate, options, iterations);
    }
    return candidate;
}

function isDisabledElement(el: HTMLElement): boolean {
    // Native `disabled` attribute — set explicitly to anything other than
    // the string `"false"` (HTML allows `disabled=""` and `disabled="disabled"`).
    if (el.hasAttribute('disabled') && el.getAttribute('disabled') !== 'false') {
        return true;
    }
    // ARIA + data-* equivalents for non-button targets (anchors, divs).
    if (el.getAttribute('aria-disabled') === 'true') {
        return true;
    }
    if (el.hasAttribute('data-disabled')) {
        return true;
    }
    // CSS-class disabled state — `VCLink` (the navigation consumer)
    // toggles a `disabled` class on its anchor instead of setting the
    // attribute, so an attribute-only check would never skip disabled
    // navigation links.
    if (el.classList.contains('disabled')) {
        return true;
    }
    return false;
}

function isVisibleElement(el: HTMLElement): boolean {
    // `checkVisibility()` is the modern "is this actually rendered?" API
    // (Chromium 105+, Firefox 125+, Safari 17.4+). It correctly handles
    // `display: none` on the element OR any ancestor — exactly what we need
    // for collapsed submenu items. When it's missing (older browsers,
    // jsdom under unit tests) we fall through to treating the element as
    // visible so test environments without layout don't filter everything.
    const cv = (el as HTMLElement & { checkVisibility?: () => boolean }).checkVisibility;
    if (typeof cv === 'function') {
        return cv.call(el);
    }
    return true;
}
