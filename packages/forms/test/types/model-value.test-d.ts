import { assertType, expectTypeOf, test } from 'vitest';
import type { FormInputProps, VCFormInput } from '../../dist/components/form-input';
import type { FormTextareaProps, VCFormTextarea } from '../../dist/components/form-textarea';

// Regression guard for #1613. `modelValue` carries no `default` on purpose so
// vue-tsc keeps it out of the emitted `DefaultProps`; otherwise the default's
// literal type narrows `$props['modelValue']` back down to `string` and breaks
// v-model against nullable entity fields. This pins both the component-instance
// `$props` path (what v-model actually reads) AND the public prop-type exports.
//
// The bug regressed once already (fixed in #1610/#1611, re-broke in 5.0.1) and
// it lives purely in the EMITTED declaration files — type-checking the source
// `.vue` doesn't reproduce it. So the guard deliberately imports from `dist`
// (built by `build:types`, which the package's `test` script runs first).
//
// These assertions are run under a strictNullChecks-on tsconfig
// (`test/tsconfig.json`, wired via vitest.config.ts). The project's base config
// leaves strict off, under which `null` is assignable to every type — so the
// `null` assertions below would pass vacuously and the guard would never fail.

type InputModel = InstanceType<typeof VCFormInput>['$props']['modelValue'];
type TextareaModel = InstanceType<typeof VCFormTextarea>['$props']['modelValue'];

test('VCFormInput modelValue accepts string | null | undefined via $props (#1613)', () => {
    assertType<InputModel>('a string');
    assertType<InputModel>(null);
    assertType<InputModel>(undefined);

    // Proves the type did not collapse to `any` (which would make the
    // assignability assertions above vacuously pass).
    expectTypeOf<InputModel>().not.toBeAny();
    // @ts-expect-error a number is not a valid modelValue
    assertType<InputModel>(123);
});

test('VCFormTextarea modelValue accepts string | null | undefined via $props (#1613)', () => {
    assertType<TextareaModel>('a string');
    assertType<TextareaModel>(null);
    assertType<TextareaModel>(undefined);

    expectTypeOf<TextareaModel>().not.toBeAny();
    // @ts-expect-error a number is not a valid modelValue
    assertType<TextareaModel>(456);
});

test('public prop-type exports keep null assignable to modelValue', () => {
    assertType<FormInputProps['modelValue']>(null);
    assertType<FormTextareaProps['modelValue']>(null);
});
