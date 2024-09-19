<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useTopPlayersStore } from '@/stores/tops.js';
import TableMenuView from '@/components/TableMenuView.vue';
import LoadingSpinner from '@/components/loading/LoadingSpinner.vue';
import md5 from 'md5'; // Assuming you have an md5 library installed

export default {
  components: {
    TableMenuView,
    LoadingSpinner,
  },
  setup() {
    const topPlayersStore = useTopPlayersStore();

    const checkAndReloadData = async () => {
      const currentData = [
        ...topPlayersStore.topREF,
        ...topPlayersStore.topELO,
        ...topPlayersStore.topNFT,
        ...topPlayersStore.topACH,
        ...topPlayersStore.topLEV,
      ];
      const currentDataString = JSON.stringify(currentData, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
      const currentHash = md5(currentDataString);
      if (currentHash !== topPlayersStore.dataHash) {
        await topPlayersStore.loadStore();
      }
    };

    onMounted(async () => {
      await checkAndReloadData();
      // Load data in the background and update if changed
      await topPlayersStore.reloadDataIfChanged();
    });

    const selectedType = ref(null);
    const topTypes = [
      { id: 'Referrals', name: 'Referrals' },
      { id: 'ELO', name: 'ELO' },
      { id: 'NFTs', name: 'NFTs' },
      { id: 'Achievements', name: 'Achievements' },
      { id: 'Level', name: 'Level' },
    ];

    const selectedTop = computed(() => {
      const topTypesMap = {
        'Referrals': topPlayersStore.topREF,
        'ELO': topPlayersStore.topELO,
        'NFTs': topPlayersStore.topNFT,
        'Achievements': topPlayersStore.topACH,
        'Level': topPlayersStore.topLEV,
      };
      return topTypesMap[selectedType.value] || [];
    });

    const tableHeaders = computed(() => {
      if (selectedTop.value.length > 0) {
        return Object.keys(selectedTop.value[0]);
      }
      return [];
    });

    const fetchTopPlayers = async (type) => {
      selectedType.value = type; // Update the selected type
      
      // Map of functions to fetch data based on type
      const fetchFunctions = {
        'Referrals': topPlayersStore.fetchTopReferrals,
        'ELO': topPlayersStore.fetchTopELOPlayers,
        'NFTs': topPlayersStore.fetchTopNFTPlayers,
        'Achievements': topPlayersStore.fetchTopAchievementPlayers,
        'Level': topPlayersStore.fetchTopLevelPlayers,
      };

      // Retrieve the function corresponding to the selected type
      const fetchFunction = fetchFunctions[type];
      console.log("TopView tops.loaded: ", topPlayersStore.loaded);
      // Call the function with argument 0 if it exists and the store is not already loaded
      if (fetchFunction && topPlayersStore.loaded == false) {
        await fetchFunction(0);
      }
    };

    // Watch for changes in the store's loading state
    watch(() => topPlayersStore.loading, (newVal) => {
      console.log("Loading state changed: ", newVal);
    });

    // Watch for changes in the store's data
    watch(() => topPlayersStore.topREF, (newVal) => {
      console.log("Top Referrals data changed: ", newVal);
    });

    return {
      topPlayersStore,
      selectedType,
      topTypes,
      fetchTopPlayers,
      selectedTop,
      tableHeaders,
    };
  },
};
</script>

<template>
  <div>
    <LoadingSpinner :isLoading="topPlayersStore.loading" />
    <TableMenuView 
      :menuItems="topTypes" 
      :selectedItem="selectedType" 
      :tableHeaders="tableHeaders" 
      :tableData="selectedTop" 
      @update:selectedItem="fetchTopPlayers" 
    />
  </div>
</template>