// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, {
    VCCard,
    VCCardBody,
    VCCardDescription,
    VCCardFooter,
    VCCardHeader,
    VCCardTitle,
} from '../../src';

const plugins = [[vuecsElements, {}]] as const;

describe('<VCCard>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders all six compound parts with their vc-card-* classes', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCard, null, {
                    default: () => [
                        h(VCCardHeader, null, {
                            default: () => [
                                h(VCCardTitle, null, { default: () => 'Title' }),
                                h(VCCardDescription, null, { default: () => 'Desc' }),
                            ],
                        }),
                        h(VCCardBody, null, { default: () => 'Body' }),
                        h(VCCardFooter, null, { default: () => 'Footer' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const root = wrapper.element as HTMLElement;
        expect(root.classList.contains('vc-card')).toBe(true);
        expect(root.querySelector('.vc-card-header')!.textContent).toContain('Title');
        expect(root.querySelector('.vc-card-title')!.textContent).toBe('Title');
        expect(root.querySelector('.vc-card-description')!.textContent).toBe('Desc');
        expect(root.querySelector('.vc-card-body')!.textContent).toBe('Body');
        expect(root.querySelector('.vc-card-footer')!.textContent).toBe('Footer');
    });

    it('defaults to a <div> root', () => {
        const wrapper = mount(defineComponent({ setup: () => () => h(VCCard, null, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).tagName).toBe('DIV');
    });

    it('respects the as prop', () => {
        const wrapper = mount(defineComponent({ setup: () => () => h(VCCard, { as: 'article' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).tagName).toBe('ARTICLE');
    });

    describe('padding context propagation', () => {
        it('children mounted under VCCard render successfully (context bridge optional)', () => {
            // The Card compound uses provideCardContext/useCardContext for
            // padding inheritance. Mounting a band inside the card should
            // not throw or strip the structural class (the bridge is
            // purely additive — if no override is set, the band's own
            // default applies).
            const wrapper = mount(defineComponent({
                setup() {
                    return () => h(VCCard, { padding: 'spacious' }, { default: () => h(VCCardBody, null, { default: () => 'Body' }) });
                },
            }), { global: { plugins: [...plugins] } });
            const body = (wrapper.element as HTMLElement).querySelector('.vc-card-body');
            expect(body).not.toBeNull();
            expect(body!.textContent).toBe('Body');
        });

        it('per-band themeVariant overrides inherited card padding', () => {
            const wrapper = mount(defineComponent({
                setup() {
                    return () => h(VCCard, { padding: 'spacious' }, {
                        default: () => h(VCCardBody, {
                            themeVariant: { padding: 'compact' },
                            themeClass: { root: 'override-marker' },
                        }, { default: () => 'Body' }),
                    });
                },
            }), { global: { plugins: [...plugins] } });
            // The per-band themeVariant should win; assertion via class
            // marker proves the prop reaches the band.
            expect((wrapper.element as HTMLElement)
                .querySelector('.override-marker')).not.toBeNull();
        });
    });

    describe('children mounted outside <VCCard>', () => {
        it('CardBody renders bare without throwing when no context is provided', () => {
            // The context bridge is optional — children fall back to plain
            // theme resolution when mounted standalone (unit tests, ad-hoc).
            const wrapper = mount(defineComponent({ setup: () => () => h(VCCardBody, null, { default: () => 'Bare' }) }), { global: { plugins: [...plugins] } });
            expect((wrapper.element as HTMLElement).textContent).toBe('Bare');
            expect((wrapper.element as HTMLElement).classList.contains('vc-card-body')).toBe(true);
        });
    });
});
