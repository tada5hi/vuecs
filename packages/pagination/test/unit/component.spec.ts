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
                hideDisabled: false,
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

    it('falls back to visible label text on edge buttons when no icon resolves', () => {
        // No icon preset installed → `defaults.<edge>Icon` is empty.
        // The label string falls back to visible text so the button isn't
        // empty, even with `withText: false`.
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').text()).toBe('First');
        expect(wrapper.find('button[aria-label="Previous Page"]').text()).toBe('Previous');
        expect(wrapper.find('button[aria-label="Next Page"]').text()).toBe('Next');
        expect(wrapper.find('button[aria-label="Last Page"]').text()).toBe('Last');
    });

    it('renders icon-only (no label) by default when an icon resolves', () => {
        // Icon configured per-instance — text label suppressed because
        // `withText` defaults to `false`. Reka's `aria-label="… Page"`
        // carries the accessible name regardless.
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                firstIcon: 'lucide:chevrons-left',
                prevIcon: 'lucide:chevron-left',
                nextIcon: 'lucide:chevron-right',
                lastIcon: 'lucide:chevrons-right',
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').text()).toBe('');
        expect(wrapper.find('button[aria-label="Previous Page"]').text()).toBe('');
        expect(wrapper.find('button[aria-label="Next Page"]').text()).toBe('');
        expect(wrapper.find('button[aria-label="Last Page"]').text()).toBe('');
    });

    it('withText: true forces label text alongside the icon', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                withText: true,
                firstIcon: 'lucide:chevrons-left',
                prevIcon: 'lucide:chevron-left',
                nextIcon: 'lucide:chevron-right',
                lastIcon: 'lucide:chevrons-right',
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="First Page"]').text()).toBe('First');
        expect(wrapper.find('button[aria-label="Previous Page"]').text()).toBe('Previous');
        expect(wrapper.find('button[aria-label="Next Page"]').text()).toBe('Next');
        expect(wrapper.find('button[aria-label="Last Page"]').text()).toBe('Last');
    });

    it('per-instance label props override the defaults', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                prevLabel: 'Zurück',
                nextLabel: 'Weiter',
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[aria-label="Previous Page"]').text()).toBe('Zurück');
        expect(wrapper.find('button[aria-label="Next Page"]').text()).toBe('Weiter');
    });

    it('empty-string label + no icon suppresses vuecs label content (Reka fallback also suppressed)', () => {
        // Setting `prevLabel: ''` AND no icon means both the icon and
        // label branches are empty. The `aria-hidden` placeholder span
        // fills Reka's default slot so its "Prev page" fallback doesn't
        // leak. Reka's `aria-label="Previous Page"` still names the
        // button.
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                prevLabel: '',
            },
            global: { plugins: [themePlugin] },
        });
        const prev = wrapper.find('button[aria-label="Previous Page"]');
        expect(prev.text()).toBe('');
        expect(prev.attributes('aria-label')).toBe('Previous Page');
    });

    it('empty consumer slot does not leak Reka fallback text', () => {
        // A consumer passing `<template #prev></template>` (empty slot)
        // would, under a naive `<slot v-if="$slots.prev" />` pattern,
        // result in Reka's `<slot>Prev page</slot>` fallback firing.
        // The wrapper uses `<slot name="prev">…fallback…</slot>` so Vue's
        // native slot fallback (which renders when the slot returns
        // only comment vnodes / empty array) kicks in and the icon /
        // label / placeholder branch renders instead. Reka's
        // `aria-label="Previous Page"` keeps the button accessible.
        const wrapper = mount(VCPagination, {
            props: {
                total: 50,
                limit: 10,
                offset: 20,
                prevIcon: 'lucide:chevron-left',
            },
            slots: { prev: '' },
            global: { plugins: [themePlugin] },
        });
        const prev = wrapper.find('button[aria-label="Previous Page"]');
        expect(prev.text()).not.toMatch(/Prev page/i);
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
