<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="pending" class="text-center py-10">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>
    <div v-else-if="!ticket" class="text-center py-10 text-gray-400">
      Không tìm thấy thông tin vé
    </div>
    <div v-else class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 border-b border-gray-700">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Chi tiết vé</h1>
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            to="/ticket-history"
          >
            Quay lại
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <div class="space-y-4">
            <div>
              <h2 class="text-lg font-semibold text-white">{{ ticket.movie_name }}</h2>
              <p class="text-gray-400">{{ formatShowtime(ticket.showtime) }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-400">Mã vé</p>
                <p class="text-white">{{ ticket.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Trạng thái</p>
                <span :class="getStatusClass(ticket.status)">
                  {{ getStatusText(ticket.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-400">Ghế</p>
                <p class="text-white">{{ ticket.seat_code }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Màn hình</p>
                <p class="text-white">Screen {{ ticket.screen }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Rạp</p>
                <p class="text-white">{{ ticket.theater }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Loại vé</p>
                <p class="text-white">{{ getTicketTypeText(ticket.type) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Giá vé</p>
                <p class="text-white">{{ formatPrice(ticket.price) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Phương thức thanh toán</p>
                <p class="text-white">{{ formatPaymentMethod(ticket.payment_method) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Ngày đặt</p>
                <p class="text-white">{{ formatDate(ticket.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
          <TicketQRCode 
            :value="qrValue" 
            :status="ticket.status" 
            title="QR Code check-in"
            description="Quét mã này tại rạp để check-in"
            errorMessage="QR Code chỉ khả dụng khi vé đã được xác nhận"
          />
        </div>
      </div>

      <div v-if="ticket.status === 'pending'" class="p-6 border-t border-gray-700 flex justify-end">
        <UButton
          color="red"
          variant="soft"
          icon="i-heroicons-x-mark"
          :loading="cancelling"
          @click="cancelTicket"
        >
          Hủy vé
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const ticketId = route.params.id;
const { user } = useAuth();
const toast = useToast();
const cancelling = ref(false);

const { data: ticket, pending, error, refresh } = await useAsyncData(
  `ticket-${ticketId}`,
  async () => {
    if (!ticketId) return null;
    
    try {
      // Fetch ticket data
      const ticketResponse = await $fetch(`http://localhost:3001/Tickets/${ticketId}`);
      
      // Check if this ticket belongs to the current user
      if (ticketResponse.user_id !== user.value?.id) {
        throw new Error('Bạn không có quyền xem vé này');
      }
      
      // Fetch showtime data
      const showtimeResponse = await $fetch(`http://localhost:3001/Showtimes?id=${ticketResponse.showtime_id}`);
      const showtimeData = showtimeResponse?.[0] || {};
      
      // Return enhanced ticket data
      return {
        ...ticketResponse,
        movie_name: showtimeData.movie_name || 'Unknown',
        showtime: showtimeData.showtime || 'Unknown',
        screen: showtimeData.screen_id || 'Unknown',
        theater: showtimeData.theater_name || 'Unknown',
      };
    } catch (err) {
      console.error('Error fetching ticket:', err);
      throw new Error('Không thể tải thông tin vé');
    }
  },
  {
    server: false
  }
);

// Generate QR code value
const qrValue = computed(() => {
  if (!ticket.value) return '';
  
  // Create a JSON object with ticket details for the QR code
  const qrData = {
    id: ticket.value.id,
    user_id: ticket.value.user_id,
    movie: ticket.value.movie_name,
    showtime: ticket.value.showtime,
    seat: ticket.value.seat_code,
    screen: ticket.value.screen,
    theater: ticket.value.theater
  };
  
  return JSON.stringify(qrData);
});

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

// Format showtime
const formatShowtime = (showtimeString) => {
  const date = new Date(showtimeString);
  return isNaN(date) ? 'Invalid time' : new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Format payment method
const formatPaymentMethod = (method) => {
  if (!method) return '';
  
  const methodMap = {
    'credit_card': 'Thẻ tín dụng',
    'cash': 'Tiền mặt',
    'momo': 'Ví MoMo',
    'zalopay': 'ZaloPay'
  };
  
  return methodMap[method] || method;
};

// Get ticket type text
const getTicketTypeText = (type) => {
  const typeMap = {
    'standard': 'Thường',
    'vip': 'VIP',
    'couple': 'Ghế đôi'
  };
  
  return typeMap[type] || type;
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

// Cancel ticket
const cancelTicket = async () => {
  if (!ticket.value || ticket.value.status !== 'pending') return;
  
  cancelling.value = true;
  
  try {
    // Update ticket status
    await $fetch(`http://localhost:3001/Tickets/${ticketId}`, {
      method: 'PATCH',
      body: {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      }
    });
    
    // Remove seat reservation
    const showtimeId = ticket.value.showtime_id;
    const seatCode = ticket.value.seat_code;
    
    const showtimeData = await $fetch(`http://localhost:3001/Showtimes/${showtimeId}`);
    const newOccupiedSeats = showtimeData.seat_reservations.filter(seat => seat !== seatCode);
    
    await $fetch(`http://localhost:3001/Showtimes/${showtimeId}`, {
      method: 'PATCH',
      body: {
        seat_reservations: newOccupiedSeats,
        updated_at: new Date().toISOString()
      }
    });
    
    // Refresh ticket data
    await refresh();
    
    toast.add({
      title: 'Hủy vé thành công',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    });
  } catch (err) {
    console.error('Error cancelling ticket:', err);
    toast.add({
      title: 'Lỗi khi hủy vé',
      description: err.message || 'Đã xảy ra lỗi, vui lòng thử lại',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    });
  } finally {
    cancelling.value = false;
  }
};
</script> 
