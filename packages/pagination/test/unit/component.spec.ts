// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
} from 'vitest';
import { mount } from '@vue/test-utils';
import { installThemeManager } from '@vuecs/core';
import { VCPagination } from '../../src';

const themePlugin = { install: (app: any) => installThemeManager(app) };

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
});
