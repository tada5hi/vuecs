import { expectTypeOf, test } from 'vitest';
import { defineDataCollection } from '@vuecs/data';
import type { TableCardPropsGeneric } from '../../dist';

// Structural guard for binding a `@vuecs/data` collection to the card.
// `@vuecs/table-card` takes NO runtime dependency on `@vuecs/data`; the
// binding (`:data="users.data.value" :busy="users.loading.value"
// :total="users.total.value"`) only holds by shape, so pin it against the
// published declarations of both packages.

type User = { id: number; name: string };

test('a DataCollection result binds to the card props', () => {
    const users = defineDataCollection({
        load: async () => ({ data: [] as User[], total: 0 }),
        autoLoad: false,
    });

    const props: TableCardPropsGeneric<User> = {
        data: users.data.value,
        busy: users.loading.value,
        total: users.total.value,
    };

    expectTypeOf(props.data).toEqualTypeOf<User[] | undefined>();

    // @ts-expect-error — a mismatched row type must NOT be assignable.
    const wrong: TableCardPropsGeneric<{ other: boolean }> = { data: users.data.value };

    void [props, wrong];
});
