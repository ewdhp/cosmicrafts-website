<script>
import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';
import { cosmicrafts } from 'declarations/cosmicrafts/index';

export default {
  setup() {
    const query = ref('');
    const results = ref([]);
    const isResultsVisible = ref(false);
    const loading = ref(false);

    // Debounce search function
    const debounceSearch = debounce(async () => {
      if (query.value.trim() === '') {
        results.value = [];
        isResultsVisible.value = false;
        return;
      }

      loading.value = true;
      isResultsVisible.value = true;

      try {
        const playerID = query.value.trim();
        const result = await cosmicrafts.ref_account_by(playerID);
        results.value = [result];
      } catch (error) {
        console.error('Error fetching results:', error);
        results.value = [];
      } finally {
        loading.value = false;
      }
    }, 300); // Debounce delay

    const onInput = () => {
      debounceSearch();
    };

    // Watch for changes in the query
    watch(query, (newQuery) => {
      if (newQuery.length === 0) {
        results.value = [];
        isResultsVisible.value = false;
      } else {
        debounceSearch(); // Use debounced function
      }
    });

    // Transition hooks
    const beforeEnter = (el) => {
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = 0;
    };

    const enter = (el, done) => {
      el.offsetHeight; // trigger reflow
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = 'translateY(0)';
      el.style.opacity = 1;
      done();
    };

    const leave = (el, done) => {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = 0;
      done();
    };

    return {
      query,
      results,
      isResultsVisible,
      loading,
      onInput,
      beforeEnter,
      enter,
      leave
    };
  }
};
</script>

<template>
  <div class="search-container">
    <div class="input-container">
      <input type="text" v-model="query" @input="onInput" placeholder="Search players..." />
      <transition name="slide-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <ul v-if="isResultsVisible && results.length" class="results-list">
          <li v-for="(result, index) in results" :key="index">
            <a :href="`/player/${result.playerID}`">{{ result.alias }}</a>
          </li>
        </ul>
      </transition>
      <div v-if="loading" class="loading">Loading...</div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.input-container {
  display: flex;
  width: 100%;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.results-list {
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  margin: 4px 0 0 0;
  /* Adjust margin to avoid overlap */
  padding: 0;
  list-style: none;
}

.results-list li {
  padding: 10px 15px;
}

.results-list li a {
  text-decoration: none;
  color: #333;
  display: block;
}

.results-list li a:hover {
  background-color: #f0f0f0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.loading {
  margin: 4px 0 0 0;
  /* Adjust margin to avoid overlap */
  width: 100%;
  padding: 8px;
  text-align: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
