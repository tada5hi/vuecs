// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
} from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { installThemeManager } from '@vuecs/core';
import type { Theme } from '@vuecs/core';
import { VCList } from '../../src/components/list/module';
import { VCListNoMore } from '../../src/components/list-no-more/module';
import { VCListLoading } from '../../src/components/list-loading/module';
import { VCListBody } from '../../src/components/list-body/module';
import { VCListItem } from '../../src/components/list-item/module';
import { VCListHeader } from '../../src/components/list-header/module';
import { VCListFooter } from '../../src/components/list-footer/module';

const themePlugin = { install: (app: any) => installThemeManager(app) };

describe('VCListNoMore', () => {
    it('should render default text when not busy and total is 0', () => {
        const wrapper = mount(VCListNoMore, {
            props: { busy: false, total: 0 },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toBe('No more items available...');
        expect(wrapper.find('.vc-list-no-more').exists()).toBe(true);
    });

    it('should render custom content text', () => {
        const wrapper = mount(VCListNoMore, {
            props: {
                busy: false, 
                total: 0, 
                content: 'Empty!', 
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toBe('Empty!');
    });

    it('should not render when busy', () => {
        const wrapper = mount(VCListNoMore, {
            props: { busy: true, total: 0 },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.html()).toBe('');
    });

    it('should not render when total > 0', () => {
        const wrapper = mount(VCListNoMore, {
            props: { busy: false, total: 5 },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.html()).toBe('');
    });

    it('should not render when meta.total > 0 and total is undefined', () => {
        const wrapper = mount(VCListNoMore, {
            props: { busy: false, meta: { total: 5 } },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.html()).toBe('');
    });

    it('should render slot content instead of default text', () => {
        const wrapper = mount(VCListNoMore, {
            props: { busy: false, total: 0 },
            global: { plugins: [themePlugin] },
            slots: { default: () => h('p', 'Custom empty state') },
        });
        expect(wrapper.find('p').text()).toBe('Custom empty state');
    });
});

describe('VCListLoading', () => {
    it('should render when busy', () => {
        const wrapper = mount(VCListLoading, {
            props: { busy: true },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list-loading').exists()).toBe(true);
    });

    it('should not render when not busy', () => {
        const wrapper = mount(VCListLoading, {
            props: { busy: false },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.html()).toBe('');
    });

    it('should render slot content when busy', () => {
        const wrapper = mount(VCListLoading, {
            props: { busy: true },
            global: { plugins: [themePlugin] },
            slots: { default: () => h('span', 'Loading...') },
        });
        expect(wrapper.find('span').text()).toBe('Loading...');
    });
});

describe('VCListHeader / VCListFooter', () => {
    it('should render nothing when no slot content', () => {
        const header = mount(VCListHeader, { global: { plugins: [themePlugin] } });
        const footer = mount(VCListFooter, { global: { plugins: [themePlugin] } });
        expect(header.html()).toBe('');
        expect(footer.html()).toBe('');
    });

    it('should render slot content with correct element and class', () => {
        const header = mount(VCListHeader, {
            global: { plugins: [themePlugin] },
            slots: { default: 'Title' },
        });
        expect(header.element.tagName).toBe('DIV');
        expect(header.find('.vc-list-header').exists()).toBe(true);
        expect(header.text()).toBe('Title');
    });

    it('should use custom tag prop', () => {
        const header = mount(VCListHeader, {
            props: { tag: 'section' },
            global: { plugins: [themePlugin] },
            slots: { default: 'Title' },
        });
        expect(header.element.tagName).toBe('SECTION');
    });
});

describe('VCListBody', () => {
    it('should render nothing when data is empty', () => {
        const wrapper = mount(VCListBody, {
            props: { data: [] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.html()).toBe('');
    });

    it('should render a list item for each data entry', () => {
        const wrapper = mount(VCListBody, {
            props: { data: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.findAll('.vc-list-item')).toHaveLength(3);
    });

    it('should render body with <ul> tag and theme class', () => {
        const wrapper = mount(VCListBody, {
            props: { data: [{ name: 'A' }] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.element.tagName).toBe('UL');
        expect(wrapper.classes()).toContain('vc-list-body');
    });

    it('should render item text from data name property', () => {
        const wrapper = mount(VCListBody, {
            props: { data: [{ name: 'Hello World' }] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('Hello World');
    });

    it('should pass item slot to list items', () => {
        const wrapper = mount(VCListBody, {
            props: { data: [{ name: 'A' }] },
            global: { plugins: [themePlugin] },
            slots: { item: (props: any) => h('span', { class: 'custom-item' }, props.data.name) },
        });
        expect(wrapper.find('.custom-item').text()).toBe('A');
    });
});

describe('VCListItem', () => {
    it('should render with <li> tag and theme class', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Test' } },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.element.tagName).toBe('LI');
        expect(wrapper.classes()).toContain('vc-list-item');
    });

    it('should render text from data using textPropName', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { title: 'Hello' }, textPropName: 'title' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('Hello');
    });

    it('should render icon element by default', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Test' } },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('i').exists()).toBe(true);
    });

    it('should hide icon when icon prop is false', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Test' }, icon: false },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('i').exists()).toBe(false);
    });

    it('should hide text when text prop is false', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Hello' }, text: false },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).not.toContain('Hello');
    });

    it('should bypass icon/text/actions when default slot is provided', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Test' } },
            global: { plugins: [themePlugin] },
            slots: { default: (props: any) => h('span', `Custom: ${props.data.name}`) },
        });
        expect(wrapper.text()).toBe('Custom: Test');
        expect(wrapper.find('i').exists()).toBe(false);
    });

    it('should pass data and index in slot props', () => {
        let receivedProps: any;
        mount(VCListItem, {
            props: { data: { name: 'Test' }, index: 3 },
            global: { plugins: [themePlugin] },
            slots: {
                default: (props: any) => {
                    receivedProps = props;
                    return h('div');
                },
            },
        });
        expect(receivedProps.data).toEqual({ name: 'Test' });
        expect(receivedProps.index).toBe(3);
    });

    it('should render actions slot content', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Test' } },
            global: { plugins: [themePlugin] },
            slots: { actions: () => h('button', 'Delete') },
        });
        expect(wrapper.find('button').text()).toBe('Delete');
    });

    it('should use custom tag when specified', () => {
        const wrapper = mount(VCListItem, {
            props: { data: { name: 'Test' }, tag: 'div' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.element.tagName).toBe('DIV');
    });
});

describe('VCList', () => {
    it('should render root container with theme class', () => {
        const wrapper = mount(VCList, {
            props: { data: [] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list').exists()).toBe(true);
    });

    it('should render one list item per data entry', () => {
        const wrapper = mount(VCList, {
            props: { data: [{ name: 'A' }, { name: 'B' }] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.findAll('.vc-list-item')).toHaveLength(2);
    });

    it('should show noMore message when data is empty and not busy', () => {
        const wrapper = mount(VCList, {
            props: {
                data: [], 
                busy: false, 
                total: 0, 
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list-no-more').exists()).toBe(true);
        expect(wrapper.text()).toContain('No more items available');
    });

    it('should show loading indicator when busy', () => {
        const wrapper = mount(VCList, {
            props: { data: [], busy: true },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list-loading').exists()).toBe(true);
    });

    it('should not show noMore when busy', () => {
        const wrapper = mount(VCList, {
            props: {
                data: [], 
                busy: true, 
                total: 0, 
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list-no-more').exists()).toBe(false);
    });

    it('should hide all sections when their props are false', () => {
        const wrapper = mount(VCList, {
            props: {
                data: [],
                header: false,
                footer: false,
                body: false,
                loading: false,
                noMore: false,
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list').exists()).toBe(true);
        expect(wrapper.findAll('.vc-list > *')).toHaveLength(0);
    });

    it('should bypass all structure when default slot is used', () => {
        const wrapper = mount(VCList, {
            props: { data: [{ name: 'A' }] },
            global: { plugins: [themePlugin] },
            slots: { default: (props: any) => h('div', { class: 'custom' }, `Count: ${props.data.length}`) },
        });
        expect(wrapper.find('.custom').text()).toBe('Count: 1');
        expect(wrapper.find('.vc-list').exists()).toBe(false);
        expect(wrapper.find('.vc-list-body').exists()).toBe(false);
    });

    it('should pass item slot through to list items', () => {
        const wrapper = mount(VCList, {
            props: { data: [{ name: 'X' }] },
            global: { plugins: [themePlugin] },
            slots: { item: (props: any) => h('b', props.data.name) },
        });
        expect(wrapper.find('b').text()).toBe('X');
    });

    it('should apply preset theme classes', () => {
        const theme: Theme = {
            elements: {
                list: { root: 'custom-list' },
                listBody: { root: 'custom-body' },
            },
        };
        const wrapper = mount(VCList, {
            props: { data: [{ name: 'A' }] },
            global: { plugins: [{ install: (app: any) => installThemeManager(app, { themes: [theme] }) }] },
        });
        expect(wrapper.find('.custom-list').exists()).toBe(true);
        expect(wrapper.find('.custom-body').exists()).toBe(true);
    });

    it('should default total to data.length', () => {
        // If total defaults to data.length (2), noMore should NOT render
        // because total > 0
        const wrapper = mount(VCList, {
            props: { data: [{ name: 'A' }, { name: 'B' }], busy: false },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('.vc-list-no-more').exists()).toBe(false);
    });
});
