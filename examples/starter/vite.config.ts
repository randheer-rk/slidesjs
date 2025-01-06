import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { slides } from '@slidesjs/vite'

export default defineConfig({
  plugins: [slides(), react({ include: /\.(mdx?|jsx?|tsx?)$/ })],
})
