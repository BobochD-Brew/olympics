import postcssPresetEnv from 'postcss-preset-env';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [
        terser({
            format: {
                comments: false,          
            },
            compress: {
                drop_console: true,
                dead_code: true,
            },
            mangle: true,
        }),
        postcssPresetEnv(),
    ],
    build: {
        target: "es2021",
        minify: 'terser',
    },
    resolve: {
        alias: {
            '@Components': path.resolve(__dirname, './src/components'),
            '@Hooks': path.resolve(__dirname, './src/hooks'),
            '@Utils': path.resolve(__dirname, './src/utils'),
            '@Styles': path.resolve(__dirname, './src/styles'),
            '@Pages': path.resolve(__dirname, './src/pages'),
        },
    },
})