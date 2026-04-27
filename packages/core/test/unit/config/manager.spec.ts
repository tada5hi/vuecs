import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { ConfigManager } from '../../../src';

describe('ConfigManager', () => {
    it('falls back to framework defaults', () => {
        const m = new ConfigManager();
        expect(m.get('dir')).toBe('ltr');
        expect(m.get('locale')).toBe('en-US');
        expect(m.get('nonce')).toBeUndefined();
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
});
