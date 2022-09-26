/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Component,
    FormBaseOptions,
    FormGroupOptions,
    FormInputBuildOptions,
    FormInputCheckboxBuildOptions,
    FormSelectBuildOptions,
    FormSubmitOptions,
    FormTextareaBuildOptions,
    ItemActionToggleOptions,
    ListActionRefreshBuildOptions,
    ListBaseOptions,
    ListBuildOptions,
    ListHeaderBuildOptions,
    ListItemBuildOptions,
    ListItemsBuildOptions,
    ListNoMoreBuildOptions,
    ListPaginationBuildOptions,
    ListSearchBuildOptions,
    ListTitleBuildOptions,
    PaginationOptions,
} from '../components';

import { OptionValueConfig } from '../options';
import { MakeOptional } from '../type';

export type ComponentFormOptions<C extends Component | `${Component}`> =
    C extends Component.FormBase | `${Component.FormBase}` ?
        FormBaseOptions :
        C extends Component.FormGroup | `${Component.FormGroup}` ?
            FormGroupOptions :
            C extends Component.FormInput | Component.FormInputText |
                `${Component.FormInput}` | `${Component.FormInputText}` ?
                FormInputBuildOptions :
                C extends Component.FormInputCheckbox | `${Component.FormInputCheckbox}` ?
                    FormInputCheckboxBuildOptions :
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

export type Config = {
    preset: {
        [key: string]: boolean
    },
    component: {
        [C in `${Component}`]?: {
            [O in keyof ComponentOptions<C>]?: MakeOptional<OptionValueConfig<ComponentOptions<C>[O]>, 'value'>
        }
    }
};
