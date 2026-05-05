// @vitest-environment jsdom
import { COLOR_PALETTE_STYLE_ELEMENT_ID } from '@vuecs/design';
import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';

describe('useColorPalette (localStorage-backed)', () => {
    beforeEach(() => {
        localStorage.clear();
        document.getElementById(COLOR_PALETTE_STYLE_ELEMENT_ID)?.remove();
    });

    it('drops unknown scales and non-Tailwind palette names from persisted JSON', async () => {
        // Tamper with localStorage before the composable mounts.
        localStorage.setItem(
            'vc-color-palette',
            JSON.stringify({
                primary: 'green',
                bogus: 'totally-fake',
                neutral: 'not-a-palette',
            }),
        );
        // Fresh module import per spec — createSharedComposable caches the result.
        const { useColorPalette } = await import('../../src/use-color-palette');
        const { current } = useColorPalette();
        expect(current.value).toEqual({ primary: 'green' });
    });
});
