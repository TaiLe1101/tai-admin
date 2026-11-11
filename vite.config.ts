import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appPort = Number(env.VITE_APP_PORT);


  return (
    {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          '#': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      plugins: [
        devtools(),
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
        }),
        viteReact(),
        tailwindcss(),
      ],
      server: {
        port: appPort,
        strictPort: true,
        host:true,
        hmr: {
          clientPort: 443,
        },
        allowedHosts: ["eoffice-admin.localtest.me", "admin.devt.dpdns.org"]
      }
    }
  )
})

export default config

