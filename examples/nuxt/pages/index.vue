<template>
    <div class="mx-auto max-w-5xl space-y-4">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <VCIcon
                name="fa6-solid:heart"
                class="text-red-500"
            /> vuecs
            <span class="text-sm font-normal text-fg-muted">Nuxt example</span>
        </h3>
        <p class="text-fg">
            Flagship Nuxt integration for vuecs — exercises
            <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs/nuxt</code> +
            <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs/theme-tailwind-nuxt</code>
            on top of <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs/theme-tailwind</code>.
        </p>
        <p class="text-fg-muted">
            Pick a component from the sidebar — every page mounts the matching demo from
            <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs-examples/shared</code>,
            the same workspace package consumed by the Tailwind / Bootstrap / Bulma vanilla
            Vue example apps under <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">examples/</code>.
            The header and sidebar are driven by
            <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs/navigation</code>
            via <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">findNavigationItems()</code>
            in <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">config/layout/module.ts</code>.
        </p>
    </div>
</template>
