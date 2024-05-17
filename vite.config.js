import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import { default as terser } from '@rollup/plugin-terser';
import obfuscator from 'rollup-plugin-obfuscator';

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
                    obfuscator({
                        // Configure options for code obfuscation
                        compact: true,
                        controlFlowFlattening: true,
                        controlFlowFlatteningThreshold: 0.75,
                        deadCodeInjection: true,
                        deadCodeInjectionThreshold: 0.4,
                        debugProtection: false,
                        debugProtectionInterval: false,
                        disableConsoleOutput: true,
                        identifierNamesGenerator: 'hexadecimal',
                        log: false,
                        renameGlobals: false,
                        rotateStringArray: true,
                        selfDefending: true,
                        stringArray: true,
                        stringArrayEncoding: 'rc4',
                        stringArrayThreshold: 0.75,
                        unicodeEscapeSequence: false,
                    }),
                ],
            },
        },
    ],
    // server: {
    //     port: 80,
    // },
});
