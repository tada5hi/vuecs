// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
} from 'vitest';
import { mount } from '@vue/test-utils';
import { installThemeManager } from '@vuecs/core';
import { VCPagination } from '../../src/component';

const themePlugin = { install: (app: any) => installThemeManager(app) };

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
        const buttons = wrapper.findAll('button');
        // Pages 1-3 visible (current=1, range [1,2,3]) + next + last
        expect(buttons.length).toBeGreaterThanOrEqual(3);
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
        const buttons = wrapper.findAll('button');
        // Click page 2 (second button)
        await buttons[1].trigger('click');
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
        const buttons = wrapper.findAll('button');
        // First button is page 1 (current)
        await buttons[0].trigger('click');
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
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
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

    it('should use meta prop for values', () => {
        const wrapper = mount(VCPagination, {
            props: {
                meta: {
                    total: 30, 
                    limit: 10, 
                    offset: 10, 
                }, 
            },
            global: { plugins: [themePlugin] },
        });
        const activeButtons = wrapper.findAll('.active');
        expect(activeButtons).toHaveLength(1);
        // Page 2 should be active (offset 10 / limit 10 + 1 = 2)
    });

    it('should render single page without navigation arrows', () => {
        const wrapper = mount(VCPagination, {
            props: {
                total: 5, 
                limit: 10, 
                offset: 0, 
            },
            global: { plugins: [themePlugin] },
        });
        const buttons = wrapper.findAll('button');
        // Only page 1
        expect(buttons).toHaveLength(1);
    });
});
