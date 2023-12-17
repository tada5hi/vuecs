<!--
  - Copyright (c) 2021-2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { VCGravatar } from '@vuecs/gravatar';
import { VCNavItems } from '@vuecs/navigation';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCGravatar,
        VCNavItems,
    },
    setup() {

    },
});
</script>
<template>
    <div>
        <header class="page-header fixed-top">
            <div class="header-title">
                <div class="toggle-box">
                    <button
                        type="button"
                        class="toggle-trigger"
                    >
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                        <span class="icon-bar" />
                    </button>
                </div>
                <div class="logo">
                    VueLayout
                </div>
            </div>

            <nav class="page-navbar navbar-expand-md">
                <div
                    id="page-navbar"
                    class="navbar-content navbar-collapse"
                >
                    <VCNavItems
                        class="navbar-nav"
                        :tier="0"
                    />

                    <ul class="navbar-nav navbar-gadgets nav-items">
                        <li class="nav-item">
                            <a
                                href="javascript:void(0)"
                                class="nav-link user-link"
                            >
                                <VCGravatar email="peter.placzek1996@gmail.com" />
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    </div>
</template>
