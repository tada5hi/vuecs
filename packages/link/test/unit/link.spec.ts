import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { VCLink } from '../../src';

// Runtime coverage for the `query` prop (#1705).
//
// `query` is a load-bearing contract for consumers that thread a parameter
// onto a link (a `?ref=` back-link, a preserved filter). It had no in-repo
// test, which is how it managed to be absent from the exported type for two
// minor releases without anything noticing. These specs pin the rendered
// output so a rename or a refactor of `extendLinkWithQuery` fails loudly.
//
// No router is installed here, so `resolveDynamicComponent('RouterLink')`
// returns the string tag and `<VCLink>` renders a plain `<a>` — the path a
// standalone / router-free consumer takes.

describe('VCLink', () => {
    it('renders a plain anchor with the href', () => {
        const wrapper = mount(VCLink, { props: { href: 'https://example.com/' } });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('https://example.com/');
    });

    it('appends query params to an href', () => {
        const wrapper = mount(VCLink, {
            props: {
                href: 'https://example.com/',
                query: { ref: '/account' },
            },
        });

        expect(wrapper.attributes('href')).toBe('https://example.com/?ref=%2Faccount');
    });

    it('merges query params into an href that already carries a search string', () => {
        const wrapper = mount(VCLink, {
            props: {
                href: 'https://example.com/?keep=1',
                query: { ref: 'x' },
            },
        });

        const href = wrapper.attributes('href') as string;
        const { searchParams } = new URL(href);
        expect(searchParams.get('keep')).toBe('1');
        expect(searchParams.get('ref')).toBe('x');
    });

    it('leaves the href untouched when no query is passed', () => {
        const wrapper = mount(VCLink, { props: { href: 'https://example.com/path' } });

        expect(wrapper.attributes('href')).toBe('https://example.com/path');
    });

    it('reacts to a query change', async () => {
        const wrapper = mount(VCLink, {
            props: {
                href: 'https://example.com/',
                query: { ref: 'a' },
            },
        });

        expect(wrapper.attributes('href')).toBe('https://example.com/?ref=a');

        await wrapper.setProps({ query: { ref: 'b' } });

        expect(wrapper.attributes('href')).toBe('https://example.com/?ref=b');
    });

    it('applies active / disabled state to the rendered anchor', () => {
        const wrapper = mount(VCLink, {
            props: {
                href: '/x', 
                active: true, 
                disabled: true, 
            }, 
        });

        expect(wrapper.classes()).toContain('active');
        expect(wrapper.classes()).toContain('disabled');
        expect(wrapper.attributes('data-active')).toBe('');
        expect(wrapper.attributes('data-disabled')).toBe('');
    });

    it('suppresses the click emit while disabled', async () => {
        const wrapper = mount(VCLink, { props: { href: '/x', disabled: true } });

        await wrapper.trigger('click');

        expect(wrapper.emitted('clicked')).toBeUndefined();
    });

    it('emits clicked when enabled', async () => {
        // No `href` — `computedHref` resolves to the `'#'` sentinel, so the
        // component suppresses the default action and jsdom doesn't log a
        // "Not implemented: navigation" warning. The emit path is identical.
        const wrapper = mount(VCLink);

        await wrapper.trigger('click');

        expect(wrapper.emitted('clicked')).toHaveLength(1);
    });

    it('renders no href attribute when neither href nor to is set', () => {
        // `computedHref`'s `'#'` is a click-suppression sentinel, not a
        // destination — it must not leak into the DOM.
        const wrapper = mount(VCLink);

        expect(wrapper.attributes('href')).toBeUndefined();
    });
});
