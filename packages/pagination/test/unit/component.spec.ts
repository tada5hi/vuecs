// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
} from 'vitest';
import { mount } from '@vue/test-utils';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import { VCPagination } from '../../src';

const themePlugin = {
    install: (app: any) => {
        installThemeManager(app);
        installDefaultsManager(app);
    },
};

const findPageButton = (wrapper: ReturnType<typeof mount>, page: number) => wrapper
    .findAll('button[data-type="page"]')
    .find((b) => b.text().trim() === String(page));

describe('VCPagination', () => {
    it('should render with default theme class', () => {
        const wrapper = mount(VCPagination, {
            props: { total: 50, limit: 10 },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-pagination').exists()).toBe(true);
    });

    it('should render page buttons for multiple pages', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
            },
            global: { plugins: [themePlugin] },
        });
        const pageButtons = wrapper.findAll('button[data-type="page"]');
        expect(pageButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('should emit load event on page click', async () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
            },
            global: { plugins: [themePlugin] },
        });
        const pageTwo = findPageButton(wrapper, 2);
        expect(pageTwo).toBeTruthy();
        await pageTwo!.trigger('click');
        expect(wrapper.emitted('load')).toBeTruthy();
        const loadData = wrapper.emitted('load')![0][0] as any;
        expect(loadData.page).toBe(2);
        expect(loadData.offset).toBe(10);
        expect(loadData.limit).toBe(10);
    });

    it('should not emit load when clicking current page', async () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
            },
            global: { plugins: [themePlugin] },
        });
        const pageOne = findPageButton(wrapper, 1);
        expect(pageOne).toBeTruthy();
        await pageOne!.trigger('click');
        expect(wrapper.emitted('load')).toBeFalsy();
    });

    it('should not emit load when busy', async () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
                busy: true,
            },
            global: { plugins: [themePlugin] },
        });
        const pageTwo = findPageButton(wrapper, 2);
        expect(pageTwo).toBeTruthy();
        await pageTwo!.trigger('click');
        expect(wrapper.emitted('load')).toBeFalsy();
    });

    it('should apply active class to current page', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
            },
            global: { plugins: [themePlugin] },
        });
        const activeButtons = wrapper.findAll('.active');
        expect(activeButtons).toHaveLength(1);
    });

    it('should accept a spread state object via v-bind', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 30,
                limit: 10,
                offset: 10,
            },
            global: { plugins: [themePlugin] },
        });
        const activeButtons = wrapper.findAll('.active');
        expect(activeButtons).toHaveLength(1);
        expect(activeButtons[0].text().trim()).toBe('2');
    });

    it('should hide First/Prev when hideDisabled and on page 1', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
                hideDisabled: true,
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').exists()).toBe(false);
        expect(wrapper.find('button[aria-label="Previous Page"]').exists()).toBe(false);
        expect(wrapper.find('button[aria-label="Next Page"]').exists()).toBe(true);
        expect(wrapper.find('button[aria-label="Last Page"]').exists()).toBe(true);
    });

    it('should hide Next/Last when hideDisabled and on the last page', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 40,
                hideDisabled: true,
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').exists()).toBe(true);
        expect(wrapper.find('button[aria-label="Previous Page"]').exists()).toBe(true);
        expect(wrapper.find('button[aria-label="Next Page"]').exists()).toBe(false);
        expect(wrapper.find('button[aria-label="Last Page"]').exists()).toBe(false);
    });

    it('should render all edge controls when hideDisabled and on a middle page', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                hideDisabled: true,
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').exists()).toBe(true);
        expect(wrapper.find('button[aria-label="Previous Page"]').exists()).toBe(true);
        expect(wrapper.find('button[aria-label="Next Page"]').exists()).toBe(true);
        expect(wrapper.find('button[aria-label="Last Page"]').exists()).toBe(true);
    });

    it('should render edge controls disabled (not hidden) when hideDisabled is false on page 1', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 0,
            },
            global: { plugins: [themePlugin] },
        });
        const first = wrapper.find('button[aria-label="First Page"]');
        const prev = wrapper.find('button[aria-label="Previous Page"]');
        expect(first.exists()).toBe(true);
        expect(prev.exists()).toBe(true);
        expect(first.attributes('disabled')).toBeDefined();
        expect(prev.attributes('disabled')).toBeDefined();
    });

    it('should render only one page-type button when total <= limit', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 5,
                limit: 10,
                offset: 0,
            },
            global: { plugins: [themePlugin] },
        });
        const pageButtons = wrapper.findAll('button[data-type="page"]');
        expect(pageButtons).toHaveLength(1);
        expect(pageButtons[0].text().trim()).toBe('1');
    });

    it('does NOT render visible label text on edge buttons by default', () => {
        // `withText` defaults to `false`. The label span is rendered with
        // `v-show` so it stays in the vnode tree (suppressing Reka's
        // `<slot>First page</slot>` fallback) but is hidden via inline
        // `display: none`. Reka's `aria-label="… Page"` keeps the button
        // accessible regardless.
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
            },
            global: { plugins: [themePlugin] },
        });
        const first = wrapper.find('button[aria-label="First Page"]');
        const prev = wrapper.find('button[aria-label="Previous Page"]');
        const next = wrapper.find('button[aria-label="Next Page"]');
        const last = wrapper.find('button[aria-label="Last Page"]');
        // Reka's slot fallback ('First page' / 'Prev page' / …) must not
        // leak through, and the visible text (`.text()` ignores nodes
        // hidden with `display: none`) must be empty.
        expect(first.text()).toBe('');
        expect(prev.text()).toBe('');
        expect(next.text()).toBe('');
        expect(last.text()).toBe('');
    });

    it('renders default English text labels on edge buttons when withText is enabled', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                withText: true,
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').text()).toBe('First');
        expect(wrapper.find('button[aria-label="Previous Page"]').text()).toBe('Previous');
        expect(wrapper.find('button[aria-label="Next Page"]').text()).toBe('Next');
        expect(wrapper.find('button[aria-label="Last Page"]').text()).toBe('Last');
    });

    it('per-instance label props override the defaults when withText is enabled', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                withText: true,
                prevLabel: 'Zurück',
                nextLabel: 'Weiter',
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="Previous Page"]').text()).toBe('Zurück');
        expect(wrapper.find('button[aria-label="Next Page"]').text()).toBe('Weiter');
    });

    it('empty-string label suppresses the vuecs-rendered label content (with withText enabled)', () => {
        // With `withText: true` the default 'Previous' label appears.
        // Setting `prevLabel: ''` suppresses vuecs's own label span; any
        // remaining text is Reka UI's screen-reader-only "Prev page"
        // affordance, which is intentional and out of scope.
        const withDefault = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                withText: true,
            },
            global: { plugins: [themePlugin] },
        });
        expect(withDefault.find('button[aria-label="Previous Page"]').text()).toContain('Previous');

        const withEmpty = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                withText: true,
                prevLabel: '',
            },
            global: { plugins: [themePlugin] },
        });
        // 'Previous' specifically (capitalised, vuecs's contribution) is gone.
        // Reka's sr-only "Prev page" (lowercase 'p') may remain.
        expect(withEmpty.find('button[aria-label="Previous Page"]').text()).not.toMatch(/Previous/);
    });

    it('full-button slot wins over icon prop and label default', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                prevIcon: 'lucide:chevron-left',
            },
            slots: { prev: '<span class="custom-prev">go back</span>' },
            global: { plugins: [themePlugin] },
        });
        const prev = wrapper.find('button[aria-label="Previous Page"]');
        expect(prev.find('.custom-prev').exists()).toBe(true);
        expect(prev.text()).toBe('go back');
        // Icon prop ignored when full slot present
        expect(prev.text()).not.toContain('Previous');
    });
});
