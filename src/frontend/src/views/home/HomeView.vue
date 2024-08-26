<script setup>
import { ref, onMounted } from 'vue';
import { useCosmicraftsStore } from '@/stores/cosmicraftsStore';

const store = useCosmicraftsStore();
const playerData = ref(null);

onMounted(async () => {
  await store.initialize();
  playerData.value = await store.fetchPlayerData('playerAccount'); // Replace 'playerAccount' with the actual account
});
</script>

<template>
  <div>
    <h1>Home</h1>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>