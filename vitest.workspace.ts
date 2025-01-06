import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'core',
      environment: 'jsdom',
      include: ['packages/core/test/**/*.test.{ts,tsx}'],
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
    },
  },
  {
    test: {
      name: 'backdrop',
      environment: 'jsdom',
      include: ['packages/backdrop/test/**/*.test.{ts,tsx}'],
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
    },
  },
  {
    test: {
      name: 'node',
      environment: 'node',
      include: ['packages/vite/test/**/*.test.ts', 'packages/export/test/**/*.test.ts'],
      globals: true,
    },
  },
])
