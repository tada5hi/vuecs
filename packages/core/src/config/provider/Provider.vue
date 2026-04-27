<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { injectConfigManager, provideConfigManager } from '../install';
import { ConfigManager } from '../manager';
import type { ConfigManagerOptions } from '../types';

/**
 * Subtree-scoped configuration provider. Mirrors reka-ui's
 * `<ConfigProvider>` shape — wrap a section of your component tree to
 * apply a different `dir` / `locale` / etc. without affecting the rest
 * of the app.
 *
 * Resolution inside the subtree:
 *   1. The local manager's consumer config (props passed to this component)
 *   2. Defaults inherited from the parent manager (snapshot at mount time)
 *   3. `undefined` for keys with no default
 *
 * Inheritance is a SNAPSHOT: defaults registered on the parent AFTER this
 * provider mounts don't propagate. Calls to `withDefaults` inside the
 * subtree affect only the local manager — the parent stays untouched.
 *
 * For app-wide config, prefer `app.use(vuecs, { config })` (see
 * `installConfigManager`). Use this component only when you need
 * subtree-scoped overrides.
 */
export default defineComponent({
    name: 'VCConfigProvider',
    props: {
        /**
         * Local consumer config for this subtree. Same shape as
         * `app.use(vuecs, { config })`. Each key wins over the inherited
         * default.
         */
        config: {
            type: Object as PropType<ConfigManagerOptions['config']>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const parent = injectConfigManager();
        const local = new ConfigManager({
            config: props.config,
            defaults: parent?.defaults,
        });
        provideConfigManager(local);
        return () => slots.default?.();
    },
});
</script>
