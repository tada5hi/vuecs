import button from '@vuecs/button';
import formControls from '@vuecs/forms';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './button.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(button);
app.use(formControls);
app.mount('#app');

// Drive every button in the demo via `:theme-variant="variantState"`.
// The explicit-size row keeps its `size="sm|md|lg"` props (which win over
// themeVariant.size at component-level merge), so toggling the toolbar
// reskins the color / variant / state rows while the size row remains a
// stable size reference.
announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
