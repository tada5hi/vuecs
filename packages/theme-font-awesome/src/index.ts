import { extend } from '@vuecs/core';
import type { Theme } from '@vuecs/core';

export default function fontAwesomeTheme(): Theme {
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
                    firstIcon: extend('fa-solid fa-angles-left'),
                    lastIcon: extend('fa-solid fa-angles-right'),
                },
            },
        },
    };
}
