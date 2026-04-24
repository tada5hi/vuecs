// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    computed,
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import { useComponentDefaults } from '../../../src/defaults/composable';
import { installDefaultsManager } from '../../../src/defaults/install';
import type { ComponentDefaultValues, DefaultsManagerOptions } from '../../../src/defaults/types';

// Test-local augmentation so we can exercise the `keyof ComponentDefaults`
// generic constraint without casting. Component packages (form-controls,
// list-controls) register their own entries via the same pattern.
type TestSubmitDefaults = {
    createText: string;
    updateText: string;
    icon: boolean;
};

declare module '../../../src/defaults/types' {
    interface ComponentDefaults {
        __testSubmit?: ComponentDefaultValues<TestSubmitDefaults>;
    }
}

function mountWithDefaults(
    options: DefaultsManagerOptions,
    setupFn: () => (() => any),
) {
    return mount(defineComponent({
        setup() {
            return setupFn();
        },
    }), { global: { plugins: [[{ install: (app: any) => installDefaultsManager(app, options) }]] } });
}

describe('useComponentDefaults', () => {
    it('should throw if no DefaultsManager is installed', () => {
        expect(() => {
            mount(defineComponent({
                setup() {
                    useComponentDefaults('__testSubmit', {}, { createText: 'Create' });
                    return () => h('div');
                },
            }));
        }).toThrow('DefaultsManager is not installed');
    });

    it('should fall back to hardcoded defaults when no global defaults and prop is undefined', () => {
        let resolved: Record<string, any> | undefined;

        mountWithDefaults({}, () => {
            const defaults = useComponentDefaults(
                '__testSubmit',
                { createText: undefined, updateText: undefined },
                { createText: 'Create', updateText: 'Update' },
            );
            resolved = defaults.value;
            return () => h('div');
        });

        expect(resolved).toEqual({ createText: 'Create', updateText: 'Update' });
    });

    it('should prefer instance prop over global and hardcoded defaults', () => {
        let resolved: Record<string, any> | undefined;

        mountWithDefaults(
            { defaults: { __testSubmit: { createText: 'Global' } } },
            () => {
                const defaults = useComponentDefaults(
                    '__testSubmit',
                    { createText: 'Instance' },
                    { createText: 'Hardcoded' },
                );
                resolved = defaults.value;
                return () => h('div');
            },
        );

        expect(resolved?.createText).toBe('Instance');
    });

    it('should use global defaults when prop is undefined', () => {
        let resolved: Record<string, any> | undefined;

        mountWithDefaults(
            { defaults: { __testSubmit: { createText: 'Erstellen' } } },
            () => {
                const defaults = useComponentDefaults(
                    '__testSubmit',
                    { createText: undefined },
                    { createText: 'Create' },
                );
                resolved = defaults.value;
                return () => h('div');
            },
        );

        expect(resolved?.createText).toBe('Erstellen');
    });

    it('should unwrap refs in global defaults', () => {
        let resolved: Record<string, any> | undefined;
        const createText = ref('Anlegen');

        mountWithDefaults(
            { defaults: { __testSubmit: { createText } } },
            () => {
                const defaults = useComponentDefaults(
                    '__testSubmit',
                    { createText: undefined },
                    { createText: 'Create' },
                );
                resolved = defaults.value;
                return () => h('div');
            },
        );

        expect(resolved?.createText).toBe('Anlegen');
    });

    it('should unwrap computed in global defaults and stay reactive', async () => {
        const locale = ref('de');
        const translations: Record<string, string> = { de: 'Erstellen', en: 'Create' };
        const createText = computed(() => translations[locale.value]);

        let resolved: Record<string, any> | undefined;

        mountWithDefaults(
            { defaults: { __testSubmit: { createText } } },
            () => {
                const defaults = useComponentDefaults(
                    '__testSubmit',
                    { createText: undefined },
                    { createText: 'Create' },
                );
                return () => {
                    resolved = defaults.value;
                    return h('div');
                };
            },
        );

        expect(resolved?.createText).toBe('Erstellen');

        locale.value = 'en';
        await nextTick();
        expect(resolved?.createText).toBe('Create');
    });

    it('should fall through undefined MaybeRef global values to hardcoded', () => {
        let resolved: Record<string, any> | undefined;

        mountWithDefaults(
            { defaults: { __testSubmit: { createText: ref(undefined) } } },
            () => {
                const defaults = useComponentDefaults(
                    '__testSubmit',
                    { createText: undefined },
                    { createText: 'Create' },
                );
                resolved = defaults.value;
                return () => h('div');
            },
        );

        expect(resolved?.createText).toBe('Create');
    });

    it('should resolve each key independently across the three layers', () => {
        let resolved: Record<string, any> | undefined;

        mountWithDefaults(
            {
                defaults: {
                    __testSubmit: {
                        createText: 'Global-Create',
                        updateText: 'Global-Update',
                    },
                },
            },
            () => {
                const defaults = useComponentDefaults(
                    '__testSubmit',
                    {
                        createText: 'Instance-Create', 
                        updateText: undefined, 
                        icon: undefined, 
                    },
                    {
                        createText: 'HC-Create', 
                        updateText: 'HC-Update', 
                        icon: true, 
                    },
                );
                resolved = defaults.value;
                return () => h('div');
            },
        );

        expect(resolved).toEqual({
            createText: 'Instance-Create',
            updateText: 'Global-Update',
            icon: true,
        });
    });
});
