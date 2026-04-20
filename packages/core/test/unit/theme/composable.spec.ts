// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { 
    defineComponent, 
    h, 
    nextTick, 
    ref, 
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
                    useComponentTheme('test', undefined, { root: '' });
                    return () => h('div');
                },
            }));
        }).toThrow('ThemeManager is not installed');
    });

    it('should resolve defaults when manager has no config', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', undefined, {
                root: 'vc-btn',
                icon: 'vc-btn-icon',
            });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved).toEqual({ root: 'vc-btn', icon: 'vc-btn-icon' });
    });

    it('should apply presets from manager', () => {
        const preset: Theme = { elements: { button: { root: 'btn btn-primary' } } };
        let resolved: Record<string, string> | undefined;

        mountWithTheme({ themes: [preset] }, () => {
            const theme = useComponentTheme('button', undefined, {
                root: 'vc-btn',
                icon: 'vc-btn-icon',
            });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn btn btn-primary');
        expect(resolved!.icon).toBe('vc-btn-icon');
    });

    it('should apply user theme from manager', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({ overrides: { elements: { button: { root: 'user-class' } } } }, () => {
            const theme = useComponentTheme('button', undefined, { root: 'vc-btn' });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('user-class');
    });

    it('should apply instance theme override', () => {
        let resolved: Record<string, string> | undefined;
        const instanceTheme = ref({ root: 'instance-class' });

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', instanceTheme, { root: 'vc-btn' });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('instance-class');
    });

    it('should extend defaults with extend()', () => {
        let resolved: Record<string, string> | undefined;
        const instanceTheme = ref({ root: extend('extra') });

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', instanceTheme, { root: 'vc-btn' });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn extra');
    });

    it('should recompute when instanceTheme ref changes', async () => {
        const instanceTheme = ref<Record<string, any> | undefined>(undefined);
        let themeRef: any;

        mountWithTheme({}, () => {
            themeRef = useComponentTheme('button', instanceTheme as any, { root: 'vc-btn' });
            return () => h('div', { class: themeRef.value.root });
        });

        expect(themeRef.value.root).toBe('vc-btn');

        instanceTheme.value = { root: 'changed' };
        await nextTick();

        expect(themeRef.value.root).toBe('changed');
    });

    it('should handle undefined instanceTheme gracefully', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', undefined, { root: 'vc-btn' });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('vc-btn');
    });

    it('should accept plain object as instanceTheme (MaybeRef)', () => {
        let resolved: Record<string, string> | undefined;

        mountWithTheme({}, () => {
            const theme = useComponentTheme('button', { root: 'plain-class' }, { root: 'vc-btn' });
            resolved = theme.value;
            return () => h('div');
        });

        expect(resolved!.root).toBe('plain-class');
    });

    it('should recompute when manager themes change via setThemes', async () => {
        let themeRef: any;
        let manager: ReturnType<typeof installThemeManager>;

        mount(defineComponent({
            setup() {
                themeRef = useComponentTheme('button', undefined, { root: 'vc-btn' });
                return () => h('div', { class: themeRef.value.root });
            },
        }), { global: { plugins: [[{ install: (app: any) => { manager = installThemeManager(app); } }]] } });

        expect(themeRef.value.root).toBe('vc-btn');

        manager!.setThemes([{ elements: { button: { root: 'btn-dark' } } }]);
        await nextTick();

        expect(themeRef.value.root).toBe('vc-btn btn-dark');
    });

    it('should recompute when manager overrides change via setOverrides', async () => {
        let themeRef: any;
        let manager: ReturnType<typeof installThemeManager>;

        mount(defineComponent({
            setup() {
                themeRef = useComponentTheme('button', undefined, { root: 'vc-btn' });
                return () => h('div', { class: themeRef.value.root });
            },
        }), { global: { plugins: [[{ install: (app: any) => { manager = installThemeManager(app); } }]] } });

        expect(themeRef.value.root).toBe('vc-btn');

        manager!.setOverrides({ elements: { button: { root: 'override-class' } } });
        await nextTick();

        expect(themeRef.value.root).toBe('override-class');
    });
});
