/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationManager } from '../../src';

describe('navigation-manager', () => {
    it('should build simple navigation', async () => {
        const manager = new NavigationManager({
            items: [
                { name: 'Home', url: '/' },
                { name: 'foo', url: '/foo' },
            ],
        });

        const items = await manager.build({ path: '/foo' });
        expect(items).toHaveLength(2);

        const [home, foo] = items;

        expect(home.url).toEqual('/');
        expect(home.active).toBeFalsy();

        expect(foo.url).toEqual('/foo');
        expect(foo.active).toBeTruthy();
    });
});
