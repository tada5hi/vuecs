// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
} from 'vitest';
import { computed, defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import { useSubmitButton } from '../../src/composables/use-submit-button';

const themePlugin = {
    install: (app: any) => {
        installThemeManager(app);
        installDefaultsManager(app);
    },
};

const Host = defineComponent({
    props: { isEditing: { type: Boolean, default: false } },
    setup(props) {
        return { bindings: useSubmitButton({ isEditing: () => props.isEditing }) };
    },
    template: '<div>{{ bindings.label }}|{{ bindings.color }}|{{ bindings.iconLeft || "_" }}</div>',
});

describe('useSubmitButton', () => {
    it('returns create-mode bindings by default', () => {
        const wrapper = mount(Host, { global: { plugins: [themePlugin] } });
        expect(wrapper.text()).toBe('Create|success|_');
    });

    it('returns update-mode bindings when isEditing is true', () => {
        const wrapper = mount(Host, {
            props: { isEditing: true },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toBe('Update|primary|_');
    });

    it('reacts to isEditing changes', async () => {
        const wrapper = mount(Host, { global: { plugins: [themePlugin] } });
        await wrapper.setProps({ isEditing: true });
        expect(wrapper.text()).toBe('Update|primary|_');
    });

    it('falls through to global defaults when registered', () => {
        const PluginWithDefaults = {
            install: (app: any) => {
                installThemeManager(app);
                installDefaultsManager(app, {
                    defaults: {
                        submitButton: {
                            createText: 'Save',
                            createIcon: 'fa fa-plus',
                            createColor: 'info',
                        },
                    },
                });
            },
        };
        const wrapper = mount(Host, { global: { plugins: [PluginWithDefaults] } });
        expect(wrapper.text()).toBe('Save|info|fa fa-plus');
    });

    it('unwraps reactive defaults (i18n use case)', async () => {
        const label = ref('Erstellen');
        const PluginWithReactive = {
            install: (app: any) => {
                installThemeManager(app);
                installDefaultsManager(app, { defaults: { submitButton: { createText: computed(() => label.value) } } });
            },
        };
        const wrapper = mount(Host, { global: { plugins: [PluginWithReactive] } });
        expect(wrapper.text()).toContain('Erstellen');
        label.value = 'Anlegen';
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Anlegen');
    });
});
