<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- Phần tiêu đề -->
    <div class="header text-center mb-8">
      <h1 class="text-2xl font-bold italic">CONTACT FOR ADVERTISING AT THE CINEMA / GROUP TICKET PURCHASE /</h1>
      <h1 class="text-2xl font-bold italic">THEATER RENTAL FOR EVENTS / GIFT VOUCHER PURCHASE</h1>
    </div>

    <!-- Phần banner -->
    <div class="banner-section flex mb-10">
      <div class="banner-image w-1/3 mr-4">
        <NuxtImg src="/images/odeon.jpg" alt="Lotte Cinema" class="rounded-md w-full h-full object-cover" />
      </div>
      <div class="banner-text w-2/3">
        <p class="mb-2">Are you looking to advertise on the giant screen at the cinema, reaching a large audience of moviegoers?</p>
        <p class="mb-2">Do you need to enhance brand recognition and generate revenue for your company?</p>
        <p class="mb-2">Would you like to privately enjoy blockbuster movies with your family, friends, or colleagues?</p>
        <p class="mb-2">Are you searching for a venue to host events, project launches, fan meetings, or corporate training sessions?</p>
        <p class="mb-2">Are you looking for meaningful gifts to send to your loved ones?</p>
        <p class="mb-2">Contact ODEON Cinema today for immediate support:</p>
        <p class="mb-2">Email: <span class="text-blue-300">ads.odeoncinema@gmail.com</span> - Hotline: <span class="text-blue-300">0966010004</span></p>
      </div>
    </div>

    <!-- Phần dịch vụ -->
    <div class="service-section mb-10">
      <h2 class="text-2xl font-bold italic text-center mb-8">OUR SERVICES</h2>

      <div class="services-container flex">
        <div class="service-list w-1/3">
          <div 
            class="service-item mb-6 relative"
            v-for="(service, index) in serviceOptions"
            :key="index"
            @click="selectedService = service"
          >
            <div :class="[
              `service-card text-white py-4 px-12 rounded-lg`,
              service.background
            ]">
              <h3 class="font-bold text-center">{{service.value}}</h3>
            </div>
            <div v-if="service.value == selectedService.value" class="z-10 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div class="w-6 h-6 rounded-full bg-blue-500">
                <Icon name="i-lucide:chevron-right" size="1.25rem" class="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div v-else class="z-10 absolute right-[8px] top-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div class="w-4 h-4 rounded-full bg-white"></div>
            </div>
          </div>
        </div>

        <!-- Phần bên phải - Chi tiết dịch vụ -->
        <div class="service-detail w-2/3 pl-12">
          <div :class="`service-detail-card text-white p-6 rounded-lg mb-8 ${selectedService.background}`">
            <h3 class="font-bold text-lg mb-4">{{selectedService.label}}</h3>
            <ul class="list-disc pl-6">
              <li v-for="(desc, index) in selectedService.description" :key="index" class="mb-2">
                {{desc}}
              </li>
            </ul>
          </div>

          <!-- Form đăng ký -->
          <div class="registration-section">
            <h3 class="font-bold text-lg mb-4 text-center">LẬP KẾ HOẠCH CÙNG LOTTE CINEMA NGAY</h3>
            
            <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="block mb-2">Họ tên</label>
                <UInput
                  v-model="form.name"
                  placeholder="Nhập Họ Tên"
                  class="w-full"
                  variant="none"
                  :ui="{
                    base: 'border-b-1 rounded-none bg-transparent text-white placeholder-gray-400 focus:outline-none',
                    padding: 'px-4 py-2', 
                  }"
                />
              </div>
              
              <div class="form-group">
                <label class="block mb-2">Số điện thoại</label>
                <UInput
                  v-model="form.phone"
                  placeholder="Nhập Điện Thoại"
                  type="tel"
                  class="w-full"
                  variant="none"
                  :ui="{
                    base: 'border-b-1 rounded-none bg-transparent text-white placeholder-gray-400 focus:outline-none',
                    padding: 'px-4 py-2', 
                  }"
                />
              </div>
              
              <div class="form-group">
                <label class="block mb-2">Email</label>
                <UInput
                  v-model="form.email"
                  placeholder="Nhập Email"
                  type="email"
                  class="w-full"
                  variant="none"
                  :ui="{
                    base: 'border-b-1 rounded-none bg-transparent text-white placeholder-gray-400 focus:outline-none',
                    padding: 'px-4 py-2', 
                  }"
                />
              </div>
              
              <div class="form-group">
                <label class="block mb-2">Chọn dịch vụ</label>
                <USelectMenu 
                  v-model="form.service" 
                  @update:modelValue="handleServiceChange"
                  :items="serviceOptions"
                  class="w-full" 
                />
              </div>
              
              <div class="form-group">
                <label class="block mb-2">Chọn khu vực</label>
                <USelectMenu 
                  :items="locations" 
                  v-model="form.area" 
                  class="w-full"
                  @update:modelValue="handleLocationChange" 
                />
              </div>
              
              <div class="form-group">
                <label class="block mb-2">Chọn rạp</label>
                <USelectMenu 
                  v-model="form.subArea" 
                  :items="filteredCinemas"
                  class="w-full"
                  :disabled="!selectedLocation || selectedLocation === 'ALL'" 
                />
              </div>
              
              <div class="form-group col-span-2">
                <label class="block mb-2">Thông tin chi tiết</label>
                <UTextarea
                  v-model="form.details"
                  placeholder="Thông Tin Chi Tiết"
                  class="w-full"
                  :ui="{
                    base: 'bg-transparent text-white placeholder-gray-400 focus:outline-none focus-visible:outline-none focus-visible:ring-blue-400',
                    padding: 'px-4 py-2', 
                  }"
                />
              </div>
              
              <div class="form-group col-span-2">
                <UCheckbox 
                  v-model="form.agree"
                  color="secondary"
                  :label="`Tôi đồng ý với các điều khoản và chính sách của ODEON Cinema`"
                  :ui="{
                    root: 'items-center',
                    label: 'text-white',
                  }"
                />
              </div>
              
              <div class="form-group col-span-2 mt-4">
                <UButton 
                  type="submit" 
                  block 
                  class="bg-blue-500 text-gray-800 hover:bg-blue-600"
                  :class="{'opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300': !isFormValid}"
                >
                  Gửi
                </UButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { data:cinemas } = useFetch('http://localhost:3001/Theaters');
