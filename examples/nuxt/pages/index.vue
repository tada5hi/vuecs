<template>
    <div class="mx-auto max-w-5xl space-y-4">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <i class="fa-solid fa-heart text-red-500" /> vuecs
            <span class="text-sm font-normal text-fg-muted">Examples</span>
        </h3>
        <p class="text-fg">
            Example application demonstrating the vuecs component library with the
            <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs/theme-tailwind</code>
            theme.
        </p>
        <ul class="list-disc space-y-1 pl-6">
            <li>
                <VCLink :to="'/countdown'">
                    Countdown
                </VCLink>
            </li>
            <li>NavigationComponent(s)</li>
            <li>Pagination</li>
        </ul>
    </div>
</template>
