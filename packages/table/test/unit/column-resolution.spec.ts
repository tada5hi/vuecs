import { describe, expect, it } from 'vitest';
import {
    filterRowClickEvent,
    normalizeColumns,
    resolveCellValue,
    startCase,
} from '../../src/utils/render-utils';

describe('startCase', () => {
    it('snake_case → Title Case', () => {
        expect(startCase('first_name')).toBe('First Name');
    });
    it('kebab-case → Title Case', () => {
        expect(startCase('first-name')).toBe('First Name');
    });
    it('camelCase → Title Case', () => {
        expect(startCase('firstName')).toBe('First Name');
    });
    it('single word capitalized', () => {
        expect(startCase('email')).toBe('Email');
    });
});

describe('normalizeColumns', () => {
    it('bare-string shorthand normalizes to { key, label }', () => {
        expect(normalizeColumns(['id', 'name'], [])).toEqual([
            { key: 'id', label: 'Id' },
            { key: 'name', label: 'Name' },
        ]);
    });

    it('explicit object keeps its label', () => {
        const cols = normalizeColumns([{ key: 'name', label: 'User name' }], []);
        expect(cols[0].label).toBe('User name');
    });

    it('explicit object without label gets startCase(key)', () => {
        const cols = normalizeColumns([{ key: 'firstName' }], []);
        expect(cols[0].label).toBe('First Name');
    });

    it('auto-derives from Object.keys(data[0]) when columns omitted', () => {
        const cols = normalizeColumns(undefined, [{
            id: 1, 
            name: 'Alice', 
            email: 'a@x', 
        }]);
        expect(cols.map((c) => c.key)).toEqual(['id', 'name', 'email']);
    });

    it('auto-derive skips underscore-prefixed row-meta keys', () => {
        const cols = normalizeColumns(undefined, [{
            id: 1, 
            name: 'Alice', 
            _rowVariant: 'success', 
        }]);
        expect(cols.map((c) => c.key)).toEqual(['id', 'name']);
    });

    it('returns [] when columns empty AND data empty', () => {
        expect(normalizeColumns(undefined, [])).toEqual([]);
    });
});

describe('resolveCellValue', () => {
    it('direct row[key] when no accessor', () => {
        const row = { name: 'Alice' };
        expect(resolveCellValue({ key: 'name' }, row)).toBe('Alice');
    });

    it('string accessor with dot-path traverses nested objects', () => {
        const row = { profile: { email: 'a@x' } };
        expect(resolveCellValue({ key: 'email', accessor: 'profile.email' }, row)).toBe('a@x');
    });

    it('function accessor invoked with row', () => {
        const row = { first: 'Alice', last: 'Liddell' };
        const full = resolveCellValue({
            key: 'full',
            accessor: (r: typeof row) => `${r.first} ${r.last}`,
        }, row);
        expect(full).toBe('Alice Liddell');
    });

    it('returns undefined for missing dot-path segments', () => {
        expect(resolveCellValue({ key: 'x', accessor: 'a.b.c' }, { a: {} })).toBeUndefined();
    });
});

describe('filterRowClickEvent', () => {
    function setup(html: string) {
        document.body.innerHTML = `<table><tbody><tr id="row">${html}</tr></tbody></table>`;
        return document.getElementById('row')!;
    }

    it('returns false for plain text clicks', () => {
        const row = setup('<td>plain</td>');
        const event = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(event, 'target', { value: row.firstChild });
        expect(filterRowClickEvent(event)).toBe(false);
    });

    it('returns true when origin is a button', () => {
        setup('<td><button id="btn">go</button></td>');
        const event = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(event, 'target', { value: document.getElementById('btn') });
        expect(filterRowClickEvent(event)).toBe(true);
    });

    it('returns true when origin is text inside an anchor', () => {
        setup('<td><a href="/x"><span id="t">go</span></a></td>');
        const event = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(event, 'target', { value: document.getElementById('t') });
        expect(filterRowClickEvent(event)).toBe(true);
    });

    it('returns true when origin is a label[for]', () => {
        setup('<td><label for="cb" id="lbl">x</label></td>');
        const event = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(event, 'target', { value: document.getElementById('lbl') });
        expect(filterRowClickEvent(event)).toBe(true);
    });

    it('returns true when click is inside a portalled overlay', () => {
        document.body.innerHTML = '<div class="vc-overlay-portal-content"><span id="x">i</span></div>';
        const event = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(event, 'target', { value: document.getElementById('x') });
        expect(filterRowClickEvent(event)).toBe(true);
    });
});
