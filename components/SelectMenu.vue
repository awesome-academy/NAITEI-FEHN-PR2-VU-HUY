<template>
  <div class="relative" ref="dropdownRef">
    <!-- Select button -->
    <button 
      @click="toggleDropdown"
      class="flex items-center justify-between w-full text-blue-400 hover:text-white transition-colors px-4 focus:outline-none"
    >
      <span v-if="!selectedCategory || !categories.find(cat => cat.id === selectedCategory)" >More categories</span>
      <span v-else>{{ categories.find(cat => cat.id === selectedCategory).name }}</span>
      <Icon :name="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="ml-2 w-5 h-5" />
    </button>
    
    <div 
      v-if="isOpen"
      class="absolute top-full left-0 right-0 z-50 mt-1 overflow-auto bg-blue-950 border border-blue-800 shadow-lg max-h-64 w-full"
      style="scrollbar-width: thin; scrollbar-color: #1e40af #0f172a"
    >
      <div class="py-1">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          class="block w-full text-left px-4 py-3 text-white hover:bg-blue-900 transition-colors"
          :class="{'bg-blue-900': selectedCategory === category.id}"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownRef = ref(null);
const selectedCategory = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedCategory.value = newValue;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCategory = (category) => {
  selectedCategory.value = category.id;
  emit('update:modelValue', category.id);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background-color: #1e40af;
  border-radius: 4px;
}
</style>
