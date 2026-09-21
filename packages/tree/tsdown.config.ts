import { defineConfig } from 'tsdown';
import vue from '@vitejs/plugin-vue';
import { base } from '../../tsdown.base.mjs';

export default defineConfig({
    ...base,
    plugins: [vue()],
});
