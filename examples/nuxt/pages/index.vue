<template>
    <div class="container">
        <h3 class="title no-border">
            <i class="fa-solid fa-heart" /> VueLayout <span class="sub-title">Basic</span>
        </h3>
        <p>
            This is an example application to demonstrate the usage of the components in depth:
        </p>
        <ul>
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
<script setup>
import { useRouter } from '#imports';

const router = useRouter();

setTimeout(() => {
    router.replace({ query: { foo: 'baz', bar: 'baz' } });
}, 5000);
</script>
