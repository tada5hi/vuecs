<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import {isComponentMatch} from "../";

export default {
    name: 'LayoutComponent',
    components: {
        LayoutComponents: () => import('./layout-components.vue')
    },
    props: {
        level: {
            type: String,
            default: 'level-0'
        },
        component: {
            type: Object,
            default: undefined
        }
    },
    methods: {
        async selectComponent(component) {
            await this.$store.dispatch('layout/selectComponent', {
                level: this.level,
                component
            })
        },
        async toggleComponentExpansion(component) {
            await this.$store.commit('layout/toggleComponentExpansion', {
                level: this.level,
                component
            })
        }
    },
    computed: {
        mainId() {
            return this.$store.getters['layout/componentId'](this.level);
        },
        isMatch() {
            return isComponentMatch(
                this.$store.getters['layout/component'](this.level),
                this.component
            )
        }
    }
}
</script>
<template>
    <div>
        <template v-if="component.type === 'separator'" >
            <div class="nav-separator">
                {{ component.name }}
            </div>
        </template>
        <template v-else>
            <template v-if="!component.components">
                <template v-if="component.url">
                    <router-link :to="component.url" class="nav-link" :class="{'root-link': component.rootLink}">
                        <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                    </router-link>
                </template>
                <template v-else>
                    <a
                        class="nav-link"
                        :class="{'router-link-active': level === 'main' && component.id === mainId }"
                        @click.prevent="selectComponent(component)" href="javascript:void(0)"
                    >
                        <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                    </a>
                </template>
            </template>
            <template v-if="component.components">
                <div
                    @click.prevent="toggleComponentExpansion(component)"
                    class="nav-submenu-title"
                >
                    <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                </div>
                <layout-components
                    class="list-unstyled nav-submenu-components"
                    :level="level"
                    :property-items="component.components"
                />
            </template>
        </template>
    </div>
</template>
