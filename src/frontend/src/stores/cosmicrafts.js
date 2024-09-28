import md5 from 'md5';
import { defineStore } from 'pinia';
import { useCanisterStore } from '@/stores/canister';
import { Principal } from '@dfinity/principal';

let functions = {
  get_player: null,
  get_tops: null,
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

const parseBigIntAndPrincipal = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(parseBigIntAndPrincipal);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v]) => [
          k, typeof v === 'bigint' ? v.toString() : 
          (
            v && v._isPrincipal ? principalToString(v) : 
            parseBigIntAndPrincipal(v)
          )
        ]
      )
    );
  }
  return obj;
};

const principalToString = (principal) => {
  return Principal.from(principal).toText();
};

export const useCosmicraftsStore = defineStore 
(
  'Cosmicrafts', {
    
  state: () => ({
    loading: true,
    actor: null,
    module: {},
    hashes: {},
  }),

  actions: {

    async loadStore() {
      console.log("Loading cosmicrafts store..."); 
      this.loading = true;
      this.loadState(); // Load state from localStorage
      await this.call(Object.keys(functions));
      this.loading = false;
      console.log("Cosmicrafts store loaded");        
    },
  
    async call(functions = {}) {
      const canister = useCanisterStore();
      this.actor = await canister.get('cosmicrafts');
      for (const func of functions) {
        const data = await this.actor[func]();
        const funcName = func.replace(/^get_/, ''); 
    
        if (funcName === 'player') {
          let i = 0;
          for (const key in playerData) {
            playerData[key] = data[i];
            i++;
          }
          this.module[funcName] = parseBigIntAndPrincipal(playerData);
        } else {
          this.module[funcName] = parseBigIntAndPrincipal(data);
        }
        
        const dataString = JSON.stringify(this.module[funcName], (key, value) => (
          typeof value === 'bigint' ? value.toString() : value
        ));         
        const newHash = md5(dataString);
    
        if (this.hashes[funcName] !== newHash) {
          console.log(`Hash mismatch for ${funcName}: ${this.hashes[funcName]} !== ${newHash}`);
          this.hashes[funcName] = newHash;
        } else {
          console.log(`Data not changed for ${funcName}: ${this.hashes[funcName]} === ${newHash}`);
        }    
      }
      this.updateHashes(this.module);
      this.saveState(); // Save state after updating hashes
    },
  
    updateHashes(module) {
      const dataTypes = Object.keys(module);
      dataTypes.forEach(type => {
        const str = JSON.stringify(module[type], (key, value) => (
          typeof value === 'bigint' ? value.toString() : value
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
      };
      const stateString = JSON.stringify(state, (key, value) => (
        typeof value === 'bigint' ? value.toString() : value
      ));
      localStorage.setItem('cosmicraftsState', stateString);
    },
  
    loadState() {
      const stateString = localStorage.getItem('cosmicraftsState');
      if (stateString) {
        const state = JSON.parse(stateString, (key, value) => (
          typeof value === 'string' && /^\d+n$/.test(value) ? BigInt(value.slice(0, -1)) : value
        ));
        console.log("Loaded state from localStorage:", state);
        this.module = state.module;
        this.actor = state.actor;
        this.hashes = state.hashes;
        this.loading = state.loading;
      }
    },
  },
});