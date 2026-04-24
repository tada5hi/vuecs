// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    reactive,
} from 'vue';
import { mount } from '@vue/test-utils';
import { useComponentTheme } from '../../../src/theme/composable';
import { installThemeManager } from '../../../src/theme/install';
import { extend } from '../../../src/theme/extend';
import type { Theme } from '../../../src/theme/types';

function mountWithTheme(
    options: Parameters<typeof installThemeManager>[1],
    setupFn: () => (() => any),
) {
    return mount(defineComponent({
        setup() {
            return setupFn();
        },
    }), { global: { plugins: [[{ install: (app: any) => installThemeManager(app, options) }]] } });
}

describe('useComponentTheme', () => {
    it('should throw if no ThemeManager is installed', () => {
        expect(() => {
            mount(defineComponent({
                setup() {
                    useComponentTheme('test', {}, { classes: { root: '' } });
                    return () => h('div');
                },
            }));
        }).toThrow('ThemeManager is not installed');
    });

    it('should resolve defaults when manager has no config', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', {}, { classes: { root: 'vc-btn', icon: 'vc-btn-icon' } });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved).toEqual({ root: 'vc-btn', icon: 'vc-btn-icon' });
    });

    it('should apply presets from manager', () => {
        const preset: Theme = { elements: { button: { classes: { root: 'btn btn-primary' } } } };
        let resolved: Record<string, string> | undefined;

        mountWithTheme({ themes: [preset] }, () => {
            const theme = useComponentTheme('button', {}, { classes: { root: 'vc-btn', icon: 'vc-btn-icon' } });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn btn btn-primary');
        expect(resolved!.icon).toBe('vc-btn-icon');
    });

    it('should apply user theme from manager', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({ overrides: { elements: { button: { classes: { root: 'user-class' } } } } }, () => {
            const theme = useComponentTheme('button', {}, { classes: { root: 'vc-btn' } });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('user-class');
    });

    it('should apply instance theme override via props.themeClass', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme(
                'button',
                { themeClass: { root: 'instance-class' } },
                { classes: { root: 'vc-btn' } },
            );
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('instance-class');
    });

    it('should extend defaults with extend() passed via props.themeClass', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme(
                'button',
                { themeClass: { root: extend('extra') } },
                { classes: { root: 'vc-btn' } },
            );
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn extra');
    });

    it('should recompute when reactive props.themeClass changes', async () => {
        const props = reactive<{ themeClass?: Record<string, any> }>({ themeClass: undefined });
        let themeRef: any;

        mountWithTheme({}, () => {
            themeRef = useComponentTheme('button', props, { classes: { root: 'vc-btn' } });
            return () => h('div', { class: themeRef.value.root });
        });

        expect(themeRef.value.root).toBe('vc-btn');

        props.themeClass = { root: 'changed' };
        await nextTick();

        expect(themeRef.value.root).toBe('changed');
    });

    it('should handle empty props gracefully', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', {}, { classes: { root: 'vc-btn' } });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn');
    });

    it('should recompute when manager themes change via setThemes', async () => {
        let themeRef: any;
        let manager: ReturnType<typeof installThemeManager>;

        const wrapper = mount(defineComponent({
            setup() {
                themeRef = useComponentTheme('button', {}, { classes: { root: 'vc-btn' } });
                return () => h('div', { class: themeRef.value.root });
            },
        }), { global: { plugins: [[{ install: (app: any) => { manager = installThemeManager(app); } }]] } });

        expect(themeRef.value.root).toBe('vc-btn');

        manager!.setThemes([{ elements: { button: { classes: { root: 'btn-dark' } } } }]);
        await nextTick();

        expect(themeRef.value.root).toBe('vc-btn btn-dark');
        expect(wrapper.classes()).toEqual(expect.arrayContaining(['vc-btn', 'btn-dark']));
    });

    it('should recompute when manager overrides change via setOverrides', async () => {
        let themeRef: any;
        let manager: ReturnType<typeof installThemeManager>;

        const wrapper = mount(defineComponent({
            setup() {
                themeRef = useComponentTheme('button', {}, { classes: { root: 'vc-btn' } });
                return () => h('div', { class: themeRef.value.root });
            },
        }), { global: { plugins: [[{ install: (app: any) => { manager = installThemeManager(app); } }]] } });

        expect(themeRef.value.root).toBe('vc-btn');

        manager!.setOverrides({ elements: { button: { classes: { root: 'override-class' } } } });
        await nextTick();

        expect(themeRef.value.root).toBe('override-class');
        expect(wrapper.classes()).toContain('override-class');
    });

    it('should recompute when same reference is mutated and re-set via setThemes', async () => {
        let themeRef: any;
        let manager: ReturnType<typeof installThemeManager>;

        const wrapper = mount(defineComponent({
            setup() {
                themeRef = useComponentTheme('button', {}, { classes: { root: 'vc-btn' } });
                return () => h('div', { class: themeRef.value.root });
            },
        }), {
            global: {
                plugins: [[{
                    install: (app: any) => {
                        manager = installThemeManager(app, { themes: [{ elements: { button: { classes: { root: 'btn-light' } } } }] });
                    },
                }]],
            },
        });

        expect(themeRef.value.root).toBe('vc-btn btn-light');

        const { themes } = (manager!);
        themes[0] = { elements: { button: { classes: { root: 'btn-dark' } } } };
        manager!.setThemes(themes);
        await nextTick();

        expect(themeRef.value.root).toBe('vc-btn btn-dark');
        expect(wrapper.classes()).toEqual(expect.arrayContaining(['vc-btn', 'btn-dark']));
    });

    it('should apply variant values via props.themeVariant', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme(
                'button',
                { themeVariant: { size: 'lg' } },
                {
                    classes: { root: 'vc-btn' },
                    variants: {
                        size: {
                            sm: { root: 'btn-sm' },
                            lg: { root: 'btn-lg' },
                        },
                    },
                },
            );
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn btn-lg');
    });

    it('should recompute when reactive props.themeVariant changes', async () => {
        const props = reactive<{ themeVariant?: Record<string, any> }>({ themeVariant: { size: 'sm' } });
        let themeRef: any;

        mountWithTheme({}, () => {
            themeRef = useComponentTheme(
                'button',
                props,
                {
                    classes: { root: 'vc-btn' },
                    variants: {
                        size: {
                            sm: { root: 'btn-sm' },
                            lg: { root: 'btn-lg' },
                        },
                    },
                },
            );
            return () => h('div', { class: themeRef.value.root });
        });

        expect(themeRef.value.root).toBe('vc-btn btn-sm');

        props.themeVariant = { size: 'lg' };
        await nextTick();

        expect(themeRef.value.root).toBe('vc-btn btn-lg');
    });
});
