import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        policy: resolve(__dirname, 'policy.html'),
        post: resolve(__dirname, 'post.html'),
      },
    },
  },
})