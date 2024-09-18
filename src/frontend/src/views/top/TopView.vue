<script>
import { ref, computed } from 'vue';
import { useTopPlayersStore } from '@/stores/tops.js';
import TableMenu from '@/components/TableMenu.vue';

export default {
  components: {
    TableMenu,
  },
  setup() {
    const topPlayersStore = useTopPlayersStore();
    const selectedType = ref(null);
    const topTypes = [
      { id: 'Referrals', name: 'Referrals' },
      { id: 'ELO', name: 'ELO' },
      { id: 'NFTs', name: 'NFTs' },
      { id: 'Achievements', name: 'Achievements' },
      { id: 'Level', name: 'Level' },
    ];

    const fetchTopPlayers = async (type) => {
      selectedType.value = type;
      const fetchFunctions = {
        'Referrals': topPlayersStore.fetchTopReferrals,
        'ELO': topPlayersStore.fetchTopELOPlayers,
        'NFTs': topPlayersStore.fetchTopNFTPlayers,
        'Achievements': topPlayersStore.fetchTopAchievementPlayers,
        'Level': topPlayersStore.fetchTopLevelPlayers,
      };
      await fetchFunctionstype;
    };

    const selectedPlayers = computed(() => {
      const playerTypes = {
        'Referrals': topPlayersStore.topREF,
        'ELO': topPlayersStore.topELO,
        'NFTs': topPlayersStore.topNFT,
        'Achievements': topPlayersStore.topACH,
        'Level': topPlayersStore.topLEV,
      };
      return playerTypes[selectedType.value] || [];
    });

    const tableHeaders = computed(() => {
      if (selectedPlayers.value.length > 0) {
        return Object.keys(selectedPlayers.value[0]);
      }
      return [];
    });

    return {
      selectedType,
      topTypes,
      fetchTopPlayers,
      selectedPlayers,
      tableHeaders,
    };
  },
};
</script>

<template>
  <div>
    <TableMenu 
      :menuItems="topTypes" 
      :selectedItem="selectedType" 
      :tableHeaders="tableHeaders" 
      :tableData="selectedPlayers" 
      @update:selectedItem="fetchTopPlayers" 
    />
  </div>
</template>
