import { isNavigationItem } from '../../../src/core/check';

describe('src/components/navigation/utils/check.ts', () => {
    it('should identify unknown value correctly', () => {
        let value : any = {
            id: 'default',
        };

        expect(isNavigationItem(value)).toBeTruthy();

        value = {
            url: '/',
        };

        expect(isNavigationItem(value)).toBeTruthy();
    });

    it('should not identify unknown value correctly', () => {
        let value : any = {
            id: true,
        };

        expect(isNavigationItem(value)).toBeFalsy();

        value = {
            url: null,
        };

        expect(isNavigationItem(value)).toBeFalsy();

        value = 1;

        expect(isNavigationItem(value)).toBeFalsy();

        value = true;

        expect(isNavigationItem(value)).toBeFalsy();
    });
});
