import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';

let actorViewFunctions = {
  get_tops: null,
  get_player: null,
  get_ach: null
};

const playerData = {
  fullProfile: null,
  friendsList: null,
  generalMissions: null,
  userMissions: null,
  allTournaments: null,
  playerDeck: null,
  totalReferrals: null,
  multiplier: null,
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

const cosmicraftsStore = 
defineStore(
  'Cosmicrafts', {
    
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
          await this.call(
            Object.keys(actorViewFunctions)
          );
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
          if (this.hashes[funcName] !== newHash) {u           
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
  for(const func in playerData) {
    playerData[func] = store.module.player[i];
    i++;
  }

  let cosmicrafts = {
    player: playerData,
    module: store.module,
    actor: store.actor,
    reloadView: store.call,
  };

  return cosmicrafts;
}