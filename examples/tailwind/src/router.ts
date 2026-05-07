import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

/**
 * Routes are auto-built from the shared package's `sharedRoutes` array,
 * plus a Home landing page. Adding a new shared view to
 * `examples/_shared/src/routes.ts` lights it up here automatically.
 */
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        ...sharedRoutes.map((route) => ({
            path: route.path,
            name: route.name,
            component: route.view,
        })),
    ],
});
