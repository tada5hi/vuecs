/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isComponentMatch } from '../../src';

describe('src/utils.ts', () => {
    it('should match correctly', () => {
        const isMatch = isComponentMatch({
            url: '/admin/users',
        }, {
            name: 'Allgemein',
            type: 'link',
            components: [
                {
                    name: 'xxx',
                    type: 'link',
                    url: '/admin/xxx',
                },
            ],
        });

        expect(isMatch).toEqual(false);
    });
});
