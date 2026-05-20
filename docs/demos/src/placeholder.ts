import elements from '@vuecs/elements';
import placeholder from '@vuecs/placeholder';
import table from '@vuecs/table';
import Placeholder from '@vuecs-examples/shared/views/Placeholder.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Placeholder, propState.value);
    },
});
installVuecs(app);
// The demo composes the primitive `<VCPlaceholder>` (placeholder
// package) with `<VCCardPlaceholder>` (elements) + `<VCTablePlaceholder>`
// (table) — register all three plugins.
app.use(placeholder);
app.use(elements);
app.use(table);
app.mount('#app');

announceProps(
    {
        animation: {
            type: 'enum',
            default: 'wave',
            options: ['wave', 'glow', 'none'],
            section: 'Animation',
        },
        size: {
            type: 'enum',
            default: 'md',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            section: 'Variant',
        },
        rows: {
            type: 'number',
            default: 5,
            min: 0,
            max: 20,
            section: 'Table',
        },
        columns: {
            type: 'number',
            default: 4,
            min: 0,
            max: 12,
            section: 'Table',
        },
    },
    {
        animation: 'wave',
        size: 'md',
        rows: 5,
        columns: 4,
    },
);

installIframeBridge();
