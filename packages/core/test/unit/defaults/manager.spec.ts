import { describe, expect, it } from 'vitest';
import { computed, effect, ref } from 'vue';
import { DefaultsManager } from '../../../src/defaults/manager';
import type { ComponentDefaultValues } from '../../../src/defaults/types';

// Test-local augmentation so we exercise the `keyof ComponentDefaults`
// generic constraint without casting.
type TestSubmitDefaults = {
    createText: string;
    updateText: string;
};

declare module '../../../src/defaults/types' {
    interface ComponentDefaults {
        __testSubmit?: ComponentDefaultValues<TestSubmitDefaults>;
    }
}

describe('DefaultsManager', () => {
    it('should return undefined when no defaults registered', () => {
        const manager = new DefaultsManager();
        expect(manager.get('__testSubmit')).toBeUndefined();
    });

    it('should return defaults registered via constructor', () => {
        const manager = new DefaultsManager({ defaults: { __testSubmit: { createText: 'Create', updateText: 'Update' } } });
        expect(manager.get('__testSubmit')).toEqual({ createText: 'Create', updateText: 'Update' });
    });

    it('should store MaybeRef values as-is (unwrapping is done by the composable)', () => {
        const createText = ref('Create');
        const updateText = computed(() => 'Update');

        const manager = new DefaultsManager({ defaults: { __testSubmit: { createText, updateText } } });

        const entry = manager.get('__testSubmit');
        expect(entry?.createText).toBe(createText);
        expect(entry?.updateText).toBe(updateText);
    });

    it('should expose defaults via getter', () => {
        const defaults = { __testSubmit: { createText: 'X' } };
        const manager = new DefaultsManager({ defaults });
        expect(manager.defaults).toBe(defaults);
    });

    it('should update defaults via setDefaults()', () => {
        const manager = new DefaultsManager();
        expect(manager.get('__testSubmit')).toBeUndefined();

        manager.setDefaults({ __testSubmit: { createText: 'Erstellen' } });
        expect(manager.get('__testSubmit')).toEqual({ createText: 'Erstellen' });
    });

    it('should clear defaults when set to undefined', () => {
        const manager = new DefaultsManager({ defaults: { __testSubmit: { createText: 'Create' } } });
        expect(manager.get('__testSubmit')).toBeDefined();

        manager.setDefaults(undefined);
        expect(manager.get('__testSubmit')).toBeUndefined();
    });

    it('should trigger reactive effects when setDefaults is called with the same reference', () => {
        const defaults = { __testSubmit: { createText: 'Create' } };
        const manager = new DefaultsManager({ defaults });

        let runs = 0;
        effect(() => {
            // Track the ref's value each run.
            void manager.defaults;
            runs += 1;
        });

        expect(runs).toBe(1);

        // Re-setting the same reference is a no-op for a plain `.value =`
        // assignment; the manager must call `triggerRef` so effects still
        // re-run (enabling in-place mutation + re-set flows).
        manager.setDefaults(defaults);
        expect(runs).toBe(2);
    });
});
