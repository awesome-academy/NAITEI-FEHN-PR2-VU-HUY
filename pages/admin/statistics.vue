<template>
  <div class="max-w-6xl mx-auto px-4">
    <PageTitle>STATISTICS</PageTitle>

    <div v-if="pending" class="text-center text-white py-8">
      Loading...
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>
    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          label="REVENUE"
          :value="formatVND(statisticsData.revenue)"
          bg-color="bg-purple-500"
        >
          <Icon name="hugeicons:money-bag-02" size="14px" class="text-black" />
        </SummaryCard>
        <SummaryCard
          label="TICKETS SOLD"
          :value="statisticsData.ticketsSold"
          bg-color="bg-pink-500"
        >
          <Icon name="famicons:ticket-outline" size="14px" class="text-black" />
        </SummaryCard>
        <SummaryCard
          label="MOVIES"
          :value="statisticsData.movies"
          bg-color="bg-blue-400"
        >
          <Icon name="fluent:movies-and-tv-20-regular" size="14px" class="text-black" />
        </SummaryCard>
        <SummaryCard
          label="USERS"
          :value="statisticsData.users"
          bg-color="bg-teal-500"
        >
          <Icon name="uil:users-alt" size="14px" class="text-black" />
        </SummaryCard>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-6">
        <RevenueChart
          :stats-data="statsData"
          :week-data="weekData"
          :month-data="monthData"
          :quarter-data="quarterData"
          :year-data="yearData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const statisticsData = ref({
  revenue: 0,
  ticketsSold: 0,
  movies: 0,
  users: 0,
});
const statsData = ref({});
const weekData = ref({});
const monthData = ref({});
const quarterData = ref({});
const yearData = ref({});
const error = ref(null);
const pending = ref(true)

const baseUrl = 'http://localhost:3001';

async function fetchDashboardData() {
  try {
    // Fetch Tickets
    const { data: ticketsData } = await useFetch(`${baseUrl}/Tickets?status=confirmed`);
    const tickets = ticketsData.value || [];

    // Calculate Revenue (sum of price for confirmed tickets)
    statisticsData.value.revenue = tickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0);

    // Calculate Tickets Sold (count of confirmed tickets)
    statisticsData.value.ticketsSold = tickets.length.toString();

    // Fetch Movies
    const { data: moviesData } = await useFetch(`${baseUrl}/Movies`);
    statisticsData.value.movies = moviesData.value?.length.toString() || 0;

    // Fetch Users
    const { data: usersData } = await useFetch(`${baseUrl}/Users`);
    statisticsData.value.users = usersData.value?.length.toString() || 0;

    // Calculate stats for each period
    statsData.value = {
      week: calculateStatsWithGrowth(
        tickets,
        getPeriodDates('week').current.start,
        getPeriodDates('week').current.end,
        getPeriodDates('week').previous.start,
        getPeriodDates('week').previous.end
      ),
      month: calculateStatsWithGrowth(
        tickets,
        getPeriodDates('month').current.start,
        getPeriodDates('month').current.end,
        getPeriodDates('month').previous.start,
        getPeriodDates('month').previous.end
      ),
      quarter: calculateStatsWithGrowth(
        tickets,
        getPeriodDates('quarter').current.start,
        getPeriodDates('quarter').current.end,
        getPeriodDates('quarter').previous.start,
        getPeriodDates('quarter').previous.end
      ),
      year: calculateStatsWithGrowth(
        tickets,
        getPeriodDates('year').current.start,
        getPeriodDates('year').current.end,
        getPeriodDates('year').previous.start,
        getPeriodDates('year').previous.end
      )}

    // Generate chart data
    const week = groupByPeriod(tickets, 'week', getPeriodDates('week').current.start, getPeriodDates('week').current.end);
    weekData.value = {
      labels: week.labels,
      datasets: [
        {
          label: 'Revenue',
          backgroundColor: '#20c997',
          data: week.data.revenue,
        },
        {
          label: 'Ticket',
          backgroundColor: '#1e3a8a',
          data: week.data.tickets,
        },
      ],
    };

    const month = groupByPeriod(tickets, 'month', getPeriodDates('month').current.start, getPeriodDates('month').current.end);
    monthData.value = {
      labels: month.labels,
      datasets: [
        {
          label: 'Revenue',
          backgroundColor: '#20c997',
          data: month.data.revenue,
        },
        {
          label: 'Ticket',
          backgroundColor: '#1e3a8a',
          data: month.data.tickets,
        },
      ],
    };

    const quarter = groupByPeriod(tickets, 'quarter', getPeriodDates('quarter').current.start, getPeriodDates('quarter').current.end);
    quarterData.value = {
      labels: quarter.labels,
      datasets: [
        {
          label: 'Revenue',
          borderColor: '#20c997',
          backgroundColor: 'rgba(32, 201, 151, 0.1)',
          tension: 0.4,
          data: quarter.data.revenue,
        },
        {
          label: 'Ticket',
          borderColor: '#1e3a8a',
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          tension: 0.4,
          data: quarter.data.tickets,
        },
      ],
    };

    const year = groupByPeriod(tickets, 'year', getPeriodDates('year').current.start, getPeriodDates('year').current.end);
    yearData.value = {
      labels: year.labels,
      datasets: [
        {
          label: 'Revenue',
          borderColor: '#20c997',
          backgroundColor: 'rgba(32, 201, 151, 0.1)',
          tension: 0.4,
          data: year.data.revenue,
        },
        {
          label: 'Ticket',
          borderColor: '#1e3a8a',
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          tension: 0.4,
          data: year.data.tickets,
        },
      ],
    };
  } catch (err) {
    error.value = 'Failed to fetch data. Please ensure JSON Server is running.';
    console.error(err);
  } finally {
    pending.value = false
  }
}

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getPeriodDates = (period, currentDate = new Date()) => {
  const start = new Date(currentDate);
  const end = new Date(currentDate);
  let prevStart, prevEnd;

  switch (period) {
    case 'week':
      start.setDate(start.getDate() - start.getDay()); // Start of current week (Sunday)
      end.setDate(start.getDate() + 6); // End of current week (Saturday)
      prevStart = new Date(start);
      prevStart.setDate(start.getDate() - 7); // Previous week start
      prevEnd = new Date(start);
      prevEnd.setDate(start.getDate() - 1); // Previous week end
      break;
    case 'month':
      start.setDate(1); // Start of current month
      end.setMonth(end.getMonth() + 1, 0); // End of current month
      prevStart = new Date(start);
      prevStart.setMonth(start.getMonth() - 1); // Previous month start
      prevEnd = new Date(start);
      prevEnd.setDate(0); // Previous month end
      break;
    case 'quarter':
      start.setMonth(Math.floor(start.getMonth() / 3) * 3); // Start of current quarter
      start.setDate(1);
      end.setMonth(start.getMonth() + 3, 0); // End of current quarter
      prevStart = new Date(start);
      prevStart.setMonth(start.getMonth() - 3); // Previous quarter start
      prevEnd = new Date(start);
      prevEnd.setDate(0); // Previous quarter end
      break;
    case 'year':
      start.setMonth(0, 1); // Start of current year
      end.setMonth(11, 31); // End of current year
      prevStart = new Date(start);
      prevStart.setFullYear(start.getFullYear() - 1); // Previous year start
      prevEnd = new Date(end);
      prevEnd.setFullYear(end.getFullYear() - 1); // Previous year end
      break;
  }

  return { current: { start, end }, previous: { start: prevStart, end: prevEnd } };
};

