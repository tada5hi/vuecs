/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ComponentsOptions } from '../type';

export const fontAwesome : ComponentsOptions = {
    formSubmit: {
        createIconClass: 'fa fa-plus',
        updateIconClass: 'fa fa-save',
    },
    itemActionToggle: {
        childDisabledClass: 'fa fa-plus',
        childEnabledClass: 'fa fa-minus',
    },
    listActionRefresh: {
        iconClass: 'fa fa-refresh',
    },
    listItem: {
        iconClass: 'fa fa-bars',
    },
    listTitle: {
        iconClass: 'fa fa-bars',
    },
    pagination: {
        prevClass: 'fa-solid fa-chevron-left',
        nextClass: 'fa-solid fa-chevron-right',
    },
};
