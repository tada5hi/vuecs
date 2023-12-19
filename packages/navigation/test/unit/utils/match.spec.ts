import { isNavigationItemMatch } from '../../../src/core';

describe('src/components/navigation/utils.ts', () => {
    it('should match correctly', () => {
        const isMatch = isNavigationItemMatch({
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
