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
        tier: {
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
                tier: this.tier,
                component
            });

            if(component?.url) {
                if(this.$router.history.current.path === component?.url) {
                    return;
                }

                // todo: check if it is absolute link :)
                await this.$router.push({
                    path: component?.url
                })
            }
        },
        async toggleComponentExpansion(component) {
            await this.$store.dispatch('layout/toggleNavigationExpansion', {
                tier: this.tier,
                component
            })
        }
    },
    computed: {
        isMatch() {
            return isNavigationComponentMatch(
                this.$store.getters['layout/navigationComponent'](this.tier),
                this.component,
                true
            )
        },
        isActive() {
            return !!(this.component.components &&
                this.component.displayChildren);
        }
    }
}
</script>
<template>
    <div class="nav-item" :class="{
        'active': isActive
    }">
        <template v-if="component.type === 'separator'" >
            <slot name="separator" v-bind:component="component">
                <div class="nav-separator">
                    {{ component.name }}
                </div>
            </slot>
        </template>
        <template v-else>
            <template v-if="!component.components">
                <slot
                    name="link"
                    v-bind:component="component"
                    v-bind:select-component="selectComponent"
                    v-bind:is-active="isActive"
                >
                    <a
                        class="nav-link"
                        :class="{
                            'router-link-active': isActive,
                            'router-link-exact-active': isMatch,
                            'active': isMatch || isActive,
                            'root-link': component.rootLink
                    }"
                        @click.prevent="selectComponent(component)" href="javascript:void(0)"
                    >
                        <i v-if="component.icon" :class="component.icon" /> <span class="nav-link-text">{{ component.name }}</span>
                    </a>
                </slot>
            </template>
            <template v-if="component.components">
                <slot
                    name="sub"
                    v-bind:component="component"
                    v-bind:select-component="selectComponent"
                    v-bind:toggle-component-expansion="toggleComponentExpansion"
                >
                    <slot
                        name="sub-title"
                        v-bind:component="component"
                        v-bind:select-component="selectComponent"
                        v-bind:toggle-component-expansion="toggleComponentExpansion"
                    >
                        <div
                            @click.prevent="toggleComponentExpansion(component)"
                            class="nav-sub-title"
                        >
                            <i v-if="component.icon" :class="component.icon" /> <span class="nav-link-text">{{ component.name }}</span>
                        </div>
                    </slot>

                    <slot
                        name="sub-items"
                        v-bind:component="component"
                        v-bind:select-component="selectComponent"
                        v-bind:toggle-component-expansion="toggleComponentExpansion"
                    >
                        <navigation-components
                            v-if="component.displayChildren"
                            class="list-unstyled nav-sub-items"
                            :tier="tier"
                            :property-items="component.components"
                        />
                    </slot>
                </slot>
            </template>
        </template>
    </div>
</template>
