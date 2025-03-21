import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        setupFiles: "./setupTests.js",
        environment: "jsdom",
        coverage: {
            provider: 'istanbul',
        },
    },
})