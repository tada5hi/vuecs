<script>
// Uncomment import and local "components" registration if library is not registered globally.
import LayoutComponents from "../src/sfc/layout-components.vue";

export default {
    name: 'ServeDev',
    components: {LayoutComponents},
}
</script>
<template>
    <div id="app">
        <layout-components />

        <layout-components :level="1" />

        <hr />

        <router-view></router-view>
    </div>
</template>
