<template>
  <div>
   
    <ListH :items="topTypes" :selectedItem="selectedType" @update:selectedItem="fetchTopPlayers" />
    <div v-if="selectedType">
      <table>
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in selectedPlayers" :key="player.id">
            <td v-for="header in tableHeaders" :key="header">{{ player[header] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useTopPlayersStore } from '@/stores/tops.js';
import ListH from '@/components/navs/ListH.vue';

export default {
  components: {
    ListH,
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
      switch (type) {
        case 'Referrals':
          await topPlayersStore.fetchTopReferrals();
          break;
        case 'ELO':
          await topPlayersStore.fetchTopELOPlayers();
          break;
        case 'NFTs':
          await topPlayersStore.fetchTopNFTPlayers();
          break;
        case 'Achievements':
          await topPlayersStore.fetchTopAchievementPlayers();
          break;
        case 'Level':
          await topPlayersStore.fetchTopLevelPlayers();
          break;
      }
    };

    const selectedPlayers = computed(() => {
      switch (selectedType.value) {
        case 'Referrals':
          return topPlayersStore.topREF;
        case 'ELO':
          return topPlayersStore.topELO;
        case 'NFTs':
          return topPlayersStore.topNFT;
        case 'Achievements':
          return topPlayersStore.topACH;
        case 'Level':
          return topPlayersStore.topLEV;
        default:
          return [];
      }
    });

    const tableHeaders = computed(() => {
      if (selectedPlayers.value.length > 0) {
        return Object.keys(selectedPlayers.value[0]);
      }
      return [];
    });

    return {
      topPlayersStore,
      selectedType,
      topTypes,
      fetchTopPlayers,
      selectedPlayers,
      tableHeaders,
    };
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #0c0b0b;
  text-align: left;
}

tr:nth-child(even) {

}

tr:hover {
  background-color: #ddd;
}
</style>
