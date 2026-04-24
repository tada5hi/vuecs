import { describe, expect, it } from 'vitest';
import { computed, ref } from 'vue';
import { DefaultsManager } from '../../../src/defaults/manager';

describe('DefaultsManager', () => {
    it('should return undefined when no defaults registered', () => {
        const manager = new DefaultsManager();
        expect(manager.get('formSubmit' as any)).toBeUndefined();
    });

    it('should return defaults registered via constructor', () => {
        const manager = new DefaultsManager({ defaults: { formSubmit: { createText: 'Create', updateText: 'Update' } } as any });
        expect(manager.get('formSubmit' as any)).toEqual({ createText: 'Create', updateText: 'Update' });
    });

    it('should store MaybeRef values as-is (unwrapping is done by the composable)', () => {
        const createText = ref('Create');
        const updateText = computed(() => 'Update');

        const manager = new DefaultsManager({ defaults: { formSubmit: { createText, updateText } } as any });

        const entry = manager.get('formSubmit' as any) as any;
        expect(entry.createText).toBe(createText);
        expect(entry.updateText).toBe(updateText);
    });

    it('should expose defaults via getter', () => {
        const defaults = { formSubmit: { createText: 'X' } } as any;
        const manager = new DefaultsManager({ defaults });
        expect(manager.defaults).toBe(defaults);
    });

    it('should update defaults via setDefaults()', () => {
        const manager = new DefaultsManager();
        expect(manager.get('formSubmit' as any)).toBeUndefined();

        manager.setDefaults({ formSubmit: { createText: 'Erstellen' } } as any);
        expect(manager.get('formSubmit' as any)).toEqual({ createText: 'Erstellen' });
    });

    it('should clear defaults when set to undefined', () => {
        const manager = new DefaultsManager({ defaults: { formSubmit: { createText: 'Create' } } as any });
        expect(manager.get('formSubmit' as any)).toBeDefined();

        manager.setDefaults(undefined);
        expect(manager.get('formSubmit' as any)).toBeUndefined();
    });
});
