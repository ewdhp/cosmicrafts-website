//use a factory instead of creating the canisters here.
//
//
//
//
//
import { defineStore } from 'pinia';
import { HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';
import MetaMaskService from '../services/MetaMaskService';
import PhantomService from '../services/PhantomService';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId, cosmicrafts } from '../../../declarations/cosmicrafts/index.js';
import { Principal } from '@dfinity/principal';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isRegistered: false,
    googleSub: '',
    principalId: '',
    cosmicraftsCanister: null,
    initialized: false,
  }),
  actions: {
    async initializeStore() {
      
      const storedData = localStorage.getItem('authStore');
      
      if (storedData) {
        const data = JSON.parse(storedData);
        this.user = data.user;
        this.isAuthenticated = data.isAuthenticated;
        this.isRegistered = data.isRegistered;
        this.googleSub = data.googleSub;
        this.principalId = data.principalId;
        this.cosmicraftsCanister = data.cosmicraftsCanister;
        this.initialized = true;
        this.saveStateToLocalStorage();
      }
    },
    async isPlayerRegistered() {

      const [result, player] = 
      await this.cosmicraftsCanister.getPlayerByCaller();
      console.log('AuthStore: result: ', result, player);
      if (result) {
        this.isRegistered = true;
        this.saveStateToLocalStorage();
        console.log('AuthStore: Player is registered');
        return true;
      }
      else {
        this.isRegistered = false;
        this.saveStateToLocalStorage();
        console.log('AuthStore: Player is not registered');
        return false;
      }
    },
    async loginWithGoogle(response) {
      const decodedIdToken = response.credential.split('.')[1];
      const payload = JSON.parse(atob(decodedIdToken));
      this.googleSub = payload.sub;
      await this.generateKeysFromSub(this.googleSub);
      this.isAuthenticated = true;
      this.saveStateToLocalStorage();
    },
    async loginWithMetaMask() {
      const uniqueMessage = 'Sign this message to log in with your Ethereum wallet';
      const signature = await MetaMaskService.signMessage(uniqueMessage);
      if (signature) {
        await this.generateKeysFromSignature(signature);
        this.isAuthenticated = true;
        this.saveStateToLocalStorage();
      }
    },
    async loginWithPhantom() {
      const message = 'Sign this message to log in with your Phantom Wallet';
      const signature = await PhantomService.signAndSend(message);
      if (signature) {
        await this.generateKeysFromSignature(signature);
        this.isAuthenticated = true;
        this.saveStateToLocalStorage();
      }
    },
    async loginWithInternetIdentity() {
      await this.loginWithAuthClient('https://identity.ic0.app');
      
    },
    async loginWithNFID() {
      await this.loginWithAuthClient('https://nfid.one/authenticate/?applicationName=COSMICRAFTS&applicationLogo=https://cosmicrafts.com/wp-content/uploads/2023/09/cosmisrafts-242x300.png#authorize');
    },
    async loginWithAuthClient(identityProviderUrl) {

      const authClient = await AuthClient.create();

      if(authClient !== null){ 
        this.authClient = authClient;
        console.log('AuthStore: AuthClient initialized from loginWithAuthClient');
      }else{
        console.log('AuthStore: AuthClient not initialized loginWithAuthClient');
        return false;
      }

      await authClient.login({
        identityProvider: identityProviderUrl,
        windowOpenerFeatures: `left=${window.screen.width / 2 - 525 / 2}, top=${window.screen.height / 2 - 705 / 2}, toolbar=0, location=0, menubar=0, width=525, height=705`,
        onSuccess: async () => {
          const identityFromAuthClient = authClient.getIdentity();
          const agent = new HttpAgent({ identityFromAuthClient, host: 'http://localhost:3000' });    
         await this.createCanistersFromAuthClient(identityFromAuthClient, agent); 
         
        },
        onError: (error) => {
          console.error('Authentication error:', error);
        },
      });
    },
    async createCanisters(publicKey, privateKey) {
      
      this.user = { publicKey, privateKey };
      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(this.user.publicKey),
        base64ToUint8Array(this.user.privateKey)
      );

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

      console.log(
        'AuthStore: Host:'+ host + ' , ' + 
        'COSMICRAFTS_CANISTER_ID:' + canisterId
      );

      try {
        this.cosmicraftsCanister = createActor(canisterId, { agent });
        console.log('AuthStore: cosmicraftsCanister initialized with keys');
      } catch (error) {
        console.error("Error initializing cosmicraftsCanister:", error);
      }

      this.principalId = identity.getPrincipal().toText();     
      this.saveStateToLocalStorage();

    },
    async createCanistersFromAuthClient(identity, agent) {

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
    
          console.log(
            'AuthStore: Host:'+ host + ' , ' + 
            'COSMICRAFTS_CANISTER_ID:' + canisterId
          );
    
          try {
            this.cosmicraftsCanister = createActor(canisterId, { agent });
            console.log('AuthStore: From Authclient, cosmicraftsCanister initialized');
          } catch (error) {
            console.error("AuthStore: Error initializing cosmicraftsCanister:", error);
          }
    
          this.principalId = identity.getPrincipal(); 
          this.isAuthenticated= true;     
          this.saveStateToLocalStorage();
         
        } catch (error) {
          console.log("AuthStore: Error initializing cosmicraftsCanister:", error);
        }     
    },
    async generateKeysFromSignature(signature) {
      const encoder = new TextEncoder();
      const encodedSignature = encoder.encode(signature);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSignature);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createCanisters(publicKeyBase64, privateKeyBase64);
      this.saveStateToLocalStorage();
    },
    async generateKeysFromSub(sub) {
      const encoder = new TextEncoder();
      const encodedSub = encoder.encode(sub);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSub);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createCanisters(publicKeyBase64, privateKeyBase64);
      this.saveStateToLocalStorage();
    },
    saveStateToLocalStorage() {
      const authData = {
        user: this.user,
        isAuthenticated: this.isAuthenticated,
        isRegistered : this.isRegistered,
        googleSub: this.googleSub,
        principalId: this.principalId,
        cosmicraftsCanister: this.cosmicraftsCanister,
        authClient: this.authClient ? true : false,
        identity: this.identity,
        initialized: this.initialized
      };
      localStorage.setItem('authStore', JSON.stringify(authData));
    },
    async logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.isregistered = false;
      this.googleSub = '';
      this.principalId = '';
      this.cosmicraftsCanister= null;
      this.authClient = false,
      this.identity = null;
      this.initialized = false;
      localStorage.removeItem('authStore');
    }
  },
});

export default useAuthStore;

function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}