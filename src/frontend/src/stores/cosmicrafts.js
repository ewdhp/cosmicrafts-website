import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';

const F = Object.freeze({
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
            const funcTypes= Object.values(F);
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
        const funcNames = Object.values(F);
        const actions = funcNames.map(
        name => actor[`get_${name}`]());
        const data = await Promise.all(actions);
        actions.forEach((type, index) => { // falta de aqui pa arriba (type, index)
          this[type] = data[index];
        });

        this.updHashes();
      },

      updHashes() {
        Object.values(F).forEach(indexByName => {
          const str = JSON.stringify(
            this[indexByName], (key, value) =>
            typeof value === 'bigint' ? 
            value.toString() : value
          );
          this.hashes[indexByName] = md5(str);
        });
      },
      
      async hasChangedState(funcName) {
        await this.init();
        const data = await actor[`get_${funcName}`]();
        const str = JSON.stringify(stateVar, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value);
        const hash = md5(str);
        const index = funcName;
        if (hash !== this.hashes[index]) {
          this[index] = data;
          this.hashes[index] = hash;
        }
      },

      async reloadF() {
        const newState = {};
        const actions = this.$options.actions;
        const funcKeys = Object.keys(actions);   
        for (const funcName of funcKeys) {
          const i = funcName;
          if (typeof this[i] === 'function' 
            && i !== 'reloadF') {
            try {
              newState[i] = await this[i]();
            } catch (err) {
              console.error(
                ` Error: ${i}:`, 
                  err
              );
            }
          }
        }
        for (const [key, value] of 
          Object.entries(newState)) {
            const varName = key;
          if (varName in this.$state) {
            this.$state[varName] = value;
          }
        }
        this.updHashes();
      },

      async reloadF() {
        const functions = Object.values(F);
        for (const f of functions) {
          await this.hasChangedState(f);
        }
      },
    },
  };
});