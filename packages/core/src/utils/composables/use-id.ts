import { useId as vueUseId } from 'vue';

export function useId(deterministicId?: string | null, prefix: string = 'vc'): string {
    if (deterministicId) {
        return deterministicId;
    }
    const id = vueUseId();
    return prefix ? `${prefix}-${id}` : id;
}
