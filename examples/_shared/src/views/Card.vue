<script setup lang="ts">
import {
    VCCard,
    VCCardBody,
    VCCardDescription,
    VCCardFooter,
    VCCardHeader,
    VCCardTitle,
} from '@vuecs/elements';
import { VCButton } from '@vuecs/button';

withDefaults(defineProps<{
    variant?: 'outline' | 'soft' | 'elevated';
    padding?: 'compact' | 'normal' | 'spacious';
    interactive?: boolean;
}>(), {
    variant: 'outline',
    padding: 'normal',
    interactive: false,
});

const variants = ['outline', 'soft', 'elevated'] as const;
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Static variant grid — full ladder visible at a glance. -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <VCCard
                v-for="v in variants"
                :key="v"
                :variant="v"
            >
                <VCCardHeader>
                    <VCCardTitle>{{ v }} card</VCCardTitle>
                    <VCCardDescription>
                        A {{ v }} variant card.
                    </VCCardDescription>
                </VCCardHeader>
                <VCCardBody>
                    Cards collect related content into a single bounded
                    surface. The variant determines whether the boundary
                    is a border, a shadow, or a tinted background.
                </VCCardBody>
                <VCCardFooter>
                    <VCButton
                        size="sm"
                        variant="ghost"
                    >
                        Cancel
                    </VCButton>
                    <VCButton
                        size="sm"
                        color="primary"
                    >
                        Save
                    </VCButton>
                </VCCardFooter>
            </VCCard>
        </div>

        <!-- Playground card — toolbar-driven. -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                playground
            </span>
            <div style="margin-top: 0.5rem; max-width: 28rem;">
                <VCCard
                    :variant="variant"
                    :padding="padding"
                    :interactive="interactive"
                >
                    <VCCardHeader>
                        <VCCardTitle>Configurable card</VCCardTitle>
                        <VCCardDescription>
                            Drive variant, padding, and interactive via the toolbar.
                        </VCCardDescription>
                    </VCCardHeader>
                    <VCCardBody>
                        <p style="margin: 0;">
                            The padding axis propagates from
                            <code>&lt;VCCard&gt;</code> through context to
                            each band. The interactive axis adds hover
                            and focus-within styling.
                        </p>
                    </VCCardBody>
                    <VCCardFooter>
                        <VCButton size="sm">
                            Action
                        </VCButton>
                    </VCCardFooter>
                </VCCard>
            </div>
        </div>

        <!-- Bare card (no inner parts). -->
        <div>
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                bare card
            </span>
            <div style="margin-top: 0.5rem; max-width: 28rem;">
                <VCCard variant="soft">
                    <VCCardBody>
                        A card with no header / footer — the body fills
                        the whole surface. Useful for static blurbs and
                        single-content panels.
                    </VCCardBody>
                </VCCard>
            </div>
        </div>
    </div>
</template>
