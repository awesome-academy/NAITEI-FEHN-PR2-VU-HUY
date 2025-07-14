<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <PageTitle>LỊCH SỬ ĐẶT VÉ</PageTitle>
    
    <div class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <USelectMenu
          v-model="filters.status"
          :items="statusOptions"
          placeholder="Lọc theo trạng thái"
          size="md"
          class="w-full"
        >
          <template #label>
            <span>{{ getSelectedStatusLabel() }}</span>
          </template>
        </USelectMenu>
        <UInput
          v-model="filters.dateRange.from"
          type="date"
          placeholder="Từ ngày"
          size="md"
          color="white"
          class="w-full"
        />
        <UInput
          v-model="filters.dateRange.to"
          type="date"
          placeholder="Đến ngày"
          size="md"
          color="white"
          class="w-full"
        />
      </div>
    </div>

    <div v-if="pending" class="text-center py-10">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>
    <div v-else>
      <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mã vé</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phim</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ghế</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ngày đặt</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody class="bg-gray-800 divide-y divide-gray-700">
              <tr v-if="filteredTickets.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-400">
                  Không tìm thấy vé nào
                </td>
              </tr>
              <tr v-for="ticket in paginatedTickets" :key="ticket.id" class="hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ ticket.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ ticket.movie_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ ticket.seat_code }}, Screen {{ ticket.screen }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(ticket.status)">
                    {{ getStatusText(ticket.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ formatDate(ticket.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <UButton
                    icon="i-heroicons-ticket"
                    color="secondary"
                    variant="soft"
                    size="sm"
                    :to="`/ticket-detail/${ticket.id}`"
                  >
                    Chi tiết
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <UPagination
          v-model:page="currentPage"
          :total="filteredTickets.length"
          :items-per-page="pageSize"
          :ui="{ rounded: 'rounded-lg' }"
          active-color="secondary"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
const pageSize = 10;
const currentPage = ref(1);

const filters = reactive({
  status: null,
  dateRange: {
    from: '',
    to: ''
  }
});

const statusOptions = [
  { label: 'Tất cả', value: null },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đang chờ', value: 'pending' },
  { label: 'Đã hủy', value: 'cancelled' }
];

// Lấy label của trạng thái đã chọn
const getSelectedStatusLabel = () => {
  if (filters.status === null) return 'Lọc theo trạng thái';
  const selected = statusOptions.find(option => option.value === filters.status);
  return selected ? selected.label : 'Lọc theo trạng thái';
};

const { data: tickets, pending, error, refresh } = await useAsyncData(
  'userTickets',
  async () => {
    if (!user.value?.id) return [];
    
    const response = await $fetch(`http://localhost:3001/Tickets?user_id=${user.value.id}&_sort=-created_at`);
    
    // Fetch showtime data for each ticket
    const showtimeIds = [...new Set(response.map(ticket => ticket.showtime_id))];
    const showtimesData = {};
    
    await Promise.all(
      showtimeIds.map(async (id) => {
        const showtimeResponse = await $fetch(`http://localhost:3001/Showtimes?id=${id}`);
        if (showtimeResponse && showtimeResponse.length > 0) {
          showtimesData[id] = showtimeResponse[0];
        }
      })
    );
    
    // Enhance tickets with showtime data
    return response.map(ticket => {
      const showtimeData = showtimesData[ticket.showtime_id] || {};
      return {
        ...ticket,
        movie_name: showtimeData.movie_name || 'Unknown',
        showtime: showtimeData.showtime || 'Unknown',
        screen: showtimeData.screen_id || 'Unknown',
        theater: showtimeData.theater_name || 'Unknown',
      };
    });
  },
  {
    server: false
  }
);

// Apply filters
const filteredTickets = computed(() => {
  if (!tickets.value) return [];
  
  return tickets.value.filter(ticket => {
    // Filter by status
    if (filters.status && filters.status.value !== null && ticket.status !== filters.status.value) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      const ticketDate = new Date(ticket.created_at);
      
      if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from);
        if (ticketDate < fromDate) return false;
      }
      
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (ticketDate > toDate) return false;
      }
    }
    
    return true;
  });
});

// Paginate tickets
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredTickets.value.slice(start, end);
});

// Xử lý khi thay đổi trang
const handlePageChange = (page) => {
  console.log(currentPage)
  currentPage.value = page;
};

// Reset to first page when filters change
watch([() => filters.status, () => filters.dateRange.from, () => filters.dateRange.to], () => {
  currentPage.value = 1;
}, { deep: true });

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Get status class
const getStatusClass = (status) => {
  const baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'confirmed':
      return `${baseClasses} bg-green-300 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-300 text-yellow-800`;
    case 'cancelled':
      return `${baseClasses} bg-red-300 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// Get status text in Vietnamese
const getStatusText = (status) => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'pending':
      return 'Đang chờ';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

// Refresh data when component is mounted
onMounted(() => {
  refresh();
});
</script>
