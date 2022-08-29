/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    ListActionRefreshBuildOptions,
    ListBaseOptions,
    ListHeaderBuildOptions,
    ListItemsBuildOptions,
    ListNoMoreBuildOptions,
    ListPaginationBuildOptions,
    ListTitleBuildOptions,
} from '../../components';
import { ListItemBuildOptions } from '../../components/list/item/type';
import { ListSearchBuildOptions } from '../../components/list/search/type';
import { VNodeClass, VNodeProperties } from '../../type';
import { Component } from './constants';

export type ComponentConfig = {
    paginationClass?: VNodeClass,
    paginationProps?: VNodeProperties,
    paginationItemClass?: VNodeClass,
    paginationLinkClass?: VNodeClass,
    paginationLinkActiveClass?: string,

    inputGroupClass?: VNodeClass,
    inputGroupProps?: VNodeProperties,
    inputGroupAppendClass?: VNodeClass,
    inputGroupAppendProps?: VNodeProperties,
    inputGroupPrependClass?: VNodeClass,
    inputGroupPrependProps?: VNodeProperties,
    inputGroupTextClass?: VNodeClass,
    inputGroupTextProps?: VNodeProperties,

    inputClass?: VNodeClass,
    inputProps?: VNodeProperties,

    selectClass?: VNodeClass,
    selectProps?: VNodeProperties,

    textareaClass?: VNodeClass,
    textareaProps?: VNodeProperties,

    formGroupClass?: VNodeClass,
    formGroupProps?: VNodeProperties,
    formGroupErrorClass?: VNodeClass,
    formGroupWarningClass?: VNodeClass,

    submitButtonClass?: VNodeClass,
    submitButtonProps?: VNodeProperties,
    submitUpdateButtonClass?: VNodeClass,
    submitUpdateIconClass?: VNodeClass,
    submitCreateButtonClass?: VNodeClass,
    submitCreateIconClass?: VNodeClass,

    itemActionToggleClass?: VNodeClass,
    itemActionToggleEnabledButtonClass?: VNodeClass,
    itemActionToggleEnabledIconClass?: VNodeClass,
    itemActionToggleDisabledButtonClass?: VNodeClass,
    itemActionToggleDisabledIconClass?: VNodeClass,
};

export type ComponentListOptions<C extends Component | `${Component}`> =
    C extends Component.ListBase | `${Component.ListBase}` ?
        ListBaseOptions :
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
                                        ListTitleBuildOptions<any> :
                                        Record<string, never>;

export type ComponentOptions<C extends Component | `${Component}`> =
    ComponentListOptions<C>;
