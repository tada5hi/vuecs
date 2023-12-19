import type { NavigationItem } from '../../../src';
import { setNavigationExpansion } from '../../../src/core';

describe('src/components/navigation/utils/toggle.ts', () => {
    it('should expand navigation correctly', () => {
        const items : NavigationItem[] = [
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
