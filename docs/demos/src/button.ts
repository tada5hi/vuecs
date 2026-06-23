import button from '@vuecs/button';
import Button from '@vuecs-examples/shared/views/Button.vue';
import formControls from '@vuecs/forms';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

/*
 * Host shell — the demo body lives in `@vuecs-examples/shared` so the
 * per-theme example apps can mount the same view. The host's only job
 * is to bind the iframe-bridge's reactive `variantState` to the view's
 * `themeVariant` prop; example apps render the view without a host
 * (no toolbar, no announce contract).
 */
const app = createApp({
    setup() {
        return () => h(Button, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(button);
app.use(formControls);
app.mount('#app');

// Drive every button in the demo via `:theme-variant="variantState"`.
// The explicit-size row keeps its `size="sm|md|lg"` props (which win over
// themeVariant.size at component-level merge), so toggling the toolbar
// reskins the color / variant / state rows while the size row remains a
// stable size reference.
announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
