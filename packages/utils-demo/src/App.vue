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
                    class: 'col',
                }, h(List)),
            ]),
        ]);
    },
});
</script>
<style>
.btn-group-xs>.btn,
.btn-xs,
.dropdown-xs>.btn {
    padding: 0.05rem 0.5rem;
    font-size: .75rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}
</style>
