<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import {isNavigationComponentMatch} from "../";

export default {
    props: {
        level: {
            type: Number,
            default: 0
        },
        component: {
            type: Object,
            default: undefined
        }
    },
    methods: {
        async selectComponent(component) {
            await this.$store.dispatch('layout/selectNavigation', {
                level: this.level,
                component
            })
        },
        async toggleComponentExpansion(component) {
            await this.$store.dispatch('layout/toggleNavigationExpansion', {
                level: this.level,
                component
            })
        }
    },
    computed: {
        selectedId() {
            return this.$store.getters['layout/navigationComponentId'](this.level);
        },
        isMatch() {
            return isNavigationComponentMatch(
                this.$store.getters['layout/navigationComponent'](this.level),
                this.component
            )
        }
    }
}
</script>
<template>
    <div>
        <template v-if="component.type === 'separator'" >
            <slot name="separator" v-bind:component="component">
                <div class="nav-separator">
                    {{ component.name }}
                </div>
            </slot>
        </template>
        <template v-else>
            <template v-if="!component.components">
                <slot name="link" v-bind:component="component" v-bind:select-component="selectComponent">
                    <template v-if="component.url">
                        <router-link :to="component.url" class="nav-link" :class="{'root-link': component.rootLink}">
                            <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                        </router-link>
                    </template>
                    <template v-else>
                        <a
                            class="nav-link"
                            :class="{'router-link-active active': component.id === selectedId }"
                            @click.prevent="selectComponent(component)" href="javascript:void(0)"
                        >
                            <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                        </a>
                    </template>
                </slot>
            </template>
            <template v-if="component.components">
                <slot
                    name="componentNested"
                    v-bind:component="component"
                    v-bind:select-component="selectComponent"
                    v-bind:toggle-component-expansion="toggleComponentExpansion"
                >
                    <div
                        @click.prevent="toggleComponentExpansion(component)"
                        class="nav-submenu-title"
                        :class="{'router-link-active active': component.id === selectedId }"
                    >
                        <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                    </div>

                    <navigation-components
                        class="list-unstyled nav-submenu-components"
                        :level="level"
                        :property-items="component.components"
                    />
                </slot>
            </template>
        </template>
    </div>
</template>
