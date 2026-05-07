import vuecs from '@vuecs/core';
import lucideIcons from '@vuecs/icons-lucide';
import installButton from '@vuecs/button';
import installCountdown from '@vuecs/countdown';
import installElements from '@vuecs/elements';
import installForms from '@vuecs/forms';
import installGravatar from '@vuecs/gravatar';
import installIcon from '@vuecs/icon';
import installLink from '@vuecs/link';
import installList from '@vuecs/list';
import installNavigation from '@vuecs/navigation';
import installOverlays from '@vuecs/overlays';
import installPagination from '@vuecs/pagination';
import installTimeago from '@vuecs/timeago';
import bootstrapTheme from '@vuecs/theme-bootstrap';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './style.css';

const app = createApp(App);

app.use(vuecs, {
    themes: [bootstrapTheme()],
    icons: [lucideIcons()],
});
app.use(installIcon);
app.use(installButton);
app.use(installCountdown);
app.use(installElements);
app.use(installForms);
app.use(installGravatar);
app.use(installLink);
app.use(installList);
app.use(installNavigation);
app.use(installOverlays);
app.use(installPagination);
app.use(installTimeago);

app.use(router);
app.mount('#app');
