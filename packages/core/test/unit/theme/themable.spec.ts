// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import type { PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { themableProps, useThemeProps } from '../../../src/theme/themable';
import { useComponentTheme } from '../../../src/theme/composable';
import { installThemeManager } from '../../../src/theme/install';

type CardThemeClasses = {
    root: string;
    body: string;
};

const cardDefaults = {
    classes: { root: 'vc-card', body: 'vc-card-body' },
    variants: {
        size: {
            sm: { root: 'vc-card-sm' },
            lg: { root: 'vc-card-lg' },
        },
        color: {
            primary: { root: 'vc-card-primary' },
            danger: { root: 'vc-card-danger' },
        },
    },
};

function withTheme(component: any, options: Parameters<typeof installThemeManager>[1] = {}) {
    return mount(component, { global: { plugins: [[{ install: (app: any) => installThemeManager(app, options) }]] } });
}

describe('themableProps', () => {
    it('returns the standard themeClass + themeVariant prop declarations', () => {
        const declarations = themableProps<CardThemeClasses>();
        expect(declarations.themeClass.type).toBe(Object);
        expect(declarations.themeClass.default).toBeUndefined();
        expect(declarations.themeVariant.type).toBe(Object);
        expect(declarations.themeVariant.default).toBeUndefined();
    });

    it('spreads cleanly into a defineComponent props block', () => {
        const Card = defineComponent({
            props: {
                size: { type: String as PropType<'sm' | 'lg'>, default: undefined },
                ...themableProps<CardThemeClasses>(),
            },
            setup(props) {
                const theme = useComponentTheme(
                    'card',
                    useThemeProps(props, 'size'),
                    cardDefaults,
                );
                return () => h('div', { class: theme.value.root });
            },
        });

        const wrapper = withTheme(Card);
        expect(wrapper.element.outerHTML).toContain('vc-card');
    });
});

describe('useThemeProps', () => {
    it('returns getter pair forwarding themeClass / themeVariant', () => {
        const props = {
            themeClass: { root: 'a' },
            themeVariant: { size: 'sm' },
        };
        const out = useThemeProps<CardThemeClasses>(props as any);
        expect(out.themeClass).toEqual({ root: 'a' });
        expect(out.themeVariant).toEqual({ size: 'sm' });
    });

    it('folds shorthand variant props into themeVariant', () => {
        const props = {
            color: 'primary',
            size: 'sm',
            themeVariant: undefined,
        } as any;
        const out = useThemeProps<CardThemeClasses>(props, 'color', 'size');
        expect(out.themeVariant).toEqual({ color: 'primary', size: 'sm' });
    });

    it('skips undefined shorthand props', () => {
        const props = {
            color: undefined,
            size: 'lg',
            themeVariant: undefined,
        } as any;
        const out = useThemeProps<CardThemeClasses>(props, 'color', 'size');
        expect(out.themeVariant).toEqual({ size: 'lg' });
    });

    it('shorthand props override themeVariant entries with the same key', () => {
        const props = {
            color: 'primary',
            themeVariant: { color: 'danger' },
        } as any;
        const out = useThemeProps<CardThemeClasses>(props, 'color');
        expect(out.themeVariant).toEqual({ color: 'primary' });
    });

    it('returns a fresh themeVariant object on each access', () => {
        const props = {
            color: 'primary',
            themeVariant: undefined,
        } as any;
        const out = useThemeProps<CardThemeClasses>(props, 'color');
        expect(out.themeVariant).not.toBe(out.themeVariant);
    });

    it('reactivity holds when used inside a real component setup', async () => {
        const Card = defineComponent({
            props: {
                size: { type: String as PropType<'sm' | 'lg'>, default: undefined },
                ...themableProps<CardThemeClasses>(),
            },
            setup(props) {
                const theme = useComponentTheme(
                    'card',
                    useThemeProps(props, 'size'),
                    cardDefaults,
                );
                return () => h('div', { class: theme.value.root });
            },
        });

        const wrapper = withTheme({
            components: { Card },
            data: () => ({ size: 'sm' as 'sm' | 'lg' }),
            template: '<Card :size="size" />',
        });

        expect(wrapper.element.outerHTML).toContain('vc-card-sm');
        await wrapper.setData({ size: 'lg' });
        await nextTick();
        expect(wrapper.element.outerHTML).toContain('vc-card-lg');
        expect(wrapper.element.outerHTML).not.toContain('vc-card-sm');
    });
});
