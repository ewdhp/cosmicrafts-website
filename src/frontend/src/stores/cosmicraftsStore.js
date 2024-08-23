import { defineStore } from 'pinia';
import { fetchPlayerData } from '@/services/CosmicraftsService';

export const useCosmicraftsStore = defineStore('cosmicrafts', {
  state: () => ({
    playerData: null,
  }),
  actions: {
    async fetchPlayerData(canisterId, account) {
      this.playerData = await fetchPlayerData(canisterId, account);
    },
  },
});
