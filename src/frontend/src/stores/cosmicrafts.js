import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';
import { Principal } from '@dfinity/principal';

let functions = {
  get_tops: null,
  get_achievements: null,

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

const principalToString = (principal) => {
  return Principal.from(principal).toText();
};

const convertBP = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertBP);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v]) => [
          k, typeof v === 'bigint' ? v.toString() :
            (
              v && v._isPrincipal ? principalToString(v) :
                convertBP(v)
            )
        ]
      )
    );
  }
  return obj;
};

export const useCosmicraftsStore = defineStore(

  'Cosmicrafts', {

  state: () => ({
    loadded: false,
    loading: true,
    actor: null,
    module: {},
    hashes: {},
  }),

  actions: {

    async loadStore() {
      console.log("this.loadded=", this.loadded);
      if (this.loadded == false) {
        console.log("Loading store...");
        this.loading = true;
        this.loadState();
        await this.call(
          Object.keys(functions)
        );
        this.loadded = true;
        this.loading = false;
        this.saveState();
        console.log("Store loaded");
      } else {
        console.log("Reloading store in background...");
        this.loadState();
        await this.call(
          Object.keys(
            functions
          )
        );
        this.saveState();
        console.log("Store reloaded");
      }
    },

    async call(functions = {}) {
      const canister = useCanisterStore();
      this.actor = await canister.get('cosmicrafts');
      console.log("Actor loaded:", this.actor);
      for (const func of functions) {
        console.log("Calling function:", func);
        const data = await this.actor[func]();
        const funcName = func.replace(/^get_/, '');
        if (funcName === 'player') {
          let i = 0;
          for (const key in playerData) {
            playerData[key] = data[i];
            i++;
          }
          this.module[funcName] =
            convertBP(playerData);
        } else {
          this.module[funcName] =
            convertBP(data);
        }
        const dataString = JSON.stringify(
          this.module[funcName], (key, value) => (
            typeof value === 'bigint'
              ? value.toString() : value
          ));
        const newHash = md5(dataString);
        if (this.hashes[funcName] !== newHash) {
          console.log(`
            Hash mismatch for 
            ${funcName}: 
            ${this.hashes[funcName]} !== ${newHash}`
          );
          this.hashes[funcName] = newHash;
        } else {
          console.log(
            `Data not changed for 
            ${funcName}: 
            ${this.hashes[funcName]} === ${newHash}`
          );
        }
      }
      this.updateHashes(this.module);
    },

    updateHashes(module) {
      const dataTypes = Object.keys(module);
      dataTypes.forEach(type => {
        const str = JSON.stringify(
          module[type], (key, value) => (
            typeof value === 'bigint' ?
              value.toString() : value
          ));
        this.hashes[type] = md5(str);
      });
    },

    saveState() {
      const state = {
        module: this.module,
        actor: this.actor,
        hashes: this.hashes,
        loading: this.loading,
        loadded: this.loadded,
      };
      const stateString = JSON.stringify(
        state, (key, value) => (
          typeof value === 'bigint' ?
            value.toString() : value
        ));
      localStorage.setItem(
        'cosmicraftsState',
        stateString
      );
    },

    loadState() {
      const stateString =
        localStorage.getItem('cosmicraftsState');
      if (stateString) {
        const state = JSON.parse(stateString,
          (key, value) => (
            typeof value === 'string' &&
              /^\d+n$/.test(value) ?
              convertBP(value.slice(0, -1)) : value
          ));
        console.log(
          "Loaded state from localStorage:",
          state
        );
        this.module = state.module;
        this.actor = state.actor;
        this.hashes = state.hashes;
        this.loading = state.loading;
        this.loadded = state.loadded;
      }
    },
  },
});