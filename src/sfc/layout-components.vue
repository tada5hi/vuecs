<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import LayoutComponent from "./layout-component";

export default {
    name: 'LayoutComponents',
    components: {LayoutComponent},
    props: {
        level: {
            type: String,
            default: 'level-0'
        },
        propertyItems: {
            type: Array,
            default: undefined
        }
    },

    computed: {
        items() {
            if(typeof this.propertyItems !== 'undefined') {
                return this.propertyItems;
            }

            return this.$store.getters['layout/components'](this.level);
        }
    }
}
</script>
<template>
    <ul>
        <li
            v-if="component.show"
            v-for="(component,key) in items"
            :key="key"
        >
            <layout-component :level="level" :component="component" />
        </li>
    </ul>
</template>
