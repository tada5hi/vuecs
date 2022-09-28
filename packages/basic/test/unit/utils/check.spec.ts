/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isComponent } from '../../../src/utils/check';

describe('src/utils/check.ts', () => {
    it('should identify unknown value correctly', () => {
        let value : any = {
            id: 'default',
        };

        expect(isComponent(value)).toBeTruthy();

        value = {
            url: '/',
        };

        expect(isComponent(value)).toBeTruthy();
    });

    it('should not identify unknown value correctly', () => {
        let value : any = {
            id: true,
        };

        expect(isComponent(value)).toBeFalsy();

        value = {
            url: null,
        };

        expect(isComponent(value)).toBeFalsy();

        value = 1;

        expect(isComponent(value)).toBeFalsy();

        value = true;

        expect(isComponent(value)).toBeFalsy();
    });
});
