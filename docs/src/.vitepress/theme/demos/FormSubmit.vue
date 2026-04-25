<script setup lang="ts">
import { VCFormSubmit } from '@vuecs/form-controls';
</script>

<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <!--
          :invalid="false" — the prop defaults to true (treats the submit
          as guard-blocked), so without this every demo button renders
          disabled. Set to false here so the create/update/busy variants
          all render in their non-disabled state.
        -->
        <VCFormSubmit :invalid="false" />
        <VCFormSubmit
            :invalid="false"
            :is-editing="true"
        />
        <VCFormSubmit
            :invalid="false"
            create-text="Save"
        />
        <VCFormSubmit
            :invalid="false"
            :busy="true"
        />
    </div>
</template>
