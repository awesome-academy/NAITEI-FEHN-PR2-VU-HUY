import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/gh/somanchiu/Keyless-Google-Maps-API@v6.9/mapsJavaScriptAPI.js',
          defer: true,
          async: true,
        },
      ],
    },
  },
  plugins: [
    '~/plugins/google-maps.client.js',
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/ui', '@vueuse/nuxt', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      {
        code: 'en', language: 'en-US', name: 'English' ,  file: 'en.json'
      },
      {
        code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json'
      }
    ],
    defaultLocale: 'en'
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/db.json/**']
      }
    }
  },
  css: ["~/assets/css/app.css"],
})