// Calculate stats for a period, returning raw revenue for conversion calculation
const calculatePeriodStats = (tickets, start, end) => {
  const periodTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.created_at);
    return ticketDate >= start && ticketDate <= end;
  });

  const revenue = periodTickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0);

  return { formattedValue: formatVND(revenue), rawRevenue: revenue };
};

// Calculate stats with conversion rate based on revenue growth
const calculateStatsWithGrowth = (tickets, currentStart, currentEnd, previousStart, previousEnd) => {
  const current = calculatePeriodStats(tickets, currentStart, currentEnd);
  const previous = calculatePeriodStats(tickets, previousStart, previousEnd);

  let conversion = '0%';
  if (previous.rawRevenue > 0) {
    const growth = ((current.rawRevenue - previous.rawRevenue) / previous.rawRevenue) * 100;
    conversion = growth.toFixed(2) + '%';
  } else if (current.rawRevenue > 0) {
    conversion = '100%'; // If previous is 0 but current is positive, assume 100% growth
  }

  return {
    current: { value: current.formattedValue, conversion },
    previous: { value: previous.formattedValue },
  };
};

// Group tickets by period for chart data
const groupByPeriod = (tickets, period, startDate, endDate) => {
  const data = { revenue: [], tickets: [] };
  const labels = [];

  if (period === 'week') {
    // Daily data for 7 days
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      labels.push(day.toLocaleDateString('en-US', { weekday: 'long' }));
      const dayTickets = tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate.toDateString() === day.toDateString();
      });
      data.revenue.push(
        dayTickets.reduce((sum, t) => sum + (t.price || 0), 0)
      );
      data.tickets.push(dayTickets.length);
    }
  } else if (period === 'month') {
    // Weekly data for 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      labels.push(`Week ${i + 1}`);
      const weekTickets = tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= weekStart && ticketDate <= weekEnd;
      });
      data.revenue.push(
        weekTickets.reduce((sum, t) => sum + (t.price || 0), 0)
      );
      data.tickets.push(weekTickets.length);
    }
  } else if (period === 'quarter') {
    // Monthly data for 3 months
    for (let i = 0; i < 3; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
      labels.push(monthStart.toLocaleDateString('en-US', { month: 'long' }));
      const monthTickets = tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= monthStart && ticketDate <= monthEnd;
      });
      data.revenue.push(
        monthTickets.reduce((sum, t) => sum + (t.price || 0), 0)
      );
      data.tickets.push(monthTickets.length);
    }
  } else if (period === 'year') {
    // Quarterly data for 4 quarters
    for (let i = 0; i < 4; i++) {
      const quarterStart = new Date(startDate);
      quarterStart.setMonth(i * 3);
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3, 0);
      labels.push(`Q${i + 1}`);
      const quarterTickets = tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= quarterStart && ticketDate <= quarterEnd;
      });
      data.revenue.push(
        quarterTickets.reduce((sum, t) => sum + (t.price || 0), 0)
      );
      data.tickets.push(quarterTickets.length);
    }
  }

  return { labels, data };
};

onMounted(() => {
  fetchDashboardData()
})
</script>
