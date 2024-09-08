<template>
  <span>Dashboard</span>
    <div>
      <button class="dashboard-button">Dashboard</button>
      <LoadingSpinner :isLoading="loading" />
      <div v-if="!loading">
        <!-- Content goes here -->
      </div>
    </div>
</template>
  
  <script>
  import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';
import MainLayout from '../layout/MainLayout.vue';
  
  export default {
    name: 'DBView',
    components: {
      LoadingSpinner
    },
    data() {
      return {
        loading: false
      };
    },
    methods: {
  
    },
    async mounted() {
  
    }
  };
  </script>
  
  <style scoped>

  </style>