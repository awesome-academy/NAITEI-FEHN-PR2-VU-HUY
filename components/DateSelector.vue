<template>
  <div class="mb-8">
    <div class="flex w-full grid grid-cols-8">
      <div
        v-for="(date, index) in dates"
        :key="index"
        class="flex gap-1 items-center justify-center text-center cursor-pointer pb-3"
        :class="{
          'text-blue-500': date.active,
          'text-gray-400': !date.active,
          'border-b-2 border-blue-500': date.active,
          'hover:text-blue-500': !date.active
        }"
        @click="(selectDate(date))"
      >
        <span class="text-md font-semibold">{{ date.day }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['date-selected']);

const dates = ref([
  { day: 'Today', number: '17', month: 'Apr', active: true },
  { day: 'Sat', number: '18', month: 'Apr', active: false },
  { day: 'Sun', number: '19', month: 'Apr', active: false },
  { day: 'Mon', number: '20', month: 'Apr', active: false },
  { day: 'Tue', number: '21', month: 'Apr', active: false },
  { day: 'Wed', number: '22', month: 'Apr', active: false },
  { day: 'Thu', number: '23', month: 'Apr', active: false },
  { day: 'Fri', number: '24', month: 'Apr', active: false }
]);

const selectDate = (date) => {
  dates.value.forEach((d) => (d.active = false));
  date.active = true;
  emit('date-selected', date);
};

onMounted(() => {
  const initialDate = dates.value.find(d => d.active);
  if (initialDate) {
    emit('date-selected', initialDate);
  }
});
</script>
