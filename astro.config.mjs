import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "sass:math";
                        @import "/src/styles/assets/mixins";
                        @import "/src/styles/assets/vars";
                        @import "/src/styles/assets/null";
                    `,
                },
            },
        }
    }
});
