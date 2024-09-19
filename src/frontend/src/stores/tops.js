import { defineStore } from 'pinia';
import useCanisterStore from '@/stores/canister.js';
import md5 from 'md5'; // Assuming you have an md5 library installed

export const useTopPlayersStore = defineStore('topPlayers', {
  state: () => ({
    loading: true,
    loaded: false,
    topREF: [],
    topELO: [],
    topNFT: [],
    topACH: [],
    topLEV: [],
    dataHash: '', // Store the hash/checksum of the data
  }),
  actions: {
    async loadStore() {
      this.loading = true;
      if (!this.loaded) {
        await this.fetchTopReferrals(0);
        await this.fetchTopELOPlayers(0);
        await this.fetchTopNFTPlayers(0);
        await this.fetchTopAchievementPlayers(0);
        await this.fetchTopLevelPlayers(0);
        this.loaded = true;
        this.updateDataHash(); // Update the hash/checksum after loading data
      }
      this.loading = false;
    },
    async fetchTopReferrals() {
      this.loading = true;
      const canister = useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topREF = await c.getTopReferrals(0);
      this.loading = false;
    },
    async fetchTopELOPlayers() {
      this.loading = true;
      const canister = useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topELO = await c.getTopELOPlayers(0);
      this.loading = false;
    },
    async fetchTopNFTPlayers() {
      this.loading = true;
      const canister = useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topNFT = await c.getTopNFTPlayers(0);
      this.loading = false;
    },
    async fetchTopAchievementPlayers() {
      this.loading = true;
      const canister = useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topACH = await c.getTopAchievementPlayers(0);
      this.loading = false;
    },
    async fetchTopLevelPlayers() {
      this.loading = true;
      const canister = useCanisterStore();
      const c = await canister.get('cosmicrafts');
      this.topLEV = await c.getTopLevelPlayers(0);
      this.loading = false;
    },
    updateDataHash() {
      const data = [
        ...this.topREF,
        ...this.topELO,
        ...this.topNFT,
        ...this.topACH,
        ...this.topLEV,
      ];
      const dataString = JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
      this.dataHash = md5(dataString); // Compute and store the hash/checksum
    },
    async reloadDataIfChanged() {
      const canister = useCanisterStore();
      const c = await canister.get('cosmicrafts');
      const newTopREF = await c.getTopReferrals(0);
      const newTopELO = await c.getTopELOPlayers(0);
      const newTopNFT = await c.getTopNFTPlayers(0);
      const newTopACH = await c.getTopAchievementPlayers(0);
      const newTopLEV = await c.getTopLevelPlayers(0);

      const newData = [
        ...newTopREF,
        ...newTopELO,
        ...newTopNFT,
        ...newTopACH,
        ...newTopLEV,
      ];
      const newDataString = JSON.stringify(newData, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
      const newHash = md5(newDataString);

      if (newHash !== this.dataHash) {
        this.topREF = newTopREF;
        this.topELO = newTopELO;
        this.topNFT = newTopNFT;
        this.topACH = newTopACH;
        this.topLEV = newTopLEV;
        this.updateDataHash();        
      }
    },
  },
});