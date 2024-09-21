import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';

let DataViewFunctions = {
  get_player: null,
  get_settings: null,
  get_referrals: null,
  get_achievements: null,
  get_missions: null,
  get_tourneys: null,
  get_stats: null,
  get_tokens: null,
  get_tops: null,
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
          await this.call(Object.keys(DataViewFunctions));
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
          const strippedFunc = func.replace(/^get_/, ''); 
          if (this.hashes[strippedFunc] !== newHash) {
            this.module[strippedFunc] = data;
            this.hashes[strippedFunc] = newHash;
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
  let cosmicrafts = {
    views : store.module,
    actor : store.actor,
  }
  return cosmicrafts;
}