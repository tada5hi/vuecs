<script lang="ts">
import { defineComponent, h } from 'vue';
import Form from './views/Form.vue';
import List from './views/List.vue';

export default defineComponent({
    setup() {
        return () => h('div', { class: 'container' }, [
            h('div', {
                class: 'row',
            }, [
                h('div', {
                    class: 'col',
                }, h(Form)),
                h('div', {
                    class: 'col'
                }, h(List))
            ]),
        ]);
    },
});
</script>
