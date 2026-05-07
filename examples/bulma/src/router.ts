import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

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
