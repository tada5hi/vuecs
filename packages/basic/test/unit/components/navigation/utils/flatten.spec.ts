/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationElement, flattenNestedNavigationElements } from '../../../../../src';

describe('src/components/navigation/utils/flatten.ts', () => {
    it('should flatten components', () => {
        const components : NavigationElement[] = [
            { name: 'Component A' },
            { name: 'Component B' },
        ];

        expect(flattenNestedNavigationElements(components)).toEqual(components);
    });

    it('should flatten nested components', () => {
        const components : NavigationElement[] = [
            {
                name: 'Component A',
                children: [
                    { name: 'Component A.1' },
                    { name: 'Component A.2' },
                ],
            },
            {
                name: 'Component B',
                children: [
                    {
                        name: 'Component B.1',
                        children: [
                            {
                                name: 'Component B.1.1',
                            },
                        ],
                    },
                ],
            },
        ];

        expect(flattenNestedNavigationElements(components)).toEqual([
            { name: 'Component A' },
            { name: 'Component A.1' },
            { name: 'Component A.2' },
            { name: 'Component B' },
            { name: 'Component B.1' },
            { name: 'Component B.1.1' },
        ] as NavigationElement[]);
    });
});
