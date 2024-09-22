import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';
import { toRaw } from 'vue';

let actorFunctions = {
  get_all: null,
};

const data = {
  fullProfile: null,
  friendsList: null,
  allPlayers: null,
  generalMissions: null,
  userMissions: null,
  allTournaments: null,
  playerDeck: null,
  totalReferrals: null,
  multiplier: null,
  topReferrals: null,
  topELO: null,
  topNFT: null,
  topLevel: null,
  topAchievements: null,
  nfts: null,
  chests: null,
  avatars: null,
  characters: null,
  trophies: null,
  units: null,
  collectionOwner: null,
  achievements: null,
  friendRequests: null,
  privacySettings: null,
};

const cosmicraftsStore = defineStore('Cosmicrafts', {
  state: () => ({
    loadded: false,
    loading: false,
    actor: null,
    module: {},
    hashes: {},
  }),

  actions: {
    async load() {
      try {
        if (!this.actor) {
          this.loading = true;
          const canister = useCanisterStore();
          this.actor = await canister.get("cosmicrafts");
        }
        if (Object.keys(this.module).length === 0) {
          await this.call(Object.keys(actorFunctions));
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
      this.loading = false;
      this.loadded = true;
      console.log("Cosmicrafts loaded");
    },
    async call(functions = []) {
      if (!this.loadded) {
        for (const func of functions) {
          const data = await this.actor[func]();
          const dataString = JSON.stringify(
            data,
            (key, value) => (
              typeof value === 'bigint' 
              ? value.toString() : value)
          );
          const newHash = md5(dataString);
          const funcName = func.replace(/^get_/, ''); 
          if (this.hashes[funcName] !== newHash) {
            this.module[funcName] = data;
            this.hashes[funcName] = newHash;
          }
        }
        this.updateHashes(this.module);
        this.loadded = true;
        this.loading = false;
      }
    },
    updateHashes(module) {
      const dataTypes = Object.keys(module);
      dataTypes.forEach(type => {
        const str = JSON.stringify(
          module[type],
          (key, value) => (
            typeof value === 'bigint' 
            ? value.toString() : value)
        );
        this.hashes[type] = md5(str);
      });
    },
  },
});

export async function useCosmicraftsStore() {
  const store = cosmicraftsStore();
  await store.load();
 
  let i=0;
  for(const func in data) {
    data[func] = store.module.all[i];
    i++;
  }

  let cosmicrafts = {
    player: data,
    module: store.module,
    actor: store.actor,
  };
  console.log("Cosmicrafts loaded:");
  return cosmicrafts;
}