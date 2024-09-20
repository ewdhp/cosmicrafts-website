import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';

const Func = Object.freeze({
  Player: 'player',
  Settings: 'settings',
  Referrals: 'referrals',
  Achs: 'achs',
  Stats: 'stats',
  Tokens: 'tokens',
  Tourneys: 'tourneys',
  Missions: 'missions',
  Tops: 'tops',
});

const hash = {
  player: '',
  settings: '',
  referrals: '',
  achs: '',
  stats: '',
  tokens: '',
  tourneys: '',
  missions: '',
  tops: '',
};

export const actor = defineStore(

  'cosmicrafts',

    () => {

      let actor = null;

  return {
    state: () => ({
      hash: hash,
      loadded: false,
      loading: true,
      player: false,
      settings: false,
      referrals: false,
      achs: false,
      stats: false,
      tokens: false,
      tourneys: false,
      missions: false,
      tops: false,
    }),

    actions: {
      async init() {
        if (!actor) {
          const factory = useCanisterStore();
          actor = await factory.get("cosmicrafts");
        }
      },

      async load() {
        try 
        {
          if (!this.loadded) {
            this.loading = true;
            await this.init();
            const funcTypes= Object.values(Func);
            const funcArray = names.map(
            name => actor[`get_${name}`]());
            const newState = await Promise.all(funcArray);
            funcTypes.forEach((type, key) => {
              this[type] = newState[key];
            });
            this.updHashes();
            this.loadded = true;
            this.loading = false;
          }
        } catch (error) {
          console.error(error);
        }
      },

      async fetchAllData() {
        const funcNames = Object.values(Func);
        const functions = funcNames.map(
        name => actor[`get_${name}`]());
        const data = await Promise.all(functions);
        funcNames.forEach((type, index) => {
          this[type] = data[index];
        });

        this.updHashes();
      },

      updHashes() {
        const funcNames = Object.values(Func);
        funcNames.forEach(type => {
          const str = JSON.stringify(this[type], (key, val) =>
            typeof value === 'bigint' ? val.toString() : val
          );
          this.hashes[type] = md5(str);
        });
      },
      
      async hasChangedState(type) {
        await this.init();
        const newState = await actor[`get_${funcName}`]();
        const str = JSON.stringify(newState, (key, val) =>
        typeof val === 'bigint' ? val.toString() : val);
        const newHash = md5(str);
        if (newHash !== this.hashes[type]) {
          this[type] = newState;
          this.hashes[type] = newHash;
        }
      },

      async reload() {
        const funcs = Object.keys(this.$options.actions);
        const results = {};

        for (const types of funcs) {
          if (typeof this[types] === 'function' && 
            types !== 'callAllActions') {
            try {
              results[types] = await this[types]();
            } catch (error) {
              console.error(`Error calling action ${types}:`, error);
            }
          }
        }
        for (const [key, val] of 
          Object.entries(results)) {
          if (key in this.$state) {
            this.$state[key] = val;
          }
        }
        this.updHashes();
      },

      async reloadFunc() {
        const funcNames = Object.values(Func);
        for (const types of funcNames) {
          await this.hasChangedState(types);
        }
      },
    },
  };
});