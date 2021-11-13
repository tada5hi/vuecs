<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
export default {
    name: 'LayoutComponents',
    props: {
        type: {
            type: String,
            default: function () {
                return 'main';
            }
        }
    },
    methods: {
        async selectComponent(component) {
            await this.$store.dispatch('layout/selectComponent', {
                type: this.type,
                component
            })
        }
    },
    computed: {
        items() {
            switch (this.type) {
                case 'main':
                    return this.$store.getters['layout/mainComponents']
                case 'side':
                    return this.$store.getters['layout/sideComponents'];
            }

            return [];
        },
        mainId() {
            return this.$store.getters['layout/mainComponentId'];
        }
    }
}
</script>
<template>
    <ul>
        {{items}}
        <li
            v-if="component.show"
            v-for="(component,key) in items"
            :key="key"
        >
            <template v-if="component.type === 'separator'" >
                <div class="nav-separator">
                    {{ component.name }}
                </div>
            </template>
            <template v-else>
                <template v-if="!component.components">
                    <template v-if="component.url">
                        <router-link :to="component.url" class="sidebar-menu-link" :class="{'root-link': component.rootLink}">
                            <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                        </router-link>
                    </template>
                    <template v-else>
                        <a class="nav-link" :class="{'router-link-active': type === 'main' && component.id === mainId }" @click.prevent="selectComponent(component)" href="javascript:void(0)" >
                            <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                        </a>
                    </template>
                </template>
                <template v-if="component.components">
                    <div
                        @click.prevent="selectComponent(component)"
                        class="sidebar-submenu-title"
                    >
                        <i v-if="component.icon" :class="component.icon" /> {{ component.name }}
                    </div>
                    <layout-components
                        class="list-unstyled sidebar-submenu-components"
                        :items="component.components"
                    />
                </template>
            </template>
        </li>
    </ul>
</template>
