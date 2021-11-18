<script>
// Uncomment import and local "components" registration if library is not registered globally.
import LayoutComponents from "@/sfc/NavigationComponents.vue";

export default {
    name: 'ServeDev',
    components: {LayoutComponents},
    computed: {

    }
}
</script>
<template>
    <div id="app">
        <navigation-components />

        <navigation-components :level="1" />

        <hr />

        <router-view></router-view>
    </div>
</template>
