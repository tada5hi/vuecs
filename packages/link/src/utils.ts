export function isObject(input: unknown) : input is Record<string, any> {
    return typeof input === 'object' &&
        input !== null &&
        !Array.isArray(input);
}
