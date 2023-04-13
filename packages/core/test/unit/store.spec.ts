/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Store } from '../../src';

describe('src/store', () => {
    it('should set multiple group options', () => {
        const store = new Store();
        store.setAll({
            foo: {
                bar: 1,
            },
            baz: {
                boz: 2,
            },
        });

        expect(store.hasOptions('foo')).toBeTruthy();
        expect(store.hasOptions('baz')).toBeTruthy();
        expect(store.hasOptions('boz')).toBeFalsy();
    });

    it('should set single group options', () => {
        const store = new Store();
        store.setOptions('foo', {
            bar: 1,
        });

        expect(store.hasOptions('foo')).toBeTruthy();
    });

    it('should get single option of a group', () => {
        const store = new Store();
        store.setOptions('foo', {
            bar: 1,
        });

        expect(store.getOption('foo', 'bar')).toEqual(1);
    });

    it('should get multiple options of a group', () => {
        const store = new Store();
        store.setOptions('foo', {
            bar: 1,
        });

        expect(store.getOptions('foo')).toEqual({ bar: 1 });
    });
});
