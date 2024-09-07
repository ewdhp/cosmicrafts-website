// /stores/canisterStore.js
import { defineStore } from 'pinia';
import { createActor, canisterId, cosmicrafts} from '../../../declarations/cosmicrafts/index.js';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import useAuthStore from './auth.js';



function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const saveStateToLocalStorage = (canisterName, canisterState) => {
  try {
    const stateString = JSON.stringify(canisterState);
    localStorage.setItem(`canister_${canisterName}`, stateString);
  } catch (error) {
    console.error("Error saving state to local storage:", error);
  }
};

const loadStateFromLocalStorage = (canisterName) => {
  try {
    const stateString = localStorage.getItem(`canister_${canisterName}`);
    return stateString ? JSON.parse(stateString) : null;
  } catch (error) {
    console.error("Error loading state from local storage:", error);
    return null;
  }
};

//use:
//const canisterState = canisters[canisterName];
//saveStateToLocalStorage(canisterName, canisterState);

const canisters = {
  cosmicrafts: null,
};

const createCanister = async (publicKey, privateKey, canisterName) =>{
  const identity = Ed25519KeyIdentity.fromKeyPair(
    base64ToUint8Array(publicKey),
    base64ToUint8Array(privateKey)
  );
  const authStore = useAuthStore();
  await authStore.setPrincipalId(identity.getPrincipal().toText());
  console.log(await authStore.getPrincipalId());
  const isLocal = process.env.DFX_NETWORK !== 'ic';
  const host = isLocal ?  'http://127.0.0.1:4943': 'https://ic0.app' ;
  const agent = new HttpAgent({ identity, host });
  if (isLocal) {
    try {
      await agent.fetchRootKey();
    } catch (err) {
      console.warn(
        "Unable to fetch root key."+ 
        "Check to ensure that your local replica is running"
      );
      console.error(err);
    }
  }
  try {
    canisters[canisterName] = createActor(canisterId, { agent });
  } catch (error) {
    console.error("Error initializing canister:", error);
  }
  console.log('AuthStore: canister initialized with keys');

};

const createCanisterFromAuthClient = async (identity, agent) => {

    try {
      const isLocal = process.env.DFX_NETWORK !== 'ic';
      const host = isLocal ?  'https://ic0.app': 'http://127.0.0.1:4943' ;

      if (isLocal) {
        try {
          await agent.fetchRootKey();
        } catch (err) {
          console.warn(
            "Unable to fetch root key."+ 
            "Check to ensure that your local replica is running"
          );
          console.error(err);
        }
      }

      try {
        this.cosmicraftsCanister = createActor(canisterId, { agent });
        console.log('AuthStore: From Authclient, cosmicraftsCanister initialized');
      } catch (error) {
        console.error("AuthStore: Error initializing canister:", error);
      }

      this.principalId = identity.getPrincipal(); 
      this.isAuthenticated= true;     
      this.saveStateToLocalStorage();
      
    } catch (error) {
      console.log("AuthStore: Error initializing canister:", error);
    }     
};

const get = async (canisterName) => {
  const authStore = useAuthStore();

  if (!authStore.keys) {
    console.log('CanisterStore: User keys not found');
    return false;
  }
  if (!canisters[canisterName]) {
    console.log('CanisterStore: Canister not loaded yet. Loading...');
    try {
      const keys = authStore.keys;
      await createCanister(keys.public, keys.private, canisterName);      
    }catch (error) {
      console.error("Error importing canister:", error);
    }
    console.log('CanisterStore: Canister '+ canisterName + ' loaded');  
  }
  return canisters[canisterName];

};

export const useCanisterStore = defineStore('canister', {
  state: () => ({
    canisters: canisters
  }),
  actions: {
    get
  },
});
export default useCanisterStore;

