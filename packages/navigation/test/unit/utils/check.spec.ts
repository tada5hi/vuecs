/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isNavigationElement } from '../../../src/core/check';

describe('src/components/navigation/utils/check.ts', () => {
    it('should identify unknown value correctly', () => {
        let value : any = {
            id: 'default',
        };

        expect(isNavigationElement(value)).toBeTruthy();

        value = {
            url: '/',
        };

        expect(isNavigationElement(value)).toBeTruthy();
    });

    it('should not identify unknown value correctly', () => {
        let value : any = {
            id: true,
        };

        expect(isNavigationElement(value)).toBeFalsy();

        value = {
            url: null,
        };

        expect(isNavigationElement(value)).toBeFalsy();

        value = 1;

        expect(isNavigationElement(value)).toBeFalsy();

        value = true;

        expect(isNavigationElement(value)).toBeFalsy();
    });
});
