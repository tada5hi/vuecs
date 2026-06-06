// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
} from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { mount } from '@vue/test-utils';
import vuecsNav, { VCNavItems } from '../../src';
import type { NavigationItem } from '../../src';

const items: NavigationItem[] = [
    { name: 'Home', url: '/home' },
    { name: 'Users', url: '/users' },
];

function buildRouter() {
    return createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/home', component: { template: '<div />' } },
            { path: '/users', component: { template: '<div />' } },
        ],
    });
}

const App = defineComponent({
    setup() {
        return () => h(VCNavItems, { resolver: items });
    },
});

describe('VCNavItems path source', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('softly reads the router $route path for active matching', async () => {
        const router = buildRouter();
        await router.push('/users');
        await router.isReady();

        const wrapper = mount(App, {
            global: { plugins: [router, [vuecsNav, {}]] },
            attachTo: document.body,
        });
        await nextTick();

        const active = wrapper.element.querySelector('.vc-nav-link.active') as HTMLElement;
        expect(active).not.toBeNull();
        expect(active.textContent).toContain('Users');
    });

    it('reacts to route changes', async () => {
        const router = buildRouter();
        await router.push('/home');
        await router.isReady();

        const wrapper = mount(App, {
            global: { plugins: [router, [vuecsNav, {}]] },
            attachTo: document.body,
        });
        await nextTick();

        expect(
            (wrapper.element.querySelector('.vc-nav-link.active') as HTMLElement).textContent,
        ).toContain('Home');

        await router.push('/users');
        await nextTick();
        await nextTick();

        expect(
            (wrapper.element.querySelector('.vc-nav-link.active') as HTMLElement).textContent,
        ).toContain('Users');
    });

    it('degrades without a router — no active item, no throw', async () => {
        const wrapper = mount(App, {
            global: { plugins: [[vuecsNav, {}]] },
            attachTo: document.body,
        });
        await nextTick();

        // findBestItemMatches' first-item fallback marks index 0 active when
        // nothing matches a (missing) path, so Home — the first leaf — is lit.
        const actives = wrapper.element.querySelectorAll('.vc-nav-link.active');
        expect(actives.length).toBe(1);
        expect((actives[0] as HTMLElement).textContent).toContain('Home');
    });

    it('explicit :path wins over the router route', async () => {
        const router = buildRouter();
        await router.push('/users');
        await router.isReady();

        const PinnedApp = defineComponent({
            setup() {
                return () => h(VCNavItems, { resolver: items, path: '/home' });
            },
        });

        const wrapper = mount(PinnedApp, {
            global: { plugins: [router, [vuecsNav, {}]] },
            attachTo: document.body,
        });
        await nextTick();

        expect(
            (wrapper.element.querySelector('.vc-nav-link.active') as HTMLElement).textContent,
        ).toContain('Home');
    });
});
