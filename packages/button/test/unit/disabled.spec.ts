// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import vuecsButton, { VCButton } from '../../src';

const plugins = [[vuecsButton, {}]] as const;
const mountButton = (options: Record<string, any> = {}) => mount(VCButton, {
    ...options,
    global: { plugins: [...plugins], ...(options.global ?? {}) },
});

/**
 * Stand-in for `RouterLink` / `NuxtLink` / `VCLink`: a component target that
 * performs its own navigation from a plain (bubble-phase) click handler.
 *
 * It deliberately does NOT check `event.defaultPrevented` — vue-router's
 * `guardEvent` does, but NuxtLink's external-href path and arbitrary
 * consumer components don't. Asserting this stub never fires proves the
 * guard actually stops the event rather than merely flagging it.
 */
const navigations: string[] = [];
const LinkStub = defineComponent({
    name: 'LinkStub',
    props: { to: { type: String, default: '' } },
    setup(props, { slots }) {
        return () => h(
            'a',
            { href: props.to, onClick: () => { navigations.push(props.to); } },
            slots.default?.(),
        );
    },
});

describe('<VCButton> disabled — native button', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('uses the native disabled attribute, not the aria/tabindex fallback', () => {
        const el = mountButton({ props: { disabled: true } }).element as HTMLElement;

        expect(el.tagName).toBe('BUTTON');
        expect((el as HTMLButtonElement).disabled).toBe(true);
        // The non-native treatment must not leak onto a real <button>:
        // `aria-disabled` alongside native `disabled` is redundant, and
        // tabindex="-1" would be fighting the browser.
        expect(el.hasAttribute('aria-disabled')).toBe(false);
        expect(el.hasAttribute('tabindex')).toBe(false);
    });

    it('is not marked disabled when enabled', () => {
        const el = mountButton().element as HTMLElement;
        expect((el as HTMLButtonElement).disabled).toBe(false);
        expect(el.hasAttribute('aria-disabled')).toBe(false);
    });
});

describe('<VCButton> disabled — non-native render targets (#1699)', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        navigations.length = 0;
    });

    it('announces and de-tabs a disabled anchor', () => {
        const el = mountButton({
            props: { as: 'a', disabled: true },
            attrs: { href: '/users/1' },
        }).element as HTMLElement;

        expect(el.tagName).toBe('A');
        expect(el.getAttribute('aria-disabled')).toBe('true');
        expect(el.getAttribute('tabindex')).toBe('-1');
    });

    it('blocks activation of a disabled anchor', () => {
        const el = mountButton({
            props: { as: 'a', disabled: true },
            attrs: { href: '/users/1' },
        }).element as HTMLElement;

        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        el.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    it('stops the consumer click handler from firing while disabled', () => {
        const clicks: string[] = [];
        const el = mountButton({
            props: { as: 'a', disabled: true },
            attrs: { href: '/x', onClick: () => { clicks.push('consumer'); } },
        }).element as HTMLElement;

        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(clicks).toEqual([]);
    });

    it("stops a component target's own navigation handler (RouterLink case)", () => {
        // The regression this fixes: fallthrough attrs are merged AFTER a
        // component's own props, so a bubble-phase guard would be registered
        // second and run after the target had already navigated. The guard is
        // capture-phase precisely so it wins that race.
        const wrapper = mountButton({
            props: { as: LinkStub, disabled: true },
            attrs: { to: '/users/1' },
        });
        const el = wrapper.element as HTMLElement;

        expect(el.tagName).toBe('A');
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(navigations).toEqual([]);
    });

    it('lets a component target navigate when enabled', () => {
        const wrapper = mountButton({
            props: { as: LinkStub },
            attrs: { to: '/users/1' },
        });

        (wrapper.element as HTMLElement)
            .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(navigations).toEqual(['/users/1']);
    });

    it('leaves an enabled anchor untouched', () => {
        const el = mountButton({
            props: { as: 'a' },
            attrs: { href: '/users/1' },
        }).element as HTMLElement;

        expect(el.hasAttribute('aria-disabled')).toBe(false);
        expect(el.hasAttribute('tabindex')).toBe(false);

        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        el.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
    });

    it('guards while loading too (loading implies disabled)', () => {
        const el = mountButton({
            props: { as: 'a', loading: true },
            attrs: { href: '/users/1' },
        }).element as HTMLElement;

        expect(el.getAttribute('aria-disabled')).toBe('true');
        expect(el.getAttribute('aria-busy')).toBe('true');

        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        el.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    it('drops the guard reactively when disabled flips to false', async () => {
        const wrapper = mountButton({
            props: { as: 'a', disabled: true },
            attrs: { href: '/users/1' },
        });

        await wrapper.setProps({ disabled: false });

        const el = wrapper.element as HTMLElement;
        expect(el.hasAttribute('aria-disabled')).toBe(false);
        expect(el.hasAttribute('tabindex')).toBe(false);

        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        el.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
    });

    it('applies to the deprecated `tag` alias as well', () => {
        const el = mountButton({
            props: { tag: 'a', disabled: true },
            attrs: { href: '/users/1' },
        }).element as HTMLElement;

        expect(el.tagName).toBe('A');
        expect(el.getAttribute('aria-disabled')).toBe('true');
    });
});
