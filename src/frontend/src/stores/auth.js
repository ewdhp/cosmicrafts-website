import { defineStore } from 'pinia';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';
import MetaMaskService from '../services/MetaMaskService';
import PhantomService from '../services/PhantomService';
import useCanisterStore from './canister.js';
import nacl from 'tweetnacl';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    keys: null,
    isAuthenticated: false,
    isRegistered: false,
    googleSub: '',
    initialized: false,
    principalId: '',
  }),
  actions: {
    async setRegistered(status) {
      this.isRegistered = status;
      this.saveStateToLocalStorage();
    },
    async setPrincipalId(status) {
      this.principalId = status;
      this.saveStateToLocalStorage();
    },
    async getPrincipalId() {
      return this.principalId;     
    },
    async isPlayerRegistered() {
      const canister = useCanisterStore();
      const cosmicrafts = await canister.get("cosmicrafts");
      const [result, player] = 
      await cosmicrafts.getPlayerByCaller();
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
      console.log('AuthStore: loginWithMetaMask');
      const uniqueMessage = 'Sign this message to log in with your Ethereum wallet';
      const signature = await MetaMaskService.signMessage(uniqueMessage);
      if (signature) {
        this.keys = await this.generateKeysFromSignature(signature);
        this.isAuthenticated = true;
        this.saveStateToLocalStorage();
        console.log('AuthStore: loginWithMetaMask keys generated');
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
          //await this.createCanisterFromAuthClient(identityFromAuthClient, agent); 
         
        },
        onError: (error) => {
          console.error('Authentication error:', error);
        },
      });
    },
    async generateKeysFromSignature (signature) {
      const encoder = new TextEncoder();
      const encodedSignature = encoder.encode(signature);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSignature);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);

      return {
        public: base64Encode(keyPair.publicKey),
        private: base64Encode(keyPair.secretKey)
      };
    }, 
    async generateKeysFromSub (sub) {
      const encoder = new TextEncoder();
      const encodedSub = encoder.encode(sub);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSub);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      await this.createCanister(publicKeyBase64, privateKeyBase64);
      this.saveStateToLocalStorage();
    },
    async storePublicKey() {
      const canister = useCanisterStore();
      const cosmicrafts = await canister.get("cosmicrafts");
      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(this.keys.public),
        base64ToUint8Array(this.keys.private)
      );
        try {
          const result = await cosmicrafts.storePublicKey(
            identity.getPrincipalId().toText(), 
            this.keys.public
          );
          if(result){
            console.log('Public key stored successfully');
          }else {
            console.log('Public key not stored');
          }         
        } catch (error) {
          console.error('Error storing public key:', error);
        }     
    },
    saveStateToLocalStorage() {
      localStorage.setItem('authStore', JSON.stringify(this.$state));
    },
    loadStateFromLocalStorage() {
      const state = localStorage.getItem('authStore');
      if (state) {
        this.$patch(JSON.parse(state));
      }
    },
    async logout() {
      this.keys = null;
      this.isAuthenticated = false;
      this.isregistered = false;
      this.googleSub = '';
      this.authClient = false,
      this.initialized = false;
      this.principalId = '';
      localStorage.removeItem('authStore');
    }
  },
});

export default useAuthStore;
