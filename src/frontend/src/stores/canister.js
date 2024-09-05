// /stores/canisterStore.js
import { defineStore } from 'pinia';
import {cosmicrafts} from '../../../declarations/cosmicrafts/index.js';
export const useCanisterStore = defineStore('canister', () => {
  const canisters = {};

  const get = async (canisterName) => {
    if (!canisters[canisterName]) {
      try {
        
        const [result, account] =  await cosmicrafts.getPlayerByCaller();
        console.log("result: "+result+" account: "+account);

        if (module && typeof module.name !== 'undefined') {
          canisters[canisterName] = module.name;
        } else {
          console.warn(`Module loaded but no 'name' export found for ${canisterName}`);
          canisters[canisterName] = null;
        }
      } catch (error) {
        console.error(`Failed to load canister ${canisterName}:`, error);
        canisters[canisterName] = null;
      }
    }
    return canisters[canisterName];
  };

  return {
    get,
  };
});
export default useCanisterStore;
