import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import { default as terser } from '@rollup/plugin-terser';
import { default as closureCompiler } from '@ampproject/rollup-plugin-closure-compiler';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        legacy(),
        {
            apply: 'build',
            rollupOptions: {
                plugins: [
                    terser(), // Minify the code
                    closureCompiler({
                        compilationLevel: 'ADVANCED',
                        sourcemap: true,
                    }),
                ],
            },
        },
        sentryVitePlugin({
            org: 'abraxa',
            project: 'react-frontend',
        }),
    ],

    build: {
        sourcemap: true,
        rollupOptions: {
            onwarn(warning, defaultHandler) {
                if (warning.code === 'SOURCEMAP_ERROR') {
                    return;
                }

                defaultHandler(warning);
            },
        },
    },
});
