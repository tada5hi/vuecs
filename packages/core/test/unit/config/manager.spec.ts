import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { ConfigManager } from '../../../src';

// Test-local augmentation so we can exercise child-package keys
// (`scrollLockTarget` lives in `@vuecs/overlays` in production) without
// reaching for `as any`. Same pattern as defaults/composable.spec.ts.
declare module '../../../src/config/types' {
    interface Config {
        scrollLockTarget?: string | HTMLElement;
    }
}

describe('ConfigManager', () => {
    it('falls back to core framework defaults', () => {
        const m = new ConfigManager();
        expect(m.get('dir')).toBe('ltr');
        expect(m.get('locale')).toBe('en-US');
    });

    it('returns configured values', () => {
        const m = new ConfigManager({ config: { dir: 'rtl', locale: 'ar-EG' } });
        expect(m.get('dir')).toBe('rtl');
        expect(m.get('locale')).toBe('ar-EG');
    });

    it('unwraps reactive (ref) values', () => {
        const dir = ref<'ltr' | 'rtl'>('ltr');
        const m = new ConfigManager({ config: { dir } });

        expect(m.get('dir')).toBe('ltr');
        dir.value = 'rtl';
        expect(m.get('dir')).toBe('rtl');
    });

    it('does NOT unwrap non-ref objects with a value property', () => {
        // Regression: previously the heuristic `'value' in raw` accidentally
        // unwrapped any object with a `value` field (e.g. HTMLInputElement,
        // form fields). Now uses Vue's isRef.
        const fakeNonRef = { value: 'should-not-be-unwrapped' };
        // @ts-expect-error — deliberately feeding a non-ref object with a
        // `value` property to prove the unwrap heuristic doesn't fire on it.
        const m = new ConfigManager({ config: { locale: fakeNonRef } });
        expect(m.get('locale')).toBe(fakeNonRef);
    });

    it('falls back to defaults when a key is explicitly undefined', () => {
        const m = new ConfigManager({ config: { dir: undefined } });
        expect(m.get('dir')).toBe('ltr');
    });

    it('setConfig replaces the config object', () => {
        const m = new ConfigManager({ config: { dir: 'rtl' } });
        expect(m.get('dir')).toBe('rtl');

        m.setConfig({ locale: 'de-DE' });
        expect(m.get('dir')).toBe('ltr');
        expect(m.get('locale')).toBe('de-DE');
    });

    it('setConfig accepts undefined to clear', () => {
        const m = new ConfigManager({ config: { dir: 'rtl' } });
        m.setConfig(undefined);
        expect(m.get('dir')).toBe('ltr');
    });

    describe('withDefaults', () => {
        it('registers per-key defaults for augmented keys', () => {
            const m = new ConfigManager();
            m.withDefaults({ scrollLockTarget: 'body' });
            expect(m.get('scrollLockTarget')).toBe('body');
        });

        it('does not overwrite consumer-supplied config', () => {
            const m = new ConfigManager({ config: { scrollLockTarget: '#app' } });
            m.withDefaults({ scrollLockTarget: 'body' });
            expect(m.get('scrollLockTarget')).toBe('#app');
        });

        it('overrides core defaults when re-registered', () => {
            const m = new ConfigManager();
            m.withDefaults({ dir: 'rtl' });
            expect(m.get('dir')).toBe('rtl');
        });

        it('child manager inherits parent defaults via constructor option', () => {
            const parent = new ConfigManager();
            parent.withDefaults({ scrollLockTarget: 'body' });

            const child = new ConfigManager({ defaults: parent.defaults });
            expect(child.get('scrollLockTarget')).toBe('body');
        });

        it('child manager withDefaults does NOT propagate to parent', () => {
            const parent = new ConfigManager();
            const child = new ConfigManager({ defaults: parent.defaults });
            child.withDefaults({ scrollLockTarget: 'body' });

            expect(child.get('scrollLockTarget')).toBe('body');
            expect(parent.get('scrollLockTarget')).toBeUndefined();
        });

        it('parent defaults registered AFTER child mount do NOT propagate (snapshot semantics)', () => {
            const parent = new ConfigManager();
            const child = new ConfigManager({ defaults: parent.defaults });
            // After child captured the snapshot:
            parent.withDefaults({ scrollLockTarget: 'body' });
            expect(child.get('scrollLockTarget')).toBeUndefined();
        });

        it('exposes a defaults snapshot that does not allow external mutation', () => {
            const m = new ConfigManager();
            const snapshot = m.defaults;
            snapshot.dir = 'rtl';
            // Mutating the snapshot must not affect the manager.
            expect(m.get('dir')).toBe('ltr');
        });
    });
});
