<template>
  <ClientOnly>
    <div id="map" style="width: 100%; height: 500px"></div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  location: {
    type: Object,
    required: true,
    default: () => ({
      lat: 21.076091255692376, 
      lng: 105.81268882209055
    }),
  },
  zoom: {
    type: Number,
    default: 13,
  },
});

const isMapLoaded = ref(false);
const map = ref(null);
const marker = ref(null);
const mapInterval = ref(null);


const initMap = () => {
  if (window.google && window.google.maps && document.getElementById('map')) {
    if (mapInterval.value) clearInterval(mapInterval.value);
    isMapLoaded.value = true;

    map.value = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: props.location.lat, lng: props.location.lng },
      zoom: props.zoom,
    });

    marker.value = new window.google.maps.Marker({
      position: { lat: props.location.lat, lng: props.location.lng },
      map: map.value,
      title: 'Location',
    });
  }
};

onMounted(() => {
  if (window.google && window.google.maps) {
    initMap();
    return;
  }
  
  window.initMap = initMap;
  
  mapInterval.value = setInterval(() => {
    if (window.google && window.google.maps) {
      initMap();
    }
  }, 500);
});

onUnmounted(() => {
  if (mapInterval.value) clearInterval(mapInterval.value);
});

watch(
  () => props.location,
  (newLocation) => {
    if (map.value && newLocation) {
      map.value.setCenter({ lat: newLocation.lat, lng: newLocation.lng });

      if (marker.value) {
        marker.value.setPosition({ lat: newLocation.lat, lng: newLocation.lng });
      }
    }
  },
  { deep: true }
);
</script>
