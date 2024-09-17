// src/stores/topPlayersStore.js
import { defineStore } from 'pinia';
import useCanisterStore from '@/stores/canister.js';

export const useTopPlayersStore = defineStore('topPlayers', {
  state: () => ({
    topREF: [],
    topELO: [],
    topNFT: [],
    topACH: [],
    topLEV: [],
  }),
  actions: {
    async fetchTopReferrals() {
      const canister= useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topREF = await c.getTopReferrals(0);
    },
    async fetchTopELOPlayers() {
      const canister= useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topELO = await c.getTopELOPlayers(0);
    },
    async fetchTopNFTPlayers() {
      const canister= useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topNFT = await c.getTopNFTPlayers(0);
    },
    async fetchTopAchievementPlayers() {
      const canister= useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topACH = await c.getTopAchievementPlayers(0);
    },
    async fetchTopLevelPlayers() {
      const canister= useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topLEV = await c.getTopLevelPlayers(0);
    },
  },
});