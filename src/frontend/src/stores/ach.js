import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth.js';
import { useCanisterStore } from './canister.js';

export const useACHStore = defineStore('ach', {
  state: () => ({
    categories : {},
    lines : {},
    individual :{},
    fetched : false,
    loading : true,
  }),
  actions: {
    async fetchAchievements() {
      const canister = useCanisterStore();
      const cosmicrafts = await canister.get("cosmicrafts");

      const authStore = useAuthStore();
      const principalIdString = await authStore.getPrincipalId();
      const principalId = Principal.fromText(principalIdString);

      try {
        console.log('Fetching achievements for principal ID:', principalId.toText());       
        const [categories, lines, individual] = await cosmicrafts.getAchievementsView()
        this.categories = categories;
        this.lines = lines;
        this.individual = individual;
      } catch (error) {
        console.error('Failed to fetch player stats:', error);
        throw error;
      }
      return [this.categories, this.lines, this.individual];
    }
  }
});