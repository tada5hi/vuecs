import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { buildListBaseSlotProps } from '../../src/components/list-base/slot-props';

describe('buildListBaseSlotProps', () => {
    it('should include busy, meta, total, load when provided', () => {
        const load = vi.fn();
        const props = buildListBaseSlotProps({
            busy: true,
            meta: { page: 1 },
            total: 10,
            load,
        });

        expect(props.busy).toBe(true);
        expect(props.meta).toEqual({ page: 1 });
        expect(props.total).toBe(10);
        expect(props.load).toBe(load);
    });

    it('should omit falsy optional fields', () => {
        const props = buildListBaseSlotProps({});

        expect(props.busy).toBeUndefined();
        expect(props.meta).toBeUndefined();
        expect(props.total).toBeUndefined();
        expect(props.load).toBeUndefined();
    });

    it('should always provide created, deleted, updated callbacks', () => {
        const props = buildListBaseSlotProps({});

        expect(typeof props.created).toBe('function');
        expect(typeof props.deleted).toBe('function');
        expect(typeof props.updated).toBe('function');
    });

    describe('created callback', () => {
        it('should call onCreated when no data provided', () => {
            const onCreated = vi.fn();
            const props = buildListBaseSlotProps({ onCreated });

            props.created!({ id: 1, name: 'new' });

            expect(onCreated).toHaveBeenCalledWith({ id: 1, name: 'new' });
        });

        it('should call onCreated when item is not in data array (matched by id)', () => {
            const onCreated = vi.fn();
            const data = [{ id: 1, name: 'existing' }];
            const props = buildListBaseSlotProps({ data, onCreated });

            props.created!({ id: 2, name: 'new' });

            expect(onCreated).toHaveBeenCalledWith({ id: 2, name: 'new' });
        });

        it('should NOT call onCreated when item already exists in data (matched by id)', () => {
            const onCreated = vi.fn();
            const data = [{ id: 1, name: 'existing' }];
            const props = buildListBaseSlotProps({ data, onCreated });

            props.created!({ id: 1, name: 'duplicate' });

            expect(onCreated).not.toHaveBeenCalled();
        });

        it('should not throw when onCreated is not provided', () => {
            const props = buildListBaseSlotProps({ data: [] });

            expect(() => props.created!({ id: 1 })).not.toThrow();
        });

        it('should use itemId for matching when provided', () => {
            const onCreated = vi.fn();
            const data = [{ uuid: 'abc', name: 'existing' }];
            const itemId = (item: any) => item.uuid;
            const props = buildListBaseSlotProps({
                data, 
                onCreated, 
                itemId, 
            });

            props.created!({ uuid: 'abc', name: 'duplicate' });
            expect(onCreated).not.toHaveBeenCalled();

            props.created!({ uuid: 'xyz', name: 'new' });
            expect(onCreated).toHaveBeenCalledWith({ uuid: 'xyz', name: 'new' });
        });

        it('should use itemKey string for matching', () => {
            const onCreated = vi.fn();
            const data = [{ code: 'A' }];
            const props = buildListBaseSlotProps({
                data,
                onCreated,
                itemKey: 'code' as any,
            });

            props.created!({ code: 'A' });
            expect(onCreated).not.toHaveBeenCalled();
        });

        it('should use itemKey function for matching', () => {
            const onCreated = vi.fn();
            const data = [{ code: 'A' }];
            const itemKey = () => 'code' as any;
            const props = buildListBaseSlotProps({
                data, 
                onCreated, 
                itemKey, 
            });

            props.created!({ code: 'A' });
            expect(onCreated).not.toHaveBeenCalled();
        });
    });

    describe('deleted callback', () => {
        it('should call onDeleted with the item', () => {
            const onDeleted = vi.fn();
            const data = [{ id: 1, name: 'item' }];
            const props = buildListBaseSlotProps({ data, onDeleted });

            props.deleted!({ id: 1, name: 'item' });

            expect(onDeleted).toHaveBeenCalledWith({ id: 1, name: 'item' });
        });

        it('should call onDeleted with data item when deleted is called with undefined', () => {
            const onDeleted = vi.fn();
            const singleItem = { id: 1, name: 'single' };
            const props = buildListBaseSlotProps({ data: singleItem as any, onDeleted });

            props.deleted!(undefined as any);

            expect(onDeleted).toHaveBeenCalledWith(singleItem);
        });

        it('should not throw when onDeleted is not provided', () => {
            const props = buildListBaseSlotProps({ data: [] });

            expect(() => props.deleted!({ id: 1 })).not.toThrow();
        });
    });

    describe('updated callback', () => {
        it('should call onUpdated with merged item when item exists in data', () => {
            const onUpdated = vi.fn();
            const data = [{
                id: 1,
                name: 'old',
                extra: 'kept',
            }];
            const props = buildListBaseSlotProps({ data, onUpdated });

            props.updated!({ id: 1, name: 'new' });

            expect(onUpdated).toHaveBeenCalled();
            const mergedItem = onUpdated.mock.calls[0][0];
            expect(mergedItem.name).toBe('new');
            expect(mergedItem.extra).toBe('kept');
        });

        it('should NOT call onUpdated when item has id but is not found in data', () => {
            const onUpdated = vi.fn();
            const data = [{ id: 1, name: 'existing' }];
            const props = buildListBaseSlotProps({ data, onUpdated });

            props.updated!({ id: 99, name: 'unknown' });

            expect(onUpdated).not.toHaveBeenCalled();
        });

        it('should call onUpdated directly when items have no id field', () => {
            const onUpdated = vi.fn();
            const data = [{ name: 'existing' }];
            const props = buildListBaseSlotProps({ data, onUpdated });

            props.updated!({ name: 'new' });

            expect(onUpdated).toHaveBeenCalledWith({ name: 'new' });
        });

        it('should merge with single data object (non-array)', () => {
            const onUpdated = vi.fn();
            const data = {
                id: 1, 
                name: 'old', 
                extra: 'kept', 
            };
            const props = buildListBaseSlotProps({ data: data as any, onUpdated });

            props.updated!({ id: 1, name: 'new' });

            const mergedItem = onUpdated.mock.calls[0][0];
            expect(mergedItem.name).toBe('new');
            expect(mergedItem.extra).toBe('kept');
        });

        it('should not throw when onUpdated is not provided', () => {
            const props = buildListBaseSlotProps({ data: [] });

            expect(() => props.updated!({ id: 1 })).not.toThrow();
        });
    });
});
