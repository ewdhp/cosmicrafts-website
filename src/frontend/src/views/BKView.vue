<template>
   <LoadingSpinner :isLoading="cosmicrafts.loading" />
  <div>
    <h2>Motoko backend preview</h2>
    <div v-if="data">
      <div v-for="([key, value], index) in Object.entries(data)" :key="index">
        <h3>{{ String(key) }}</h3>
        <p>{{ formatValue(value) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useCosmicraftsStore } from '@/stores/cosmicrafts.js';
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';
export default {
  name: 'BackendView',
  components: {
    LoadingSpinner,
  },
  setup() {
    const data = ref(null);
    const cosmicrafts = useCosmicraftsStore();

    
    
    onMounted(async () => {
      // Load the store in the background
      cosmicrafts.loadStore().then(() => {
        // Update data if it has changed
        if (data.value !== cosmicrafts.module.player) {
          data.value = cosmicrafts.module.player;
        }
      });
    });

    // Watch for changes and update data
    watch(
      () => cosmicrafts.module.player,
      (newValue) => {      
          data.value = newValue;
      }
    );

    // Watch for changes in the store's loading state
    watch(() => cosmicrafts.loading, (newVal) => {
      console.log("Loading state changed: ", newVal);
    });


    const isObject = (value) => {
      return typeof value === 'object' && 
      value !== null && !Array.isArray(value);
    };

    const isArray = (value) => {
      return Array.isArray(value);
    };

    const formatValue = (value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      } else if (Array.isArray(value)) {
        return value.map(formatValue).join(', ');
      } else if (typeof value === 'object' && value !== null) {
        return Object.entries(value).map(
          ([key, val]) => `${key}: ${formatValue(val)}`
        ).join(', ');
      }
      return value;
    };

    return {
      data,
      formatValue,
      cosmicrafts,
    };
  }
};
</script>