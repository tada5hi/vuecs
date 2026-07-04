import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'tsdown';
import { base } from '../../tsdown.base.mjs';

export default defineConfig({
    ...base,
    plugins: [vue()],
});
