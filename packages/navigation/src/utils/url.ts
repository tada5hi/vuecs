export function isAbsoluteURL(str: string): boolean {
    return str.substring(0, 7) === 'http://' ||
        str.substring(0, 8) === 'https://';
}
