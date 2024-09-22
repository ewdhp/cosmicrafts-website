<template>
  <div>
    <h2>Motoko backend preview</h2>
    <div v-if="data">
      <div v-for="(value, key) in data" :key="key">
        <h3>{{ key }}</h3>
        <p>{{ formatValue(value) }}</p>
        
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useCosmicraftsStore } from '@/stores/cosmicrafts.js';

export default {
  name: 'BackendView',
  components: {
  },
  setup() {

    const data = ref(null);

    onMounted(async () => {
      const cosmicrafts = await useCosmicraftsStore();
      data.value = cosmicrafts.all;
    });

    const isObject = (value) => {
      return typeof value === 'object' && value !== null && !Array.isArray(value);
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
        return Object.entries(value).map(([key, val]) => `${key}: ${formatValue(val)}`).join(', ');
      }
      return value;
    };

    return {
      data,
      isObject,
      isArray,
      formatValue
    };
  }
};
</script>