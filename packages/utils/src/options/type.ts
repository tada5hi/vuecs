/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    FormBaseOptions, FormGroupOptions,
    FormInputBuildOptions,
    FormSelectBuildOptions,
    FormSubmitOptions,
    FormTextareaBuildOptions, ItemActionToggleOptions,
    ListActionRefreshBuildOptions,
    ListBaseOptions,
    ListHeaderBuildOptions,
    ListItemBuildOptions,
    ListItemsBuildOptions,
    ListNoMoreBuildOptions,
    ListPaginationBuildOptions,
    ListSearchBuildOptions,
    ListTitleBuildOptions,
    PaginationOptions,
} from '../components';
import { ListBuildOptions } from '../components/list';
import { Component } from './constants';

export type OptionPresetValueContext<V> = {
    enabled?: boolean,
    value?: V
};
export type OptionPresetsValueContext<V> = {
    [key: string]: OptionPresetValueContext<V>
};

export type OptionValueBuildContext<
    C extends Component | `${Component}`,
    K extends keyof ComponentOptions<C>> = {
        component: C,
        key: K,
        alt?: ComponentOptions<C>[K],
        value?: ComponentOptions<C>[K],
        preset?: OptionPresetsValueContext<ComponentOptions<C>[K]>
    };

export type ComponentFormOptions<C extends Component | `${Component}`> =
    C extends Component.FormBase | `${Component.FormBase}` ?
        FormBaseOptions :
        C extends Component.FormGroup | `${Component.FormGroup}` ?
            FormGroupOptions :
            C extends Component.FormInput | `${Component.FormInput}` ?
                FormInputBuildOptions :
                C extends Component.FormSelect | `${Component.FormSelect}` ?
                    FormSelectBuildOptions :
                    C extends Component.FormSubmit | `${Component.FormSubmit}` ?
                        FormSubmitOptions :
                        C extends Component.FormTextarea | `${Component.FormTextarea}` ?
                            FormTextareaBuildOptions :
                            {};

export type ComponentItemOptions<C extends Component | `${Component}`> =
    C extends Component.ItemActionToggle | `${Component.ItemActionToggle}` ?
        ItemActionToggleOptions<any> :
        { };

export type ComponentSpecialOptions<C extends Component | `${Component}`> =
    C extends Component.Pagination | `${Component.Pagination}` ?
        PaginationOptions :
        { };

export type ComponentListOptions<C extends Component | `${Component}`> =
    C extends Component.ListBase | `${Component.ListBase}` ?
        ListBaseOptions :
        C extends Component.List | `${Component.List}` ?
            ListBuildOptions<any> :
            C extends Component.ListActionRefresh | `${Component.ListActionRefresh}` ?
                ListActionRefreshBuildOptions :
                C extends Component.ListHeader | `${Component.ListHeader}` ?
                    ListHeaderBuildOptions :
                    C extends Component.ListItems | `${Component.ListItems}` ?
                        ListItemsBuildOptions<any> :
                        C extends Component.ListItem | `${Component.ListItem}` ?
                            ListItemBuildOptions<any> :
                            C extends Component.ListNoMore | `${Component.ListNoMore}` ?
                                ListNoMoreBuildOptions<any> :
                                C extends Component.ListPagination | `${Component.ListPagination}` ?
                                    ListPaginationBuildOptions<any> :
                                    C extends Component.ListSearch | `${Component.ListSearch}` ?
                                        ListSearchBuildOptions :
                                        C extends Component.ListTitle | `${Component.ListTitle}` ?
                                            ListTitleBuildOptions :
                                            { };

export type ComponentOptions<C extends Component | `${Component}`> = ComponentFormOptions<C> &
ComponentItemOptions<C> &
ComponentListOptions<C> &
ComponentSpecialOptions<C>;
