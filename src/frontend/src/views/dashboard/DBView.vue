<template>
  <h2>Dashboard</h2>
    <div>
      <LoadingSpinner :isLoading="loading" />
      <div v-if="!loading">
        <!-- Content goes here -->
      </div>
    </div>
</template>
  
<script>
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';
  
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
h2 {
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  margin-bottom: 1em;
}
  </style>