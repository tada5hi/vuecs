<script lang="ts">
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import LayoutComponents from "../src/sfc/layout-components.vue";
import {getMainNavComponents} from "../src";

export default Vue.extend({
    name: 'ServeDev',
    components: {LayoutComponents},
});
</script>

<template>
    <div id="app">
        <layout-components level="'main'"/>
    </div>
</template>
