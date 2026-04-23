import type { ClassesMergeFn, Theme } from '@vuecs/core';
import { twMerge } from 'tailwind-merge';

export const merge: ClassesMergeFn = (base, override) => twMerge(base, override);

export default function tailwindTheme(): Theme {
    return {
        classesMergeFn: merge,
        elements: {
            formGroup: {
                classes: {
                    root: 'flex flex-col gap-1',
                    label: 'text-sm font-medium text-gray-700',
                    hint: 'text-xs text-gray-500',
                    validationError: 'text-xs text-red-600',
                    validationWarning: 'text-xs text-yellow-600',
                },
            },
            formInput: {
                classes: {
                    root: 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50',
                    group: 'flex items-stretch',
                    groupAppend: 'inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600',
                    groupPrepend: 'inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600',
                },
            },
            formInputCheckbox: {
                classes: {
                    root: 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-1 focus:ring-blue-500',
                    label: 'ml-2 text-sm text-gray-700',
                    group: 'flex items-center',
                },
            },
            formSelect: { classes: { root: 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50' } },
            formSubmit: {
                classes: {
                    root: 'inline-flex items-center gap-2',
                    createButton: 'inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
                    updateButton: 'inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
                },
            },
            formTextarea: { classes: { root: 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50' } },
            validationGroup: { classes: { item: 'text-xs text-red-600' } },
            list: { classes: { root: 'flex flex-col gap-1' } },
            listHeader: { classes: { root: 'flex items-center' } },
            listFooter: { classes: { root: 'flex items-center' } },
            listBody: { classes: { root: 'm-0 list-none p-0' } },
            listItem: {
                classes: {
                    root: 'flex flex-row items-center gap-2 py-1',
                    iconWrapper: 'inline-flex shrink-0 text-gray-500',
                    textWrapper: 'inline-flex min-w-0 flex-col',
                    actionsWrapper: 'ml-auto inline-flex items-center gap-1',
                    actionsExtraWrapper: 'inline-flex items-center gap-1',
                },
            },
            listLoading: { classes: { root: 'py-2 text-center text-sm text-gray-500' } },
            listNoMore: { classes: { root: 'rounded-md border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-800' } },
            navigation: {
                classes: {
                    group: 'm-0 flex list-none flex-col p-0',
                    item: 'list-none',
                    itemNested: '',
                    separator: 'my-2 text-xs font-semibold uppercase tracking-wide text-gray-400',
                    link: 'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 no-underline hover:bg-gray-100',
                    linkRoot: 'font-medium text-gray-900',
                    linkIcon: 'h-4 w-4 shrink-0',
                    linkText: 'flex-1 truncate',
                },
            },
            pagination: {
                classes: {
                    root: 'inline-flex items-center gap-1',
                    item: 'inline-flex',
                    link: 'inline-flex min-w-8 items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500',
                    linkActive: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
                },
            },
            gravatar: { classes: { root: 'inline-block overflow-hidden rounded-full' } },
        },
    };
}
