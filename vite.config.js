import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno basadas en 'mode'
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      tailwindcss(),
      vue(),
      federation({
        name: 'dashboardShell',
        remotes: {
          adminMFE: `adminMFE@${env.VITE_ADMIN_MFE_URL || 'http://localhost:4173/assets/remoteEntry.js'}`
        },
        shared: ['vue', 'vue-router', 'pinia']
      })
    ],
    server: {
      port: 5004,
      strictPort: true
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    }
  }
})
