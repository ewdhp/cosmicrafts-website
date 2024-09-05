// /stores/canisterStore.js
import { defineStore } from 'pinia';
import {cosmicrafts} from '../../../declarations/cosmicrafts/index.js';

export const useCanisterStore = defineStore('canister', () => {
  const canisters = {};
  const get = async (canisterName) => {
    if (!canisters[canisterName]) {
      canisters[canisterName] = cosmicrafts;  
    }
    return canisters[canisterName];
  };
  return {
    get,
  };
});
export default useCanisterStore;
