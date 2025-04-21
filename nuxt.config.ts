import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/image'],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/app.css"],
})
