import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import vuecs from '@vuecs/core';
import countdown from '@vuecs/countdown';
import formControls from '@vuecs/form-controls';
import gravatar from '@vuecs/gravatar';
import link from '@vuecs/link';
import listControls from '@vuecs/list-controls';
import navigation from '@vuecs/navigation';
import pagination from '@vuecs/pagination';
import tailwindTheme from '@vuecs/theme-tailwind';
import timeago from '@vuecs/timeago';
import Demo from './components/Demo.vue';

import './style.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        const options = { themes: [tailwindTheme()] };
        app.use(vuecs, options);
        app.use(countdown, options);
        app.use(formControls, options);
        app.use(gravatar, options);
        app.use(link, options);
        app.use(listControls, options);
        app.use(navigation, options);
        app.use(pagination, options);
        app.use(timeago, options);
        app.component('Demo', Demo);
    },
} satisfies Theme;
