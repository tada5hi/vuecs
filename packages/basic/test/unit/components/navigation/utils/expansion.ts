/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationElement } from '../../../../../src';
import { setNavigationExpansion } from '../../../../../src';

describe('src/components/navigation/utils/toggle.ts', () => {
    it('should expand navigation correctly', () => {
        const items : NavigationElement[] = [
            {
                name: 'Benutzer',
                type: 'link',
                url: '/admin/users',
            },
            {
                name: 'Allgemein',
                type: 'link',
                components: [
                    {
                        name: 'xxx',
                        type: 'link',
                        url: '/admin/xxx',
                    },
                ],
            },
            {
                name: 'aaa',
                type: 'link',
                url: '/admin/aaa',
            },
        ];

        const { items: components } = setNavigationExpansion(items, {
            url: '/admin/users',
        }, true);

        const expected = items.map((item) => {
            item.display = false;
            item.displayChildren = false;

            if (item.url === '/admin/user') {
                item.display = true;
                item.displayChildren = true;
            }

            return item;
        });

        expect(components).toEqual(expected);
    });
});
