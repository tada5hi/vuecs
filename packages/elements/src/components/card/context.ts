import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { VariantValues } from '@vuecs/core';

/**
 * Context shared from `<VCCard>` to its descendant parts so that the
 * variant axes applied to the root (notably `padding`) propagate
 * automatically to header / body / footer / title / description without
 * the consumer repeating the prop on every child. Per-instance values
 * on a child still win over inherited ones.
 *
 * Optional — children render bare when mounted outside `<VCCard>` (for
 * unit tests or ad-hoc composition).
 */
export type CardContext = {
    themeVariant: () => VariantValues | undefined;
};

const CARD_CONTEXT_KEY: InjectionKey<CardContext> = Symbol('vcCardContext');

export function provideCardContext(ctx: CardContext): void {
    provide(CARD_CONTEXT_KEY, ctx);
}

export function useCardContext(): CardContext | null {
    return inject(CARD_CONTEXT_KEY, null);
}
