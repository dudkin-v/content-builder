import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        core: 'src/core/index.ts',
        components: 'src/components/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    splitting: false,
});