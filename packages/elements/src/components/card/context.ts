import type { CardContext } from './types';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';


const CARD_CONTEXT_KEY: InjectionKey<CardContext> = Symbol('vcCardContext');

export function provideCardContext(ctx: CardContext): void {
    provide(CARD_CONTEXT_KEY, ctx);
}

export function useCardContext(): CardContext | null {
    return inject(CARD_CONTEXT_KEY, null);
}
