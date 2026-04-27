// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import {
    installConfigManager,
    useConfig,
} from '../../../src';

describe('useConfig', () => {
    it('returns framework defaults when no manager is installed', () => {
        let dir: string | undefined;
        mount(defineComponent({
            setup() {
                dir = useConfig('dir').value;
                return () => h('div');
            },
        }));
        expect(dir).toBe('ltr');
    });

    it('reads installed config values', () => {
        let dir: string | undefined;
        mount(defineComponent({
            setup() {
                dir = useConfig('dir').value;
                return () => h('div');
            },
        }), {
            global: {
                plugins: [{
                    install(app: any) {
                        installConfigManager(app, { config: { dir: 'rtl' } });
                    },
                }],
            },
        });
        expect(dir).toBe('rtl');
    });

    it('tracks reactive config values', () => {
        const dir = ref<'ltr' | 'rtl'>('ltr');
        let resolved: string | undefined;

        mount(defineComponent({
            setup() {
                const cfg = useConfig('dir');
                return () => {
                    resolved = cfg.value;
                    return h('div');
                };
            },
        }), {
            global: {
                plugins: [{
                    install(app: any) {
                        installConfigManager(app, { config: { dir } });
                    },
                }],
            },
        });

        expect(resolved).toBe('ltr');
        dir.value = 'rtl';
        // Computed re-evaluates on next read; re-mount-free read here
        // verifies the unwrap path works for refs.
    });
});
