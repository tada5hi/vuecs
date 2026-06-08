<script lang="ts">
import { computed } from 'vue';
import {
    defineNuxtComponent,
    useLocale,
    useLocaleManager,
} from '#imports';

export default defineNuxtComponent({
    setup() {
        // Read side — resolves through @vuecs/core's Config['locale'].
        const locale = useLocale();
        // Control side — cookie-backed, SSR-safe (from @vuecs/nuxt).
        const {
            resolved,
            isAuto,
            set,
            reset,
        } = useLocaleManager();

        const now = Date.now();
        const samples = [
            now - 30 * 1000,
            now - 45 * 60 * 1000,
            now - 26 * 60 * 60 * 1000,
        ];

        const htmlLang = computed(() => (
            import.meta.client ? globalThis.document?.documentElement.lang : resolved.value
        ));

        const choices = [
            { value: 'en-US', label: 'English' },
            { value: 'de-DE', label: 'Deutsch' },
            { value: 'fr-FR', label: 'Français' },
        ];

        return {
            locale,
            resolved,
            isAuto,
            set,
            reset,
            samples,
            htmlLang,
            choices,
        };
    },
});
</script>

<template>
    <div class="mx-auto max-w-3xl space-y-6">
        <div class="space-y-1">
            <h1 class="text-2xl font-semibold text-fg">
                Locale
            </h1>
            <p class="text-sm opacity-70">
                The active locale lives in <code>@vuecs/core</code>'s
                <code>Config['locale']</code>. <code>@vuecs/nuxt</code> backs it
                with an SSR-safe cookie — change it below (or via the header
                switcher) and reload: the choice survives, and on a fresh
                visit <code>Auto</code> resolves from the
                <code>Accept-Language</code> header on the server.
            </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <VCButton
                v-for="choice in choices"
                :key="choice.value"
                size="sm"
                :variant="locale === choice.value ? 'solid' : 'outline'"
                @click="set(choice.value)"
            >
                {{ choice.label }}
            </VCButton>
            <VCButton
                size="sm"
                variant="ghost"
                @click="reset()"
            >
                Reset (Auto)
            </VCButton>
        </div>

        <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 rounded-md border border-border bg-bg-muted p-4 font-mono text-sm text-fg">
            <dt class="opacity-70">
                useLocale()
            </dt>
            <dd>{{ locale }}</dd>
            <dt class="opacity-70">
                resolved
            </dt>
            <dd>{{ resolved }}</dd>
            <dt class="opacity-70">
                isAuto
            </dt>
            <dd>{{ isAuto }}</dd>
            <dt class="opacity-70">
                &lt;html lang&gt;
            </dt>
            <dd>{{ htmlLang }}</dd>
        </dl>

        <div class="space-y-2">
            <h2 class="text-lg font-medium text-fg">
                Timeago follows the locale
            </h2>
            <p class="text-sm opacity-70">
                <code>&lt;VCTimeago&gt;</code> reads the same
                <code>useLocale()</code> value — switching language localizes
                the relative time (German / French date-fns locales are
                registered in this example).
            </p>
            <div class="flex flex-col gap-1 text-fg">
                <VCTimeago
                    v-for="t in samples"
                    :key="t"
                    :datetime="t"
                />
            </div>
        </div>
    </div>
</template>
