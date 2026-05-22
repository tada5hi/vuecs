import pagination from '@vuecs/pagination';
import Pagination from '@vuecs-examples/shared/views/Pagination.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Pagination, propState.value);
    },
});
installVuecs(app);
app.use(pagination);
app.mount('#app');

announceProps(
    {
        total: {
            type: 'number', 
            default: 100, 
            min: 1, 
            max: 1000, 
            section: 'Data',
        },
        limit: {
            type: 'number', 
            default: 10, 
            min: 1, 
            max: 100, 
            section: 'Data',
        },
        busy: {
            type: 'boolean', 
            default: false, 
            section: 'State', 
        },
        hideDisabled: {
            type: 'boolean',
            default: true,
            section: 'State',
        },
        withText: {
            type: 'boolean',
            default: false,
            section: 'State',
        },
        'themeVariant.variant': {
            type: 'enum', 
            default: 'outline', 
            options: ['outline', 'soft', 'ghost'], 
            section: 'Variant',
        },
        'themeVariant.size': {
            type: 'enum', 
            default: 'md', 
            options: ['sm', 'md', 'lg'], 
            section: 'Variant',
        },
    },
    {
        total: 100,
        limit: 10,
        busy: false,
        hideDisabled: true,
        withText: false,
        'themeVariant.variant': 'outline',
        'themeVariant.size': 'md',
    },
);

installIframeBridge();
