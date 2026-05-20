// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createCommentVNode, defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { VCPrimitive } from '../../../src';

describe('VCPrimitive', () => {
    it('renders the default tag (div)', () => {
        const wrapper = mount(VCPrimitive, { slots: { default: () => 'hello' } });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.text()).toBe('hello');
    });

    it('renders the named tag passed via `as`', () => {
        const wrapper = mount(VCPrimitive, {
            props: { as: 'section' },
            slots: { default: () => 'hello' },
        });

        expect(wrapper.element.tagName).toBe('SECTION');
    });

    it('renders a Vue component passed via `as`', () => {
        const Inner = defineComponent({
            props: { label: { type: String, default: '' } },
            setup(props, { slots }) {
                return () => h('aside', { 'data-label': props.label }, slots.default?.());
            },
        });

        const wrapper = mount(VCPrimitive, {
            props: { as: Inner, label: 'hi' } as any,
            slots: { default: () => 'body' },
        });

        expect(wrapper.element.tagName).toBe('ASIDE');
        expect(wrapper.element.getAttribute('data-label')).toBe('hi');
        expect(wrapper.text()).toBe('body');
    });

    it('forwards attrs as props on the rendered element', () => {
        const wrapper = mount(VCPrimitive, {
            attrs: { class: 'foo', 'data-x': '1' },
            slots: { default: () => 'x' },
        });

        expect(wrapper.element.className).toBe('foo');
        expect(wrapper.element.getAttribute('data-x')).toBe('1');
    });

    it('short-circuits self-closing tags (`input`) without a default slot', () => {
        const wrapper = mount(VCPrimitive, {
            props: { as: 'input' },
            attrs: { type: 'text', value: 'abc' },
        });

        expect(wrapper.element.tagName).toBe('INPUT');
        expect((wrapper.element as HTMLInputElement).value).toBe('abc');
    });

    it('short-circuits self-closing tag `img`', () => {
        const wrapper = mount(VCPrimitive, {
            props: { as: 'img' },
            attrs: { src: '/x.png', alt: '' },
        });

        expect(wrapper.element.tagName).toBe('IMG');
        expect(wrapper.element.getAttribute('src')).toBe('/x.png');
    });

    it('renders slot child via asChild (template merge)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(
                    VCPrimitive,
                    {
                        asChild: true, 
                        class: 'wrapper-cls', 
                        'data-w': 'w', 
                    },
                    { default: () => h('a', { href: '/x', class: 'child-cls' }, 'link') },
                );
            },
        }));

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.element.getAttribute('href')).toBe('/x');
        // Both classes appear; child class wins precedence on conflict.
        expect(wrapper.element.className).toContain('wrapper-cls');
        expect(wrapper.element.className).toContain('child-cls');
        expect(wrapper.element.getAttribute('data-w')).toBe('w');
        expect(wrapper.text()).toBe('link');
    });

    it('skips comment children under asChild', () => {
        // Wrap in a host `<div>` so we can locate the cloned child via DOM
        // query; @vue/test-utils' wrapper.element collapses multi-root
        // setups into an arbitrary first node which makes direct lookups
        // unreliable here.
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(
                    'div',
                    { 'data-host': '1' },
                    [
                        h(
                            VCPrimitive,
                            { asChild: true, 'data-w': 'w' },
                            {
                                default: () => [
                                    createCommentVNode('ignored'),
                                    h('span', { class: 'real' }, 'x'),
                                ],
                            },
                        ),
                    ],
                );
            },
        }));

        const span = wrapper.element.querySelector('span.real');
        expect(span).not.toBeNull();
        expect(span?.getAttribute('data-w')).toBe('w');
    });

    it('passes attrs to the first non-comment child when multiple children are present', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(
                    'div',
                    { 'data-host': '1' },
                    [
                        h(
                            VCPrimitive,
                            { asChild: true, 'data-x': '1' },
                            {
                                default: () => [
                                    h('a', { href: '/a', class: 'first' }, 'a'),
                                    h('span', { class: 'second' }, 'b'),
                                ],
                            },
                        ),
                    ],
                );
            },
        }));

        const first = wrapper.element.querySelector('a.first');
        const second = wrapper.element.querySelector('span.second');
        expect(first?.getAttribute('data-x')).toBe('1');
        // Only the first non-comment child carries the merged attrs.
        expect(second?.getAttribute('data-x')).toBeNull();
    });
});
