<script>
import { ref, computed, onMounted } from 'vue';
import { useTopPlayersStore } from '@/stores/tops.js';
import TableMenuView from '@/components/TableMenuView.vue';

export default {
  components: {
    TableMenuView,
  },
  setup() {
    const topPlayersStore = useTopPlayersStore();

    const fetchTops = async () => {
      await topPlayersStore.fetchTopReferrals(0);
      await topPlayersStore.fetchTopELOPlayers(0);
      await topPlayersStore.fetchTopNFTPlayers(0);
      await topPlayersStore.fetchTopAchievementPlayers(0);
      await topPlayersStore.fetchTopLevelPlayers(0);
    };

    onMounted(async () => {
      await fetchTops();
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
      
      // Call the function with argument 0 if it exists
      if (fetchFunction) {
        await fetchFunction(0);
      }
    };

    return {
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
    <TableMenuView 
      :menuItems="topTypes" 
      :selectedItem="selectedType" 
      :tableHeaders="tableHeaders" 
      :tableData="selectedTop" 
      @update:selectedItem="fetchTopPlayers" 
    />
  </div>
</template>
