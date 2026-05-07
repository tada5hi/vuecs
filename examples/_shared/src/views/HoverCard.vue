<script setup lang="ts">
import {
    VCHoverCard,
    VCHoverCardArrow,
    VCHoverCardContent,
    VCHoverCardTrigger,
} from '@vuecs/overlays';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();
</script>

<template>
    <p style="margin: 0; max-width: 36rem;">
        Built by
        <VCHoverCard :open-delay="300">
            <VCHoverCardTrigger
                as="a"
                href="https://github.com/octocat"
                target="_blank"
                rel="noopener"
                style="text-decoration: underline; color: var(--vc-color-primary-700);"
            >
                @octocat
            </VCHoverCardTrigger>
            <VCHoverCardContent
                :side-offset="8"
                :theme-variant="themeVariant"
            >
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <p style="margin: 0; font-weight: 600;">
                        @octocat
                    </p>
                    <p style="margin: 0; font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                        The mascot of GitHub. Joined in 2008.
                    </p>
                </div>
                <VCHoverCardArrow />
            </VCHoverCardContent>
        </VCHoverCard>
        — hover the link to see the floating preview.
    </p>
</template>
