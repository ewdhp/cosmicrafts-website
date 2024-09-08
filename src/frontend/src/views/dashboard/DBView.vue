<template>
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
  .dashboard-button {
    padding: 10px 20px;
    margin: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    border-radius: 4px;
  }
  
  .dashboard-button:hover {
    background-color: #0056b3;
  }
  </style>