const selectedLocation = ref(null);

// Danh sách dịch vụ
const serviceOptions = [
  { 
    label: 'BUY GIFT VOUCHERS / E-CODES',
    value: 'BUY GIFT VOUCHERS / E-CODES',
    description: [
      'Branded gifts for valued partners through our products and services.',
      'Nurturing customers\' mental well-being with refined entertainment products.',
      'Gift voucher solutions for partners \' promotional and marketing campaigns.',
      'Meaningful prize gifts for loved ones and friends.'
    ],
    background: 'bg-orange-500',
  },
  { 
    label: 'BUY GROUP TICKETS',
    value: 'BUY GROUP TICKETS',
    description: [
      'Enjoy exclusive discounts and seamless booking for group entertainment experiences.',
      'Create memorable outings with friends, family, or colleagues through tailored group ticket packages.',
      'Elevate team-building or special occasions with hassle-free group ticket purchasing options.'
    ],
    background: 'bg-red-600',
  },
  { 
    label: 'RENT THEATER FOR EVENTS',
    value: 'RENT THEATER FOR EVENTS',
    description: [
      'Host unforgettable events in a cinematic setting, from product launches to private screenings.',
      'Transform your gatherings into extraordinary experiences with our theater rental services.',
      'Elevate your brand\'s visibility and engagement through immersive event spaces.'
    ],
    background: 'bg-green-600',
  },
  { 
    label: 'ADVERTISING AT THEATER',
    value: 'ADVERTISING AT THEATER',
    description: [
      'Reach a captive audience with impactful advertising on the big screen.',
      'Enhance brand recognition and drive revenue through strategic cinema advertising.',
      'Leverage the power of cinema to connect with your target audience effectively.'
    ],
    background: 'bg-pink-500',
  }
];

const selectedService = ref(serviceOptions[0]);

const locationSet = computed(() => {
  const set = new Set();
  if (cinemas.value) {
    cinemas.value.forEach(cinema => {
      if (cinema.city) {
        set.add(cinema.city);
      }
    });
  }
  return set;
});

const locations = computed(() => {
  return Array.from(locationSet.value).map(location => ({
    label: location,
    value: location
  }));
});

// Lọc danh sách rạp theo thành phố đã chọn
const filteredCinemas = computed(() => {
  if (!selectedLocation.value || !cinemas.value) {
    return [];
  }
  
  return cinemas.value
    .filter(cinema => cinema.city === selectedLocation.value.value)
    .map(cinema => ({
      label: cinema.name,
      value: cinema.id
    }));
});


// Form data
const form = ref({
  name: '',
  phone: '',
  email: '',
  service: selectedService.value.value,
  area: '',
  subArea: '',
  details: '',
  agree: false
});

// Xử lý khi thay đổi location
const handleLocationChange = (value) => {
  selectedLocation.value = value;
  
  // Reset lựa chọn rạp nếu đổi thành phố
  form.value.subArea = '';
  console.log('Filtered cinemas:', filteredCinemas.value);
  console.log('Selected location:', selectedLocation.value);
};

const handleServiceChange = (value) => {
  console.log("value", value)

  const service = serviceOptions.find(s => s.value === value.value);
  if (service) {
    selectedService.value = service;
  }
  console.log('Selected service:', selectedService.value);
};

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && 
         form.value.phone.trim() !== '' && 
         form.value.email.trim() !== '' && 
         form.value.subArea &&
         form.value.agree === true;
});

// Form submission
const submitForm = async () => {
  try {
    // Validate form
    if (!form.value.name || !form.value.phone || !form.value.email) {
      alert('Vui lòng điền đầy đủ thông tin họ tên, điện thoại và email!');
      return;
    }

    if (!form.value.agree) {
      alert('Vui lòng đồng ý với điều khoản và chính sách!');
      return;
    }

    // Sử dụng json-server để lưu form
    await $fetch('http://localhost:3001/Contacts', {
      method: 'POST',
      body: form.value
    });
    
    alert('Thông tin đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
    resetForm();
  } catch (error) {
    console.error('Lỗi khi gửi form:', error);
    alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau!');
  }
};

watch(() => form.value.service, (newService) => {
  const selected = serviceOptions.find(service => service.value === newService);
  if (selected) {
    selectedService.value = selected;
  }
});

// Đồng bộ selectedService với form.service
watch(() => selectedService.value, (newSelectedService) => {
  form.value.service = newSelectedService.value;
});

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    service: selectedService.value.value,
    area: '',
    subArea: '',
    details: '',
    agree: false
  };
  selectedLocation.value = null;
};
</script>

<style scoped>
.service-card {
  position: relative;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
}

.service-dot {
  z-index: 10;
}

.service-list {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
