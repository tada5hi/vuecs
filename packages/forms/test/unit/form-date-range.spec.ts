// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App } from 'vue';
import { default as VCFormDateRange } from '../../src/components/form-date-range/FormDateRange.vue';
import type { DateRangePreset, DateRangeValue } from '../../src/utils/date-range';

const plugin = (defaults?: Record<string, unknown>) => ({
    install: (app: App) => {
        installThemeManager(app);
        installDefaultsManager(app, defaults ? { defaults } : {});
    },
});

const NOW = new Date(2026, 0, 31, 12);

const mountRange = (props: Record<string, unknown> = {}, defaults?: Record<string, unknown>) => mount(VCFormDateRange, {
    props: { now: NOW, ...props },
    global: { plugins: [plugin(defaults)] },
});

const emitted = (wrapper: ReturnType<typeof mountRange>): DateRangeValue[] => (wrapper.emitted('update:modelValue') ?? [])
    .map((args) => args[0] as DateRangeValue);

const inputs = (wrapper: ReturnType<typeof mountRange>) => {
    const all = wrapper.findAll('input[type="date"]');

    return { from: all[0]!, to: all[1]! };
};

describe('VCFormDateRange', () => {
    it('renders two date inputs with labels', () => {
        const wrapper = mountRange();
        const { from, to } = inputs(wrapper);

        expect(wrapper.findAll('input[type="date"]')).toHaveLength(2);

        const labels = wrapper.findAll('label');

        expect(labels.map((label) => label.text())).toEqual(['From', 'To']);
        expect(labels[0]!.attributes('for')).toBe(from.attributes('id'));
        expect(labels[1]!.attributes('for')).toBe(to.attributes('id'));
    });

    it('reflects the model into the inputs', () => {
        const wrapper = mountRange({ modelValue: { from: '2026-01-02', to: '2026-01-09' } });
        const { from, to } = inputs(wrapper);

        expect((from.element as HTMLInputElement).value).toBe('2026-01-02');
        expect((to.element as HTMLInputElement).value).toBe('2026-01-09');
    });

    it('constrains from.max to `to` and to.min to `from`', async () => {
        const wrapper = mountRange({ modelValue: { from: '2026-01-02', to: '2026-01-09' } });
        let { from, to } = inputs(wrapper);

        expect(from.attributes('max')).toBe('2026-01-09');
        expect(to.attributes('min')).toBe('2026-01-02');

        await wrapper.setProps({ modelValue: {} });
        ({ from, to } = inputs(wrapper));

        expect(from.attributes('max')).toBeUndefined();
        expect(to.attributes('min')).toBeUndefined();
    });

    it('constrains only the side whose counterpart is set', () => {
        const wrapper = mountRange({ modelValue: { from: '2026-01-02' } });
        const { from, to } = inputs(wrapper);

        expect(from.attributes('max')).toBeUndefined();
        expect(to.attributes('min')).toBe('2026-01-02');
    });

    it('treats a null modelValue as an empty range', async () => {
        const wrapper = mountRange({ modelValue: null });
        const { from, to } = inputs(wrapper);

        expect((from.element as HTMLInputElement).value).toBe('');
        expect((to.element as HTMLInputElement).value).toBe('');

        await from.setValue('2026-01-05');
        await wrapper.find('[role="group"]').findAll('button')[1]!.trigger('click');

        expect(emitted(wrapper)).toEqual([
            { from: '2026-01-05' },
            { from: '2026-01-01', to: '2026-01-31' },
        ]);
    });

    it('resolves presets against the current time when `now` is omitted', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 6, 10, 9));

        try {
            const wrapper = mount(VCFormDateRange, { global: { plugins: [plugin()] } });

            await wrapper.find('[role="group"]').findAll('button')[1]!.trigger('click');

            expect(emitted(wrapper)).toEqual([{ from: '2026-07-01', to: '2026-07-31' }]);
        } finally {
            vi.useRealTimers();
        }
    });

    describe('SSR preset highlight', () => {
        const renderServer = (props: Record<string, unknown>) => {
            const app = createSSRApp({ render: () => h(VCFormDateRange, props) });

            app.use(plugin());

            return renderToString(app);
        };

        it('renders no active preset on the server without `now`', async () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2026, 6, 10, 9));

            try {
                const html = await renderServer({ modelValue: { from: '2026-07-01', to: '2026-07-31' } });

                expect(html).not.toContain('aria-pressed="true"');
                expect(html).not.toContain('vc-form-date-range-preset-active');
                expect(html.match(/aria-pressed="false"/g)).toHaveLength(3);
            } finally {
                vi.useRealTimers();
            }
        });

        it('highlights on the server when an explicit `now` is passed', async () => {
            const html = await renderServer({ now: NOW, modelValue: { from: '2026-01-01', to: '2026-01-31' } });

            expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
        });

        it('highlights the matching preset after mount without `now`', async () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2026, 6, 10, 9));

            try {
                const wrapper = mount(VCFormDateRange, {
                    props: { modelValue: { from: '2026-07-01', to: '2026-07-31' } },
                    global: { plugins: [plugin()] },
                });

                await wrapper.vm.$nextTick();

                const pressed = wrapper.find('[role="group"]').findAll('button').map((button) => button.attributes('aria-pressed'));

                expect(pressed).toEqual(['false', 'true', 'false']);
            } finally {
                vi.useRealTimers();
            }
        });
    });

    it('prefixes field ids with vc-form-date-range', () => {
        const { from, to } = inputs(mountRange());

        expect(from.attributes('id')).toMatch(/^vc-form-date-range-.+-from$/);
        expect(to.attributes('id')).toMatch(/^vc-form-date-range-.+-to$/);
    });

    it('emits { ...modelValue, from } when editing from, from the latest props', async () => {
        const wrapper = mountRange({ modelValue: { to: '2026-01-20' } });

        await inputs(wrapper).from.setValue('2026-01-05');
        expect(emitted(wrapper)).toEqual([{ from: '2026-01-05', to: '2026-01-20' }]);

        // Parent applies the first emit AND changes `to` independently.
        await wrapper.setProps({ modelValue: { from: '2026-01-05', to: '2026-01-25' } });
        await inputs(wrapper).from.setValue('2026-01-06');

        expect(emitted(wrapper)[1]).toEqual({ from: '2026-01-06', to: '2026-01-25' });

        await wrapper.setProps({ modelValue: { from: '2026-01-06', to: '2026-01-25' } });
        await inputs(wrapper).to.setValue('2026-01-28');

        expect(emitted(wrapper)[2]).toEqual({ from: '2026-01-06', to: '2026-01-28' });
        expect(emitted(wrapper)).toHaveLength(3);
    });

    it('drops the key when a field is cleared (never emits "")', async () => {
        const wrapper = mountRange({ modelValue: { from: '2026-01-05', to: '2026-01-20' } });

        await inputs(wrapper).to.setValue('');

        const [value] = emitted(wrapper);

        expect(value).toEqual({ from: '2026-01-05' });
        expect(Object.prototype.hasOwnProperty.call(value, 'to')).toBe(false);

        await wrapper.setProps({ modelValue: value });
        await inputs(wrapper).from.setValue('');

        expect(emitted(wrapper)[1]).toEqual({});
    });

    it('does not mutate the bound modelValue object', async () => {
        const model = { from: '2026-01-05', to: '2026-01-20' };
        const wrapper = mountRange({ modelValue: model });

        await inputs(wrapper).to.setValue('');

        expect(model).toEqual({ from: '2026-01-05', to: '2026-01-20' });
    });

    it('renders the default presets as an accessible group', () => {
        const wrapper = mountRange();
        const group = wrapper.find('[role="group"]');

        expect(group.exists()).toBe(true);
        expect(group.attributes('aria-label')).toBe('Presets');

        const buttons = group.findAll('button');

        expect(buttons.map((button) => button.text())).toEqual(['Last 7 days', 'This month', 'This year']);
        buttons.forEach((button) => expect(button.attributes('type')).toBe('button'));
    });

    it('emits one atomic update with both keys per preset click', async () => {
        const wrapper = mountRange({ modelValue: { from: '2025-06-01' } });
        const buttons = wrapper.find('[role="group"]').findAll('button');

        await buttons[0]!.trigger('click');
        await buttons[1]!.trigger('click');
        await buttons[2]!.trigger('click');

        expect(emitted(wrapper)).toEqual([
            { from: '2026-01-25', to: '2026-01-31' },
            { from: '2026-01-01', to: '2026-01-31' },
            { from: '2026-01-01', to: '2026-12-31' },
        ]);
    });

    it('marks the preset matching the model with aria-pressed', async () => {
        const wrapper = mountRange({ modelValue: { from: '2026-01-01', to: '2026-01-31' } });
        let buttons = wrapper.find('[role="group"]').findAll('button');

        expect(buttons.map((button) => button.attributes('aria-pressed'))).toEqual(['false', 'true', 'false']);

        await wrapper.setProps({ modelValue: { from: '2026-01-01' } });
        buttons = wrapper.find('[role="group"]').findAll('button');

        expect(buttons.map((button) => button.attributes('aria-pressed'))).toEqual(['false', 'false', 'false']);
    });

    it('accepts `now` as a function', async () => {
        const wrapper = mountRange({ now: () => new Date(2026, 4, 15) });

        await wrapper.find('[role="group"]').findAll('button')[1]!.trigger('click');

        expect(emitted(wrapper)).toEqual([{ from: '2026-05-01', to: '2026-05-31' }]);
    });

    it('renders custom presets', async () => {
        const presets: DateRangePreset[] = [{
            key: 'q1',
            label: 'Q1',
            resolve: (now) => ({ from: `${now.getFullYear()}-01-01`, to: `${now.getFullYear()}-03-31` }),
        }];
        const wrapper = mountRange({ presets });
        const buttons = wrapper.find('[role="group"]').findAll('button');

        expect(buttons.map((button) => button.text())).toEqual(['Q1']);

        await buttons[0]!.trigger('click');
        expect(emitted(wrapper)).toEqual([{ from: '2026-01-01', to: '2026-03-31' }]);
    });

    it('hides the preset group for an empty presets array', () => {
        const wrapper = mountRange({ presets: [] });

        expect(wrapper.find('[role="group"]').exists()).toBe(false);
        expect(wrapper.findAll('button')).toHaveLength(0);
    });

    it('disables inputs and preset buttons', async () => {
        const wrapper = mountRange({ disabled: true });
        const { from, to } = inputs(wrapper);

        expect(from.attributes('disabled')).toBeDefined();
        expect(to.attributes('disabled')).toBeDefined();

        const buttons = wrapper.findAll('button');

        buttons.forEach((button) => expect(button.attributes('disabled')).toBeDefined());

        await buttons[0]!.trigger('click');
        expect(emitted(wrapper)).toEqual([]);
    });

    it('resolves labels from props, then global defaults', () => {
        const wrapper = mountRange({ fromLabel: 'Start' }, {
            formDateRange: {
                fromLabel: 'Von',
                toLabel: 'Bis',
                presetsLabel: 'Schnellauswahl',
                last7DaysLabel: 'Letzte 7 Tage',
                thisMonthLabel: 'Dieser Monat',
                thisYearLabel: 'Dieses Jahr',
            },
        });

        expect(wrapper.findAll('label').map((label) => label.text())).toEqual(['Start', 'Bis']);

        const group = wrapper.find('[role="group"]');

        expect(group.attributes('aria-label')).toBe('Schnellauswahl');
        expect(group.findAll('button').map((button) => button.text()))
            .toEqual(['Letzte 7 Tage', 'Dieser Monat', 'Dieses Jahr']);
    });

    it('applies the active preset class and theme classes', () => {
        const wrapper = mountRange({
            modelValue: { from: '2026-01-01', to: '2026-12-31' },
            themeClass: { root: 'r', presetActive: 'is-on' },
        });

        expect(wrapper.classes()).toContain('r');

        const buttons = wrapper.find('[role="group"]').findAll('button');

        expect(buttons[2]!.classes()).toContain('is-on');
        expect(buttons[0]!.classes()).not.toContain('is-on');
    });
});
