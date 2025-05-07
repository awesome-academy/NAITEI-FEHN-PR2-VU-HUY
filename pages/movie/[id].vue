<!-- pages/movie/[id].vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <ULoader size="lg" color="primary" />
    </div>

    <div v-else-if="error" class="container mx-auto px-4 py-8 flex justify-center items-start min-h-screen">
      <UAlert type="danger" title="Error loading movie details">
        {{ error }}
      </UAlert>
    </div>

    <template v-else>
      <!-- Movie Hero Section -->
      <div class="relative">
        <div class="">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Movie Poster -->
            <div class="w-full md:w-1/4">
              <img :src="movie.poster" :alt="`${movie.title} Poster`" class="rounded-lg w-full">
              <Button class="w-full mt-4" @click="scrollToCinemaSelection">Book tickets</Button>
            </div>

            <!-- Movie Details -->
            <div class="w-full md:w-3/4">
              <div class="flex items-center gap-2 mb-2">
                <h1 class="text-2xl font-bold">{{ movie.title }}</h1>
                <span v-if="movie.warning" class="text-yellow-400 text-2xl">⚠️</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">DIRECTORS</h3>
                  <p>{{ movie.directors }}</p>
                </div>
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">RUNTIME</h3>
                  <p>{{ movie.duration }} minutes</p>
                </div>
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">CAST</h3>
                  <p>{{ movie.casts }}</p>
                </div>
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">RELEASE DATE</h3>
                  <p>{{ formatReleaseDate(movie.release_date) }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-4">
                <div v-for="(genre, index) in movie.genre" :key="index">
                  <span class="bg-transparent text-gray-200 text-sm font-semibold px-2 py-1 border border-white rounded">
                    {{ genre }}
                  </span>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">SYNOPSIS</h3>
                <p class="text-gray-200">
                  {{ movie.synopsis }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trailer Section -->
      <div class="my-12">
        <PageTitle>Watch the Trailer</PageTitle>
        <div class="relative aspect-video max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden">
          <iframe
            :src="trailerEmbedUrl"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Showtimes Section -->
      <CinemaSelection id="cinema-selection" class="mt-4" :movie="movie" :showtimes="movie.showtimes" />

      <div class="border-t-1 my-8">
        <div class="flex border-b-1 py-4 flex-col md:flex-row items-center">
          <div class="w-full md:w-1/4">
            <img src="/images/family-films.jpg" alt="Family Tickets" class="w-full">
          </div>
          <div class="w-full md:w-2/4 p-4">
            <h3 class="text-xl font-bold mb-2">CINEMA MAGIC FOR LESS WITH OUR FAMILY TICKETS</h3>
            <p class="mb-4">Round up the kids! Grab some popcorn! And get ready to explore new worlds together.</p>
            <p class="text-sm">
              At ODEON, you can be sure to find something that the whole family can enjoy, and with our brilliant value <strong>Adult and Child Tickets</strong>, where the adults pay kids' prices, you can look forward to affordable, fun days out whatever the weather.
            </p>
          </div>
          <div class="w-full md:w-1/4 flex justify-center items-center">
            <Button>Find out more</Button>
          </div>
        </div>

        <div class="flex border-b-1 py-4 flex-col md:flex-row items-center">
          <div class="w-full md:w-1/4">
            <img src="/images/family-films.jpg" alt="Family Tickets" class="w-full">
          </div>
          <div class="w-full md:w-2/4 p-4">
            <h3 class="text-xl font-bold mb-2">CINEMA MAGIC FOR LESS WITH OUR FAMILY TICKETS</h3>
            <p class="mb-4">Round up the kids! Grab some popcorn! And get ready to explore new worlds together.</p>
            <p class="text-sm">
              At ODEON, you can be sure to find something that the whole family can enjoy, and with our brilliant value <strong>Adult and Child Tickets</strong>, where the adults pay kids' prices, you can look forward to affordable, fun days out whatever the weather.
            </p>
          </div>
          <div class="w-full md:w-1/4 flex justify-center items-center">
            <Button>Find your cinema</Button>
          </div>
        </div>
      </div>

      <!-- Ratings Section -->
      <div class="my-12">
        <PageTitle>User Ratings & Reviews</PageTitle>

        <!-- Average Rating Display -->
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center gap-1">
            <span class="text-3xl font-bold">{{ averageRating }}</span>
            <span class="text-xl">/5</span>
          </div>
          <div class="flex">
            <span v-for="i in 5" :key="i" class="text-2xl">
              <span v-if="i <= Math.round(averageRating)" class="text-yellow-400">★</span>
              <span v-else class="text-gray-400">★</span>
            </span>
          </div>
          <span class="text-gray-400">({{ movie.ratings ? movie.ratings.length : 0 }} ratings)</span>
        </div>

        <!-- Rating Form -->
        <div v-if="isLoggedIn" class="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 class="text-xl font-bold mb-4">Add Your Review</h3>
          <form @submit.prevent="submitRating">
            <div class="mb-4">
              <label class="block text-gray-400 mb-2">Your Rating</label>
              <div class="flex gap-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="newRating = i"
                  class="text-2xl focus:outline-none"
                >
                  <span v-if="i <= newRating" class="text-yellow-400">★</span>
                  <span v-else class="text-gray-400">★</span>
                </button>
              </div>
            </div>
            <div class="mb-4">
              <label for="comment" class="block text-gray-400 mb-2">Your Comment</label>
              <textarea
                id="comment"
                v-model="newComment"
                rows="4"
                class="w-full p-2 bg-gray-700 rounded-md"
                placeholder="Share your thoughts about this movie..."
              ></textarea>
            </div>
            <div class="flex justify-end">
              <Button type="submit" :disabled="submitting">
                <span v-if="submitting">Submitting...</span>
                <span v-else>Submit Review</span>
              </Button>
            </div>
          </form>
        </div>
        <div v-else class="bg-gray-800 p-6 rounded-lg mb-8 text-center">
          <p class="mb-4">Please log in to add your review</p>
          <NuxtLink :to="`/login?returnUrl=${encodeURIComponent($route.fullPath)}`" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Log In to Review
          </NuxtLink>
        </div>

        <!-- User Reviews List -->
        <div v-if="movie.ratings && movie.ratings.length > 0">
          <h3 class="text-xl font-bold mb-4">User Reviews</h3>
          <div class="space-y-6">
            <div v-for="(rating, index) in movie.ratings" :key="index" class="bg-gray-800 p-4 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ rating.user_name }}</span>
                    <div class="flex">
                      <span v-for="i in 5" :key="i" class="text-lg">
                        <span v-if="i <= rating.rating" class="text-yellow-400">★</span>
                        <span v-else class="text-gray-400">★</span>
                      </span>
                    </div>
                  </div>
                  <span class="text-sm text-gray-400">{{ formatReviewDate(rating.date) }}</span>
                </div>
                <button
                  v-if="isLoggedIn && currentUser.id === rating.user_id"
                  @click="deleteRating(rating)"
                  class="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
              <p class="text-gray-200">{{ rating.comment }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          No reviews yet. Be the first to review this movie!
        </div>
      </div>

      <!-- Related Article -->
      <div v-if="articles.length > 0" class="max-w-7xl mx-auto px-4 py-12">
        <PageTitle>Related Article</PageTitle>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <div class="flex justify-center mt-8">
          <NuxtLink
            :to="'/news'"
            class="bg-blue-800 hover:bg-blue-900 text-white px-6 py-4 font-medium "
            style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)"
          >
            Browse All News
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const { user, isAuthenticated } = useAuth();
const isLoggedIn = isAuthenticated;
const currentUser = user;
const toast = useToast();
const route = useRoute();

const movie = ref({});
const loading = ref(true);
const error = ref(null);
const articles = ref([]);
const newRating = ref(0);
const newComment = ref('');
const submitting = ref(false);

const { data: articlesData } = await useFetch('http://localhost:3001/News', {
  transform: (data) => {
    return data.map(article => ({
      ...article,
      imageUrl: article.image_url,
    }));
  }
});

articles.value = articlesData.value.filter(article =>
  article.related_movies.some(movie =>
    movie.movie_id == route.params.id
  )
);


onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch(`http://localhost:3001/Movies/${route.params.id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    movie.value = await response.json();

    movie.value.casts = movie.value.casts.join(', ');
    movie.value.directors = movie.value.directors.join(', ');
    movie.value.genre = movie.value.genre.split(', ');

    if (movie.value.ratings.length > 0) {
      console.log('movie.value.ratings:', movie.value.ratings);
    }

    const showtimes = await fetch(`http://localhost:3001/Showtimes?movie_id=${route.params.id}`);
    if (!showtimes.ok) {
      throw new Error('Failed to fetch showtimes');
    }
    const showtimesData = await showtimes.json();
    movie.value.showtimes = showtimesData.map(showtime => ({
      id: showtime.id,
      time: showtime.showtime,
      theater: showtime.theater_id,
      screen: showtime.screen_id,
      amenities: showtime.amenities,
    }));

    console.log('movie.value:', movie.value);

  } catch (err) {
    console.error('Error fetching movie details:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

const averageRating = computed(() => {
  if (!movie.value.ratings || movie.value.ratings.length === 0) {
    return 0;
  }

  const sum = movie.value.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / movie.value.ratings.length).toFixed(1);
});

const formatReleaseDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatReviewDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const submitRating = async () => {
  if (!isLoggedIn.value) {
    toast.error('Please log in to submit a review');
    return;
  }

  if (newRating.value === 0) {
    toast.error('Please select a rating');
    return;
  }

  try {
    submitting.value = true;

    // Check if user already left a rating
    const existingRatingIndex = movie.value.ratings.findIndex(r => r.user_id == currentUser.value.id);

    const ratingData = {
      user_id: currentUser.value.id,
      user_name: currentUser.value.name,
      rating: newRating.value,
      comment: newComment.value,
      date: new Date().toISOString()
    };

    if (existingRatingIndex >= 0) {
      movie.value.ratings[existingRatingIndex] = ratingData;
    } else {
      // Add new rating
      movie.value.ratings.push(ratingData);
    }

    const response = await fetch(`http://localhost:3001/Movies/${movie.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ratings: movie.value.ratings
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }

    toast.success('Your review has been submitted!');
    newRating.value = 0;
    newComment.value = '';

  } catch (err) {
    console.error('Error submitting rating:', err);
    toast.error(err.message || 'Failed to submit rating');
  } finally {
    submitting.value = false;
  }
};

const deleteRating = async (rating) => {
  if (!confirm('Are you sure you want to delete your review?')) {
    return;
  }

  try {
    const updatedRatings = movie.value.ratings.filter(r => r.user_id != rating.user_id);

    const response = await fetch(`http://localhost:3001/Movies/${movie.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ratings: updatedRatings
      })
    });

    if (!response.ok) {
      throw new Error('Failed to delete rating');
    }

    movie.value.ratings = updatedRatings;
    toast.success('Your review has been deleted');

  } catch (err) {
    console.error('Error deleting rating:', err);
    toast.error(err.message || 'Failed to delete rating');
  }
};

const scrollToCinemaSelection = () => {
  const element = document.getElementById('cinema-selection');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const trailerEmbedUrl = computed(() => {
  if (movie.value.trailer.includes('youtube.com/watch?v=')) {
    const videoId = movie.value.trailer.split('v=')[1].split('&')[0]
    console.log('videoId:', videoId)
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }

  return movie.value.trailer
})
</script>
