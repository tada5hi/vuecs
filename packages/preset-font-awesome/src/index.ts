import { extend } from '@vuecs/core';
import type { Theme } from '@vuecs/core';

export default function fontAwesomePreset(): Theme {
    return {
        elements: {
            formSubmit: {
                classes: {
                    createIcon: extend('fa fa-plus'),
                    updateIcon: extend('fa fa-save'),
                },
            },
            listItem: { classes: { icon: extend('fa fa-bars') } },
            pagination: {
                classes: {
                    prevIcon: extend('fa-solid fa-chevron-left'),
                    nextIcon: extend('fa-solid fa-chevron-right'),
                },
            },
        },
    };
}
