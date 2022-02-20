<script>
import { buildNavigation } from '@vue-layout/navigation';

export default {
    name: 'ServeDev',
    computed: {
        topTier() {
            return 0;
        },
        sideTier() {
            return 1;
        },
    },
    methods: {
        async refresh() {
            await buildNavigation();
        },
    },
};
</script>
<template>
    <div id="app">
        <navigation-components
            class="nav-top"
            :tier="topTier"
        />

        <hr>

        <div class="content">
            <div class="content-sidebar">
                <navigation-components
                    class="nav-side"
                    :tier="sideTier"
                />
            </div>
            <div>
                <router-view />
            </div>
        </div>

        <hr>

        <button @click.prevent="refresh">
            Refresh
        </button>
    </div>
</template>
<style>
.content {
    display: flex;
    flex-direction: row;
}

.content-sidebar {
    margin-right: 1.5rem;
    min-width: 300px;
}

.nav-top {
    display: flex;
    flex-direction: row;
}

.nav-top .nav-link {
    color: #9d9d9d;
    display: block;
    font-size: 13px;
    font-weight: 700;
    border-radius: 4px;
}
</style>
