import type { NavigationItem } from '../../../src';
import { flattenNestedNavigationItems } from '../../../src';

describe('src/components/navigation/utils/flatten.ts', () => {
    it('should flatten components', () => {
        const components : NavigationItem[] = [
            { name: 'Component A' },
            { name: 'Component B' },
        ];

        expect(flattenNestedNavigationItems(components)).toEqual(components);
    });

    it('should flatten nested components', () => {
        const components : NavigationItem[] = [
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

        expect(flattenNestedNavigationItems(components)).toEqual([
            { name: 'Component A' },
            { name: 'Component A.1' },
            { name: 'Component A.2' },
            { name: 'Component B' },
            { name: 'Component B.1' },
            { name: 'Component B.1.1' },
        ] as NavigationItem[]);
    });
});
