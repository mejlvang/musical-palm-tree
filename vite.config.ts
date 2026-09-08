import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['src/input/keyboard-input.test.ts'],
  },
});
