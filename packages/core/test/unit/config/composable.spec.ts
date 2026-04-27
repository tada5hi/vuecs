// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import type { App, ComputedRef } from 'vue';
import {
    VCConfigProvider,
    installConfigManager,
    useConfig,
} from '../../../src';

// Test-local augmentation so we exercise child-package keys
// (`scrollLockTarget` lives in `@vuecs/overlays` in production) without
// reaching for `as any`. Same pattern as defaults/composable.spec.ts.
declare module '../../../src/config/types' {
    interface Config {
        scrollLockTarget?: string | HTMLElement;
    }
}

describe('useConfig', () => {
    it('returns core framework defaults when no manager is installed', () => {
        let dir: string | undefined;
        let locale: string | undefined;
        mount(defineComponent({
            setup() {
                dir = useConfig('dir').value;
                locale = useConfig('locale').value;
                return () => h('div');
            },
        }));
        expect(dir).toBe('ltr');
        expect(locale).toBe('en-US');
    });

    it('returns undefined for keys with no consumer config and no registered default', () => {
        // Core's Config knows only `dir` + `locale`. Augmented keys (added
        // by child packages via declaration merging) are unset by default.
        let scrollLockTarget: string | HTMLElement | undefined;
        mount(defineComponent({
            setup() {
                scrollLockTarget = useConfig('scrollLockTarget').value;
                return () => h('div');
            },
        }));
        expect(scrollLockTarget).toBeUndefined();
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
                    install(app: App) {
                        installConfigManager(app, { config: { dir: 'rtl' } });
                    },
                }],
            },
        });
        expect(dir).toBe('rtl');
    });

    it('tracks reactive config values', async () => {
        const dir = ref<'ltr' | 'rtl'>('ltr');
        let cfg: ComputedRef<'ltr' | 'rtl' | undefined> | undefined;

        mount(defineComponent({
            setup() {
                cfg = useConfig('dir');
                return () => h('div');
            },
        }), {
            global: {
                plugins: [{
                    install(app: App) {
                        installConfigManager(app, { config: { dir } });
                    },
                }],
            },
        });

        expect(cfg!.value).toBe('ltr');
        dir.value = 'rtl';
        await nextTick();
        expect(cfg!.value).toBe('rtl');
    });

    describe('fallback overload', () => {
        it('uses the fallback when the manager would return undefined', () => {
            let resolved: string | HTMLElement | undefined;
            mount(defineComponent({
                setup() {
                    resolved = useConfig('scrollLockTarget', 'body').value;
                    return () => h('div');
                },
            }));
            expect(resolved).toBe('body');
        });

        it('does NOT override an explicitly configured value', () => {
            let resolved: string | undefined;
            mount(defineComponent({
                setup() {
                    resolved = useConfig('dir', 'rtl').value;
                    return () => h('div');
                },
            }), {
                global: {
                    plugins: [{
                        install(app: App) {
                            installConfigManager(app, { config: { dir: 'ltr' } });
                        },
                    }],
                },
            });
            expect(resolved).toBe('ltr');
        });
    });

    describe('<VCConfigProvider> subtree scoping', () => {
        it('overrides parent config inside the subtree', () => {
            let outerDir: string | undefined;
            let innerDir: string | undefined;

            const Inner = defineComponent({
                setup() {
                    innerDir = useConfig('dir').value;
                    return () => h('div');
                },
            });

            const Outer = defineComponent({
                setup() {
                    outerDir = useConfig('dir').value;
                    return () => h(VCConfigProvider, { config: { dir: 'rtl' } }, () => h(Inner));
                },
            });

            mount(Outer, {
                global: {
                    plugins: [{
                        install(app: App) {
                            installConfigManager(app, { config: { dir: 'ltr' } });
                        },
                    }],
                },
            });

            expect(outerDir).toBe('ltr');
            expect(innerDir).toBe('rtl');
        });

        it('inherits parent defaults at mount time', () => {
            let resolved: string | HTMLElement | undefined;

            const Inner = defineComponent({
                setup() {
                    resolved = useConfig('scrollLockTarget').value;
                    return () => h('div');
                },
            });

            const Outer = defineComponent({
                setup() {
                    return () => h(VCConfigProvider, null, () => h(Inner));
                },
            });

            mount(Outer, {
                global: {
                    plugins: [{
                        install(app: App) {
                            const mgr = installConfigManager(app);
                            mgr.withDefaults({ scrollLockTarget: 'body' });
                        },
                    }],
                },
            });

            expect(resolved).toBe('body');
        });
    });
});
