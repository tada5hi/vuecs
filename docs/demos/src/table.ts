import table from '@vuecs/table';
import Table from '@vuecs-examples/shared/views/Table.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        // The `selection-mode` control is an enum with three options:
        // `''` (off), `'single'`, `'multi'`. Map the empty sentinel to
        // `undefined` so the underlying `<VCTable :selection-mode>`
        // prop receives the canonical "off" value rather than an
        // empty-string mode that would partially activate the grid
        // pattern (role='grid' would fire, but the machine wouldn't
        // accept toggles).
        return () => {
            const props = propState.value as Record<string, unknown>;
            const selectionMode = props.selectionMode === '' ? undefined : props.selectionMode;
            return h(Table, {
                ...props,
                selectionMode,
            });
        };
    },
});
installVuecs(app);
app.use(table);
app.mount('#app');

announceProps(
    {
        density: {
            type: 'enum',
            default: 'normal',
            options: ['compact', 'normal', 'spacious'],
            section: 'Variant',
        },
        striped: {
            type: 'boolean',
            default: false,
            section: 'Variant',
        },
        bordered: {
            type: 'boolean',
            default: false,
            section: 'Variant',
        },
        hover: {
            type: 'boolean',
            default: true,
            section: 'Variant',
        },
        rowClickable: {
            type: 'boolean',
            default: false,
            section: 'Behavior',
        },
        selectionMode: {
            type: 'enum',
            default: '',
            // Empty string represents "selection off" — the wrapper
            // setup() above maps it to `undefined` before forwarding.
            options: ['', 'single', 'multi'],
            label: 'selection-mode',
            section: 'Behavior',
        },
        responsive: {
            type: 'boolean',
            default: false,
            section: 'Behavior',
        },
    },
    {
        density: 'normal',
        striped: false,
        bordered: false,
        hover: true,
        rowClickable: false,
        selectionMode: '',
        responsive: false,
    },
);

installIframeBridge();
