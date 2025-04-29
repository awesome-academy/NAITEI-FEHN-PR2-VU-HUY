export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/somanchiu/Keyless-Google-Maps-API@v6.9/mapsJavaScriptAPI.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.initMap = function () {
        nuxtApp.vueApp.config.globalProperties.$mapLoaded = true;
      };
    };
    document.head.appendChild(script);
  }
});
