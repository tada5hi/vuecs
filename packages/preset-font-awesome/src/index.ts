import { extend } from '@vuecs/core';
import type { Theme } from '@vuecs/core';

export default function fontAwesomePreset(): Theme {
    return {
        elements: {
            formSubmit: {
                createIcon: extend('fa fa-plus'),
                updateIcon: extend('fa fa-save'),
            },
            listItem: { icon: extend('fa fa-bars') },
            pagination: {
                prevIcon: extend('fa-solid fa-chevron-left'),
                nextIcon: extend('fa-solid fa-chevron-right'),
            },
        },
    };
}
