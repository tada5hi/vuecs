import { extend } from '@vuecs/core';
import type { Theme } from '@vuecs/core';

export default function fontAwesomeTheme(): Theme {
    return {
        elements: {
            // VCButton has no per-action icon slots — icons are passed at the
            // call site via `iconLeft` / `iconRight`. Consumers using
            // `useSubmitButton` who want the legacy `fa fa-plus` / `fa fa-save`
            // defaults must register them on `submitButton.{createIcon,updateIcon}`
            // through the DefaultsManager (passed to `app.use(vuecs, { defaults })`).
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
